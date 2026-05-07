import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
    try {
        console.log("Checking for users...");
        let user = await prisma.user.findFirst();
        console.log("User ID:", user?.id || "None");

        if (!user) {
            console.log("No user found. Attempting to create guest system user...");
            user = await prisma.user.create({
                data: {
                    name: 'Guest Customer',
                    email: 'guest@bigbazar.com',
                    password: '$2b$10$Un6WbN6e/Y23/r4D/82WCOv5P0bI0f5F/e4Y3W2.g3n6i6W4u6yqW',
                    role: 'USER'
                }
            });
            console.log("Created User ID:", user.id);
        }

        console.log("Checking for products...");
        const product = await prisma.product.findFirst();
        console.log("Product ID:", product?.id || "None");

        if (!product) {
            console.error("Missing product!");
            return;
        }

        console.log("Attempting order insertion...");
        const order = await prisma.order.create({
            data: {
                orderNumber: `ORD-TEST-${Date.now()}`,
                userId: user.id,
                totalAmount: 1720,
                shippingAddress: {
                    fullName: "Test Customer",
                    phone: "01712345678",
                    address: "House 45, Mirsarai",
                    deliveryArea: "mirsarai"
                },
                paymentMethod: "cod",
                status: "PENDING",
                items: {
                    create: [{
                        productId: product.id,
                        quantity: 1,
                        price: 1720
                    }]
                }
            },
            include: { items: true }
        });
        console.log("Success! Created order:", order.id);
    } catch (e) {
        console.error("Order insertion failed with error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
