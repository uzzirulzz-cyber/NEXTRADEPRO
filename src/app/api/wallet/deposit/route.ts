import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/rbac';
import prisma from '@/lib/db';

// POST /api/wallet/deposit — create a deposit request
export async function POST(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request);
    if (response) return response;

    const body = await request.json();
    const { currency, amount, method, txHash } = body;

    // ── Validation ──
    if (!currency || typeof currency !== 'string' || currency.trim().length === 0) {
      return NextResponse.json({ error: 'currency is required' }, { status: 400 });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'amount is required and must be greater than 0' }, { status: 400 });
    }
    if (!method || typeof method !== 'string' || method.trim().length === 0) {
      return NextResponse.json({ error: 'method is required' }, { status: 400 });
    }

    const upperCurrency = currency.toUpperCase();

    // ── Create PENDING Transaction record ──
    const transaction = await prisma.transaction.create({
      data: {
        userId: payload.userId,
        type: 'DEPOSIT',
        status: 'PENDING',
        currency: upperCurrency,
        amount,
        fee: 0,
        description: `Deposit request: ${amount} ${upperCurrency} via ${method}`,
        metadata: {
          method,
          txHash: txHash || null,
        },
      },
    });

    return NextResponse.json({
      message: 'Deposit request submitted successfully',
      transaction: {
        id: transaction.id,
        userId: transaction.userId,
        type: transaction.type,
        status: transaction.status,
        currency: transaction.currency,
        amount: transaction.amount,
        fee: transaction.fee,
        description: transaction.description,
        metadata: transaction.metadata,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}