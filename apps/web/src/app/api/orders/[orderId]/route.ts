export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@bigbazar/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  try {
    // Try to find by orderNumber first (used in confirmation page URLs), then by id
    let order = await prisma.order.findFirst({
      where: { orderNumber: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      });
    }

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Verify order access privileges
    const session = await auth();
    const isOwner = session?.user?.id ? order.userId === session.user.id : false;
    const isAdmin = session?.user?.id ? ((session.user as any).role === 'ADMIN' || (session.user as any).role === 'SUPER_ADMIN') : false;

    if (order.userId !== null) {
      // Registered order: Must be owner or admin
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }
    } else {
      // Guest order: Allow only if queried by orderNumber, OR if requester is an admin
      const queriedByOrderNumber = order.orderNumber === orderId;
      if (!queriedByOrderNumber && !isAdmin) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch order' }, { status: 500 });
  }
}
