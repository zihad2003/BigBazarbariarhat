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
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    let userId = session?.user?.id;

    try {
        const body = await req.json();
        const { items, shippingAddress, totalAmount, paymentMethod } = body;

        let userExists = false;
        if (userId) {
            const dbUser = await prisma.user.findUnique({ where: { id: userId } });
            if (dbUser) {
                userExists = true;
            }
        }

        if (!userId || !userExists) {
            console.log("No valid user session found or user ID doesn't exist in DB, locating or creating default user...");
            let defaultUser = await prisma.user.findFirst();
            console.log("Found defaultUser in DB:", defaultUser);
            if (!defaultUser) {
                console.log("No default user exists. Creating one now...");
                defaultUser = await prisma.user.create({
                    data: {
                        name: 'Guest Customer',
                        email: 'guest@bigbazar.com',
                        password: '$2b$10$Un6WbN6e/Y23/r4D/82WCOv5P0bI0f5F/e4Y3W2.g3n6i6W4u6yqW', // mock bcrypt hash
                        role: 'USER'
                    }
                });
                console.log("Created guest user in DB:", defaultUser);
            }
            userId = defaultUser.id;
        }

        console.log("Order creation payload details:", {
            userId,
            totalAmount,
            paymentMethod,
            items: items.map((i: any) => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
        });

        const order = await prisma.order.create({
            data: {
                orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                userId: userId,
                totalAmount,
                shippingAddress,
                paymentMethod,
                status: 'PENDING',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: { items: true }
        });

        return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (error) {
        console.error('Order POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
    }
}
