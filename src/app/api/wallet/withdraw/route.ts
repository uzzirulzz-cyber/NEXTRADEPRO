/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/rbac';
import prisma from '@/lib/db';

const VALID_METHODS = ['JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER', 'VISA', 'MASTERCARD'];

// POST /api/wallet/withdraw — user-initiated withdrawal
export async function POST(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request);
    if (response) return response;

    const body = await request.json();
    const { currency, amount, method, accountNumber, accountName } = body;

    // ── Validation ──
    if (!currency || typeof currency !== 'string' || currency.trim().length === 0) {
      return NextResponse.json({ error: 'currency is required' }, { status: 400 });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'amount is required and must be greater than 0' }, { status: 400 });
    }
    if (!method || !VALID_METHODS.includes(method)) {
      return NextResponse.json({ error: `method is required and must be one of: ${VALID_METHODS.join(', ')}` }, { status: 400 });
    }
    if (!accountNumber || typeof accountNumber !== 'string' || accountNumber.trim().length === 0) {
      return NextResponse.json({ error: 'accountNumber is required' }, { status: 400 });
    }
    if (!accountName || typeof accountName !== 'string' || accountName.trim().length === 0) {
      return NextResponse.json({ error: 'accountName is required' }, { status: 400 });
    }

    const upperCurrency = currency.toUpperCase();

    // ── Calculate fee ──
    let fee: number;
    if (upperCurrency === 'PKR') {
      fee = Math.max(50, amount * 0.02);
    } else {
      fee = Math.max(1, amount * 0.01);
    }
    const netAmount = amount - fee;

    if (netAmount <= 0) {
      return NextResponse.json({ error: 'Amount too small after fee deduction' }, { status: 400 });
    }

    // ── Find SPOT wallet with balances ──
    const wallet = await prisma.wallet.findFirst({
      where: { userId: payload.userId, type: 'SPOT' },
      include: { balances: true },
    });
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found. Please create a wallet first.' }, { status: 400 });
    }
    if (wallet.status === 'FROZEN') {
      return NextResponse.json({ error: 'Wallet is frozen. Cannot process withdrawal.' }, { status: 400 });
    }

    // ── Check sufficient balance ──
    const balanceEntry = wallet.balances.find((b) => b.currency === upperCurrency);

    if (!balanceEntry || balanceEntry.amount < amount) {
      const available = balanceEntry ? balanceEntry.amount : 0;
      return NextResponse.json(
        { error: `Insufficient ${upperCurrency} balance. Available: ${available}` },
        { status: 400 }
      );
    }

    // ── Freeze the amount ──
    await prisma.walletBalance.update({
      where: { id: balanceEntry.id },
      data: { amount: { decrement: amount }, frozen: { increment: amount } },
    });

    // ── Recalculate wallet totalEquity ──
    const updatedBalances = await prisma.walletBalance.findMany({
      where: { walletId: wallet.id },
    });
    const newTotalEquity = updatedBalances.reduce((sum, b) => sum + b.amount + b.frozen, 0);
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { totalEquity: newTotalEquity },
    });

    // ── Create PENDING Transaction record ──
    const tx = await prisma.transaction.create({
      data: {
        userId: payload.userId,
        type: 'WITHDRAW',
        status: 'PENDING',
        currency: upperCurrency,
        amount,
        fee,
        description: `Withdrawal request: ${amount} ${upperCurrency} via ${method}`,
        metadata: {
          method,
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim(),
          netAmount,
        },
      },
    });

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully',
      transaction: {
        id: tx.id,
        type: tx.type,
        status: tx.status,
        currency: tx.currency,
        amount: tx.amount,
        fee: tx.fee,
        description: tx.description,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}