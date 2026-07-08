/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/rbac';
import prisma from '@/lib/db';

// GET /api/notifications — list user's notifications
export async function GET(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const typeFilter = searchParams.get('type') || '';
    const unreadParam = searchParams.get('unread');

    const where: Record<string, any> = { userId: payload.userId };

    if (typeFilter) {
      where.type = typeFilter;
    }

    if (unreadParam !== null) {
      where.read = unreadParam !== 'true';
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          type: true,
          priority: true,
          title: true,
          message: true,
          read: true,
          actionUrl: true,
          metadata: true,
          createdAt: true,
        },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId: payload.userId, read: false },
      }),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/notifications — mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request);
    if (response) return response;

    const body = await request.json();
    const { ids, read, markAllRead } = body;

    let updated: number;

    if (markAllRead) {
      const result = await prisma.notification.updateMany({
        where: { userId: payload.userId, read: false },
        data: { read: true },
      });
      updated = result.count;
    } else if (ids && Array.isArray(ids) && ids.length > 0) {
      const result = await prisma.notification.updateMany({
        where: {
          id: { in: ids },
          userId: payload.userId,
        },
        data: { read: read !== false },
      });
      updated = result.count;
    } else {
      return NextResponse.json({ error: 'Provide either "ids" or "markAllRead"' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}