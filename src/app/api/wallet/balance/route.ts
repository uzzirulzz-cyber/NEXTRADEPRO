import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/rbac';
import prisma from '@/lib/db';

// GET /api/wallet/balance — get user's SPOT wallet balance
export async function GET(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request);
    if (response) return response;

    let wallet = await prisma.wallet.findFirst({
      where: { userId: payload.userId, type: 'SPOT' },
      include: { balances: true },
    });

    // Create wallet with default PKR and USDT balances if not found
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: payload.userId,
          type: 'SPOT',
          status: 'ACTIVE',
          totalEquity: 0,
          balances: {
            create: [
              { currency: 'PKR', amount: 0, frozen: 0 },
              { currency: 'USDT', amount: 0, frozen: 0 },
            ],
          },
        },
        include: { balances: true },
      });
    }

    return NextResponse.json({
      id: wallet.id,
      userId: wallet.userId,
      type: wallet.type,
      status: wallet.status,
      balances: wallet.balances,
      totalEquity: wallet.totalEquity,
      createdAt: wallet.createdAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}