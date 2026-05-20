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

    // For authenticated users: verify ownership (unless admin)
    const session = await auth();
    if (session?.user?.id) {
      const isOwner = order.userId === session.user.id;
      const isAdmin = (session.user as any).role === 'ADMIN' || (session.user as any).role === 'SUPER_ADMIN';
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }
    }
    // Guest users can view orders by orderNumber (no auth required for confirmation page)

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch order' }, { status: 500 });
  }
}
