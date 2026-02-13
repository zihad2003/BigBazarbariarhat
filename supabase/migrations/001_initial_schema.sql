-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS Table (Synced with Clerk)
CREATE TABLE public.users (
  id TEXT PRIMARY KEY, -- Clerk User ID
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES Table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS Table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2), -- Internal use only
  inventory_count INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  barcode TEXT,
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT VARIANTS Table (Added for SKU/Variant management)
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "Size: M / Color: Red"
  sku TEXT,
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  inventory_count INTEGER DEFAULT 0,
  attributes JSONB DEFAULT '{}', -- { "Size": "M", "Color": "Red" }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADDRESSES Table
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES public.users(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'Bangladesh',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS Table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT REFERENCES public.users(id),
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'pending', 'failed')),
  payment_intent_id TEXT, -- Stripe
  shipping_address_id UUID REFERENCES public.addresses(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GUEST ADDRESSES Table
CREATE TABLE public.guest_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Bangladesh',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS Table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id), -- Nullable if no variant
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL, -- Snapshot price at time of order
  total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CART ITEMS Table (Persistent Cart)
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);

-- REVIEWS Table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES public.users(id),
  product_id UUID REFERENCES public.products(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_cart_user ON public.cart_items(user_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_variants_product ON public.product_variants(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Can read own data. Admins can read all.
CREATE POLICY "Users can read own data" ON public.users 
  FOR SELECT USING (auth.uid()::text = id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Users can update own data" ON public.users 
  FOR UPDATE USING (auth.uid()::text = id);

-- Products & Categories & Variants: Public read. Admins write.
CREATE POLICY "Public read products" ON public.products 
  FOR SELECT USING (true);
CREATE POLICY "Admins write products" ON public.products 
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Public read variants" ON public.product_variants 
  FOR SELECT USING (true);
CREATE POLICY "Admins write variants" ON public.product_variants 
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Public read categories" ON public.categories 
  FOR SELECT USING (true);
CREATE POLICY "Admins write categories" ON public.categories 
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::text AND role = 'admin'));

-- Orders: Users read own. Admins read all.
CREATE POLICY "Users read own orders" ON public.orders 
  FOR SELECT USING (auth.uid()::text = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::text AND role = 'admin'));
CREATE POLICY "Users create own orders" ON public.orders 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Order Items: Users read own via order.
CREATE POLICY "Users read own order items" ON public.order_items 
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND (user_id = auth.uid()::text OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::text AND role = 'admin'))));

-- Addresses: Users read/write own.
CREATE POLICY "Users manage own addresses" ON public.addresses 
  FOR ALL USING (auth.uid()::text = user_id);

-- Cart Items: Users read/write own.
CREATE POLICY "Users manage own cart" ON public.cart_items 
  FOR ALL USING (auth.uid()::text = user_id);

-- Reviews: Public read. Users write only for purchased items (simplified here to authenticated users).
CREATE POLICY "Public read reviews" ON public.reviews 
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users write reviews" ON public.reviews 
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Functions for inventory management
CREATE OR REPLACE FUNCTION decrement_product_inventory(product_id UUID, quantity INTEGER)
RETURNS VOID AS $
BEGIN
    UPDATE public.products
    SET inventory_count = inventory_count - quantity
    WHERE id = product_id
    AND inventory_count >= quantity;
END;
$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_variant_inventory(variant_id UUID, quantity INTEGER)
RETURNS VOID AS $
BEGIN
    UPDATE public.product_variants
    SET inventory_count = inventory_count - quantity
    WHERE id = variant_id
    AND inventory_count >= quantity;
END;
$ LANGUAGE plpgsql;
