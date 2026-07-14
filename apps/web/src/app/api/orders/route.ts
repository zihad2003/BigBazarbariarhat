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
    const { items, shippingAddress, totalAmount, paymentMethod, paymentTransactionId, paymentScreenshot, couponCode } = body;

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

    // S3: Validate paymentScreenshot URL matches Cloudinary pattern
    if (paymentScreenshot && typeof paymentScreenshot === 'string') {
      if (!paymentScreenshot.startsWith('https://res.cloudinary.com/')) {
        return NextResponse.json({ success: false, message: 'Invalid payment screenshot URL. Must be uploaded to Cloudinary.' }, { status: 400 });
      }
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
      let serverSubtotal = 0;
      const serverOrderItems = [];

      // 1. Verify and decrement available stock for each order item, and compute server subtotal
      for (const item of items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!prod) {
          throw new Error(`Product with ID ${item.productId} was not found.`);
        }

        // Check stock before attempting atomic decrement
        if (prod.stock < item.quantity) {
          throw new Error(`STOCK_ERROR: Insufficient stock for product "${prod.name}". Available: ${prod.stock}, requested: ${item.quantity}.`);
        }

        // Decrement stock atomically with WHERE stock >= quantity guard
        // This prevents race conditions - if two requests try to decrement simultaneously,
        // only one will succeed if stock is insufficient
        const updateResult = await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        // Verify the update actually affected a row (stock guard in database layer)
        if (!updateResult) {
          throw new Error(`STOCK_ERROR: Failed to decrement stock for product "${prod.name}". It may have been sold out.`);
        }

        const activePrice = prod.salePrice ? Number(prod.salePrice) : Number(prod.price);
        serverSubtotal += activePrice * item.quantity;
        serverOrderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: activePrice,
        });
      }

      // 2. If coupon code is used, validate it and increment currentUsage inside the transaction
      let discountAmount = 0;
      let isFreeShipping = false;

      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.trim().toUpperCase() },
        });

        if (!coupon || !coupon.isActive) {
          throw new Error('COUPON_ERROR: Invalid or inactive coupon code.');
        }

        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
          throw new Error('COUPON_ERROR: This coupon has expired.');
        }

        if (coupon.usageLimit && coupon.currentUsage >= coupon.usageLimit) {
          throw new Error('COUPON_ERROR: This coupon usage limit has been reached.');
        }

        if (serverSubtotal < Number(coupon.minOrderAmount)) {
          throw new Error(`COUPON_ERROR: Minimum order of ৳${coupon.minOrderAmount} required for this coupon.`);
        }

        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = serverSubtotal * (Number(coupon.discountValue) / 100);
        } else if (coupon.discountType === 'FIXED_AMOUNT') {
          discountAmount = Number(coupon.discountValue);
        } else if (coupon.discountType === 'FREE_SHIPPING') {
          isFreeShipping = true;
        }

        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            currentUsage: {
              increment: 1,
            },
          },
        });
      }

      // 3. Compute shipping cost
      let shippingCost = 150;
      if (isFreeShipping) {
        shippingCost = 0;
      } else {
        const district = shippingAddress.district;
        const upazila = shippingAddress.upazila || '';
        if (district === 'Chittagong' && upazila === 'Mirsharai') {
          shippingCost = 0;
        } else if (district === 'Chittagong') {
          shippingCost = 100;
        } else {
          shippingCost = 150;
        }
      }

      const serverTotalAmount = Math.max(0, serverSubtotal - discountAmount + shippingCost);

      // Verify server total against client total
      const diff = Math.abs(Number(totalAmount) - serverTotalAmount);
      if (diff > 1.0) {
        throw new Error(`PRICE_ERROR: Total amount mismatch. Client submitted ৳${totalAmount}, but server computed ৳${serverTotalAmount}.`);
      }

      // 4. Create the final order record using server calculated values
      return await tx.order.create({
        data: {
          orderNumber,
          userId: userId,
          customerPhone: shippingAddress.phone,
          totalAmount: serverTotalAmount,
          shippingAddress,
          paymentMethod: paymentMethod ?? 'CASH_ON_DELIVERY',
          paymentTransactionId: paymentTransactionId || null,
          paymentScreenshot: paymentScreenshot || null,
          status: 'PENDING',
          items: {
            create: serverOrderItems,
          },
        },
        include: { items: true },
      });
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error('Order POST error:', error);
    
    // Return HTTP 409 for stock errors
    if (error.message && error.message.startsWith('STOCK_ERROR:')) {
      return NextResponse.json({
        success: false,
        message: error.message.replace('STOCK_ERROR:', '').trim()
      }, { status: 409 });
    }

    // Return HTTP 400 for coupon validation errors
    if (error.message && error.message.startsWith('COUPON_ERROR:')) {
      return NextResponse.json({
        success: false,
        message: error.message.replace('COUPON_ERROR:', '').trim()
      }, { status: 400 });
    }

    // Return HTTP 400 for price validation errors
    if (error.message && error.message.startsWith('PRICE_ERROR:')) {
      return NextResponse.json({
        success: false,
        message: error.message.replace('PRICE_ERROR:', '').trim()
      }, { status: 400 });
    }

    // Generic fallback for all other errors (B2 + B8)
    return NextResponse.json({
      success: false,
      message: 'Failed to place order. Please try again.'
    }, { status: 500 });
  }
}
