import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticate, getAccessibleUserIds } from '@/lib/rbac';

// GET /api/admin/withdrawals — List withdrawal transactions with RBAC
export async function GET(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request, ['SUPER_ADMIN', 'SUB_AGENT']);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const status = searchParams.get('status') || '';

    const where: Record<string, unknown> = { type: 'WITHDRAW' };
    if (status) where.status = status.toUpperCase();

    // Sub-Agent: only their customers' withdrawals
    if (payload!.role === 'SUB_AGENT') {
      const allowedIds = await getAccessibleUserIds(payload!);
      where.userId = { in: allowedIds };
    }

    const [txs, total] = await Promise.all([
      prisma.transaction.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.transaction.count({ where }),
    ]);

    const userIds = [...new Set(txs.map(t => t.userId))];
    const users = userIds.length > 0
      ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true, phone: true, agentId: true, invitationCode: true } })
      : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    const enriched = txs.map(tx => ({
      id: tx.id,
      userId: tx.userId,
      user: userMap.get(tx.userId) || null,
      currency: tx.currency,
      amount: tx.amount,
      fee: tx.fee,
      status: tx.status,
      method: tx.metadata?.method || null,
      accountNumber: tx.metadata?.accountNumber || null,
      accountName: tx.metadata?.accountName || null,
      description: tx.description,
      createdAt: tx.createdAt,
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

// PUT /api/admin/withdrawals — approve/reject (SUPER_ADMIN only)
export async function PUT(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request, ['SUPER_ADMIN']);
    if (response) return response;

    const { txId, action, note } = await request.json();
    if (!txId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'txId and action (approve/reject) required' }, { status: 400 });
    }

    const tx = await prisma.transaction.findUnique({ where: { id: txId } });
    if (!tx || tx.type !== 'WITHDRAW') {
      return NextResponse.json({ error: 'Withdrawal transaction not found' }, { status: 404 });
    }
    if (tx.status !== 'PENDING') {
      return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 400 });
    }

    let newStatus: string;
    if (action === 'approve') {
      newStatus = 'COMPLETED';
    } else {
      newStatus = 'CANCELLED';
    }

    const updatedTx = await prisma.transaction.update({
      where: { id: txId },
      data: {
        status: newStatus,
        metadata: { ...((tx.metadata as Record<string, unknown>) || {}), note: note || null, reviewedBy: payload.userId, reviewedAt: new Date().toISOString() },
      },
    });

    // Update wallet balance
    const wallet = await prisma.wallet.findFirst({
      where: { userId: tx.userId, type: 'SPOT' },
      include: { balances: true },
    });

    if (wallet) {
      const balance = wallet.balances.find(b => b.currency === tx.currency);
      if (balance) {
        if (action === 'approve') {
          // Deduct frozen amount (was frozen when withdrawal was created)
          await prisma.walletBalance.update({
            where: { id: balance.id },
            data: { frozen: { decrement: tx.amount } },
          });
        } else {
          // Reject: unfreeze — move frozen back to available
          await prisma.walletBalance.update({
            where: { id: balance.id },
            data: { frozen: { decrement: tx.amount }, amount: { increment: tx.amount } },
          });
        }
        // Recalculate totalEquity
        const updatedBalances = await prisma.walletBalance.findMany({ where: { walletId: wallet.id } });
        const totalEquity = updatedBalances.reduce((sum, b) => sum + b.amount + b.frozen, 0);
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { totalEquity },
        });
      }
    }

    return NextResponse.json({ success: true, message: `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'}`, transaction: updatedTx });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}