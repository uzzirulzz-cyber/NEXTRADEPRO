import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken, extractBearerToken } from '@/lib/auth';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

// GET /api/admin/withdrawals — list withdrawal requests
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = extractBearerToken(request.headers.get('authorization'));
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'SUB_AGENT')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const status = searchParams.get('status') || '';

    const filter: Record<string, any> = { type: 'WITHDRAW' };
    if (status) filter.status = status;

    const [txs, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    // Enrich with user info
    const userIds = [...new Set(txs.map((t) => t.userId))];
    const users = await User.find({ _id: { $in: userIds } }).select('name email phone').lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const enriched = txs.map((tx) => ({
      ...tx,
      _id: tx._id.toString(),
      user: userMap.get(tx.userId.toString()) || null,
    }));

    return NextResponse.json({
      withdrawals: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/admin/withdrawals — approve/reject a withdrawal
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const token = extractBearerToken(request.headers.get('authorization'));
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: SUPER_ADMIN only' }, { status: 403 });
    }

    const { txId, status } = await request.json();
    if (!txId || !status) {
      return NextResponse.json({ error: 'txId and status required' }, { status: 400 });
    }
    if (!['COMPLETED', 'CANCELLED', 'FAILED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const tx = await Transaction.findByIdAndUpdate(txId, { status }, { new: true }).lean();
    if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

    return NextResponse.json({ message: `Withdrawal ${status.toLowerCase()}`, transaction: tx });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}