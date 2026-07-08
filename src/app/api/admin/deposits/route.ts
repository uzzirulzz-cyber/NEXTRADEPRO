import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticate, getAccessibleUserIds } from '@/lib/rbac';

// GET /api/admin/deposits — List deposit transactions with RBAC
export async function GET(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request, ['SUPER_ADMIN', 'SUB_AGENT']);
    if (response) return response;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));

    const where: Record<string, unknown> = { type: 'DEPOSIT' };
    if (status) where.status = status.toUpperCase();

    // Sub-Agent: only their customers
    if (payload!.role === 'SUB_AGENT') {
      const allowedIds = await getAccessibleUserIds(payload!);
      where.userId = { in: allowedIds };
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    // Batch fetch user info
    const userIds = [...new Set(transactions.map(t => t.userId))];
    const users = userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true, phone: true, agentId: true },
        })
      : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    const enriched = transactions.map(tx => ({
      id: tx.id,
      userId: tx.userId,
      user: userMap.get(tx.userId) || null,
      currency: tx.currency,
      amount: tx.amount,
      fee: tx.fee,
      status: tx.status,
      method: tx.metadata?.method || null,
      txHash: tx.metadata?.txHash || null,
      note: tx.metadata?.note || null,
      description: tx.description,
      createdAt: tx.createdAt,
    }));

    return NextResponse.json({
      success: true,
      deposits: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch deposits';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// PUT /api/admin/deposits — Approve/reject deposit
export async function PUT(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request, ['SUPER_ADMIN']);
    if (response) return response;

    const { txId, action, note } = await request.json();
    if (!txId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'txId and action (approve/reject) required' }, { status: 400 });
    }

    const tx = await prisma.transaction.findUnique({ where: { id: txId } });
    if (!tx || tx.type !== 'DEPOSIT') {
      return NextResponse.json({ error: 'Deposit transaction not found' }, { status: 404 });
    }
    if (tx.status !== 'PENDING') {
      return NextResponse.json({ error: 'Deposit already processed' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'COMPLETED' : 'FAILED';
    const updatedTx = await prisma.transaction.update({
      where: { id: txId },
      data: {
        status: newStatus,
        metadata: { ...((tx.metadata as Record<string, unknown>) || {}), note: note || null, reviewedBy: payload.userId, reviewedAt: new Date().toISOString() },
      },
    });

    // If approved, credit user's USDT wallet balance
    if (action === 'approve') {
      const wallet = await prisma.wallet.findFirst({
        where: { userId: tx.userId, type: 'SPOT' },
        include: { balances: true },
      });

      if (wallet) {
        const usdtBalance = wallet.balances.find(b => b.currency === 'USDT');
        if (usdtBalance) {
          await prisma.walletBalance.update({
            where: { id: usdtBalance.id },
            data: { amount: { increment: tx.amount } },
          });
        } else {
          await prisma.walletBalance.create({
            data: { walletId: wallet.id, currency: 'USDT', amount: tx.amount, frozen: 0 },
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

    return NextResponse.json({ success: true, transaction: updatedTx });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update deposit';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}