import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import InvitationCode from '@/models/InvitationCode';
import Wallet from '@/models/Wallet';
import Referral from '@/models/Referral';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { firstName, lastName, email, phone, password, invitationCode, name } = body;

    // Support both { firstName, lastName } and legacy { name } formats
    let finalFirstName = firstName?.trim();
    let finalLastName = lastName?.trim();
    let fullName: string;

    if (finalFirstName && finalLastName) {
      fullName = `${finalFirstName} ${finalLastName}`.trim();
    } else if (name?.trim()) {
      // Legacy format: split "John Doe" into first/last
      const parts = name.trim().split(/\s+/);
      finalFirstName = parts[0] || '';
      finalLastName = parts.slice(1).join(' ') || '';
      fullName = name.trim();
    } else {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Determine role — if invitation code provided, validate it; otherwise default to USER
    let role = 'USER';
    let referrerId: string | undefined;

    if (invitationCode && invitationCode.trim()) {
      const code = await InvitationCode.findOne({
        code: invitationCode.trim().toUpperCase(),
        status: 'UNUSED',
      });
      if (!code) {
        return NextResponse.json({ error: 'Invalid or used invitation code' }, { status: 400 });
      }
      role = code.role || 'USER';
      referrerId = code.createdBy;

      // Mark code as used
      code.status = 'USED';
      code.usedAt = new Date();
      await code.save();
    }

    // Check if email exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPw = await hashPassword(password);

    // Create user
    const user = await User.create({
      name: fullName,
      firstName: finalFirstName,
      lastName: finalLastName,
      email: email.toLowerCase(),
      password: hashedPw,
      role,
      status: 'ACTIVE',
      phone: phone || undefined,
    });

    // Update invitation code with usedBy
    if (invitationCode && invitationCode.trim()) {
      await InvitationCode.updateOne(
        { code: invitationCode.trim().toUpperCase() },
        { usedBy: user._id.toString() }
      );
    }

    // Create wallet
    await Wallet.create({
      userId: user._id.toString(),
      type: 'SPOT',
      balances: [
        { currency: 'USDT', amount: 0, frozen: 0 },
        { currency: 'BTC', amount: 0, frozen: 0 },
        { currency: 'ETH', amount: 0, frozen: 0 },
      ],
      totalEquity: 0,
    });

    // Create referral record if referred
    if (referrerId) {
      await Referral.create({
        referrerId,
        referredId: user._id.toString(),
        referralCode: invitationCode,
        level: 1,
        totalCommission: 0,
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}