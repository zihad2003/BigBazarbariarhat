// Supabase-based Order Service
// Since the project uses Supabase directly, we'll implement the service using Supabase client

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const OrderService = {
    async list(filters: any) {
        const { search, status, page = 1, limit = 10, userId } = filters;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('orders')
            .select('*, user:users(id, first_name, last_name, email), order_items(quantity, product:products(name, slug, images))', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (search) {
            query = query.or(`order_number.ilike.%${search}%,guest_name.ilike.%${search}%`);
        }

        if (status) {
            query = query.eq('status', status);
        }

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data: orders, error, count } = await query;

        if (error) {
            throw error;
        }

        return {
            data: orders,
            pagination: {
                total: count || 0,
                page,
                limit,
                totalPages: count ? Math.ceil(count / limit) : 0
            }
        };
    },

    async getById(id: string) {
        const { data: order, error } = await supabase
            .from('orders')
            .select(`*,
                order_items(*,
                    product:products(*),
                    variant:product_variants(*)
                ),
                user:users(*),
                shipping_address:addresses(*),
                guest_address:guest_addresses(*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return order;
    },

    async create(data: any) {
        const {
            items,
            guestEmail,
            guestPhone,
            guestName,
            guestAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            taxAmount,
            totalAmount,
            userId,
        } = data;

        // Generate order number
        const { count: orderCount, error: countError } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true });

        if (countError) {
            throw countError;
        }

        const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String((orderCount || 0) + 1).padStart(4, '0')}`;

        // Create the order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                user_id: userId || null,
                guest_name: guestName,
                guest_email: guestEmail,
                guest_phone: guestPhone,
                payment_method: paymentMethod,
                status: 'pending',
                payment_status: paymentMethod === 'CASH_ON_DELIVERY' ? 'unpaid' : 'pending',
                subtotal,
                shipping_cost: shippingCost,
                tax_amount: taxAmount,
                total_amount: totalAmount,
            })
            .select('*')
            .single();

        if (orderError) {
            throw orderError;
        }

        // Create guest address if provided
        if (guestAddress) {
            const { error: addressError } = await supabase
                .from('guest_addresses')
                .insert({
                    order_id: order.id,
                    address_line1: guestAddress.addressLine1,
                    city: guestAddress.city,
                    country: guestAddress.country || 'Bangladesh',
                    postal_code: guestAddress.postalCode || '1200',
                });

            if (addressError) {
                throw addressError;
            }
        }

        // Create order items
        for (const item of items) {
            const { error: itemError } = await supabase
                .from('order_items')
                .insert({
                    order_id: order.id,
                    product_id: item.productId,
                    variant_id: item.variantId || null,
                    quantity: item.quantity,
                    unit_price: item.price,
                });

            if (itemError) {
                throw itemError;
            }

            // Update inventory
            if (item.variantId) {
                const { error: variantError } = await supabase
                    .rpc('decrement_variant_inventory', {
                        variant_id: item.variantId,
                        quantity: item.quantity
                    });

                if (variantError) {
                    throw variantError;
                }
            } else {
                const { error: productError } = await supabase
                    .rpc('decrement_product_inventory', {
                        product_id: item.productId,
                        quantity: item.quantity
                    });

                if (productError) {
                    throw productError;
                }
            }
        }

        // Return the complete order with items
        return this.getById(order.id);
    },

    async updateStatus(id: string, data: any) {
        const { data: order, error } = await supabase
            .from('orders')
            .update({
                status: data.status,
                payment_status: data.paymentStatus,
                tracking_number: data.trackingNumber,
                admin_notes: data.adminNotes,
                estimated_delivery: data.estimatedDelivery
            })
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            throw error;
        }

        return order;
    }
};
