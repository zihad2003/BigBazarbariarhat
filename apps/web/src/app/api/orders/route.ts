import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { items, shippingAddress, totalAmount, paymentMethod, paymentTransactionId } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Order must contain at least one item.' }, { status: 400 });
    }
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
      return NextResponse.json({ success: false, message: 'Shipping address with name and phone is required.' }, { status: 400 });
    }
    
    // Bangladesh mobile number format validation: 01[3-9]XXXXXXXX
    const isBDPhone = /^01[3-9]\d{8}$/.test(shippingAddress.phone);
    if (!isBDPhone) {
      return NextResponse.json({ success: false, message: 'সঠিক বাংলাদেশী মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।' }, { status: 400 });
    }

    if (!totalAmount || isNaN(Number(totalAmount))) {
      return NextResponse.json({ success: false, message: 'Invalid total amount.' }, { status: 400 });
    }

    // Determine userId — null for guests (guest checkout is supported)
    let userId: string | null = null;
    if (session?.user?.id) {
      const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (dbUser) {
        userId = dbUser.id;
      }
    }

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${globalThis.crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    // Create the order and decrement product stock within a database transaction to prevent overselling
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify and decrement available stock for each order item
      for (const item of items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!prod) {
          throw new Error(`Product with ID ${item.productId} was not found.`);
        }

        if (prod.stock < item.quantity) {
          throw new Error(`Insufficient stock for product "${prod.name}". Available: ${prod.stock}, requested: ${item.quantity}.`);
        }

        // Decrement stock atomically
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 2. Create the final order record
      return await tx.order.create({
        data: {
          orderNumber,
          userId: userId,
          customerPhone: shippingAddress.phone,
          totalAmount: Number(totalAmount),
          shippingAddress,
          paymentMethod: paymentMethod ?? 'CASH_ON_DELIVERY',
          paymentTransactionId: paymentTransactionId || null,
          status: 'PENDING',
          items: {
            create: items.map((item: { productId: string; quantity: number; price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: Number(item.price),
            })),
          },
        },
        include: { items: true },
      });
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}
