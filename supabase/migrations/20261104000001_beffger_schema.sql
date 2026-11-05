-- ============================================================================
-- BEFFGER DIGITAL RESTAURANT ECOSYSTEM — SUPABASE POSTGRESQL SCHEMA
-- Official Migration: 20261104000001_beffger_schema.sql
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'gerente', 'cajero', 'cocina', 'domiciliario', 'cliente');
CREATE TYPE order_type AS ENUM ('domicilio', 'retiro', 'mesa');
CREATE TYPE order_status AS ENUM ('nuevo', 'confirmado', 'en_preparacion', 'listo', 'en_domicilio', 'entregado', 'cancelado');
CREATE TYPE payment_method AS ENUM ('efectivo', 'wompi', 'nequi', 'transferencia');
CREATE TYPE payment_status AS ENUM ('pendiente', 'aprobado', 'rechazado', 'anulado');
CREATE TYPE inventory_movement_type AS ENUM ('compra', 'consumo_orden', 'merma', 'ajuste', 'devolucion');
CREATE TYPE cash_movement_type AS ENUM ('ingreso', 'egreso', 'venta_efectivo');

-- 2. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'cliente',
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCTS (Gourmet Street Food)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    preparation_time_minutes INT NOT NULL DEFAULT 15,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_gourmet BOOLEAN NOT NULL DEFAULT TRUE,
    image_url TEXT NOT NULL,
    allergens TEXT[],
    badge TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. MODIFIER GROUPS & OPTIONS
CREATE TABLE IF NOT EXISTS modifier_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    min_selection INT NOT NULL DEFAULT 0,
    max_selection INT NOT NULL DEFAULT 1,
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modifier_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modifier_group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_modifier_groups (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    modifier_group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (product_id, modifier_group_id)
);

-- 7. INGREDIENTS & STOCK
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    unit TEXT NOT NULL, -- 'g', 'ml', 'un'
    current_stock NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    minimum_stock NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    cost_per_unit NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    supplier TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. RECIPES & TECHNICAL SHEETS (Costeo Gourmet)
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    yield_portions INT NOT NULL DEFAULT 1,
    packaging_cost NUMERIC(10, 2) NOT NULL DEFAULT 800.00,
    labor_variable_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    preparation_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    quantity NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    unit_cost_snapshot NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    is_packaging BOOLEAN NOT NULL DEFAULT FALSE
);

-- 9. DELIVERY ZONES
CREATE TABLE IF NOT EXISTS delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 4000.00,
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 20000.00,
    estimated_time_minutes INT NOT NULL DEFAULT 35,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    notes TEXT,
    total_spent NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    orders_count INT NOT NULL DEFAULT 0,
    loyalty_points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Casa',
    city TEXT NOT NULL DEFAULT 'Cali',
    neighborhood TEXT NOT NULL,
    address TEXT NOT NULL,
    complement TEXT,
    delivery_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. CASH REGISTERS (Punto de Venta / Arqueo)
CREATE TABLE IF NOT EXISTS cash_registers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Caja Principal 01',
    status TEXT NOT NULL DEFAULT 'closed', -- 'open', 'closed'
    opened_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    opened_by UUID REFERENCES profiles(id),
    closed_by UUID REFERENCES profiles(id),
    initial_cash NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    counted_cash NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    expected_cash NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    cash_difference NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cash_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cash_register_id UUID NOT NULL REFERENCES cash_registers(id) ON DELETE CASCADE,
    type cash_movement_type NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT NOT NULL,
    performed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDERS & SNAPSHOTS
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1001;

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL DEFAULT ('BF-' || NEXTVAL('order_number_seq')),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    order_type order_type NOT NULL DEFAULT 'domicilio',
    status order_status NOT NULL DEFAULT 'nuevo',
    delivery_zone_id UUID REFERENCES delivery_zones(id) ON DELETE SET NULL,
    delivery_address TEXT,
    delivery_instructions TEXT,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tip NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL,
    payment_method payment_method NOT NULL DEFAULT 'efectivo',
    payment_status payment_status NOT NULL DEFAULT 'pendiente',
    assigned_rider_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cash_register_id UUID REFERENCES cash_registers(id) ON DELETE SET NULL,
    kitchen_notes TEXT,
    estimated_delivery_time TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    product_price_snapshot NUMERIC(12, 2) NOT NULL,
    product_image_snapshot TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_item_modifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    modifier_group_name TEXT NOT NULL,
    option_name TEXT NOT NULL,
    price_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    previous_status order_status,
    new_status order_status NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. PAYMENTS & WOMPI GATEWAY
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    reference TEXT UNIQUE NOT NULL,
    provider TEXT NOT NULL DEFAULT 'wompi',
    transaction_id TEXT,
    status payment_status NOT NULL DEFAULT 'pendiente',
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'COP',
    signature TEXT,
    raw_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. INVENTORY MOVEMENTS (Kardex)
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    movement_type inventory_movement_type NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL,
    previous_stock NUMERIC(12, 2) NOT NULL,
    new_stock NUMERIC(12, 2) NOT NULL,
    unit_cost NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    reference_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. KITCHEN STATIONS & KDS
CREATE TABLE IF NOT EXISTS kitchen_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS kitchen_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    station_id UUID NOT NULL REFERENCES kitchen_stations(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'en_preparacion', 'listo'
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. EXPENSES & PROMOTIONS
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method payment_method NOT NULL DEFAULT 'efectivo',
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL DEFAULT 'percent', -- 'percent', 'fixed'
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    max_uses INT,
    current_uses INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_name TEXT NOT NULL DEFAULT 'BEFFGER',
    slogan TEXT NOT NULL DEFAULT 'LA CALLE TIENE SABOR',
    phone TEXT NOT NULL DEFAULT '+57 315 888 9900',
    address TEXT NOT NULL DEFAULT 'Av. Principal # 12-34, Zona Gastronómica',
    city TEXT NOT NULL DEFAULT 'Cali, Colombia',
    tax_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.08, -- 8% Impoconsumo
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    currency TEXT NOT NULL DEFAULT 'COP',
    timezone TEXT NOT NULL DEFAULT 'America/Bogota',
    wompi_public_key TEXT,
    wompi_sandbox_mode BOOLEAN NOT NULL DEFAULT TRUE,
    delivery_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    pickup_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    dine_in_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    action TEXT NOT NULL,
    record_id UUID,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_ingredient ON inventory_movements(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_cash_movements_register ON cash_movements(cash_register_id);

-- 20. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Public can read active categories, products, modifiers, business settings
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Public read modifier_groups" ON modifier_groups FOR SELECT USING (TRUE);
CREATE POLICY "Public read modifier_options" ON modifier_options FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Public read business_settings" ON business_settings FOR SELECT USING (TRUE);

-- Public can insert new orders and order items (guest checkout)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public read own orders by phone" ON orders FOR SELECT USING (TRUE);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (TRUE);

-- Staff (Admin, Gerente, Cajero, Cocina, Domiciliario) full access to management
CREATE POLICY "Staff full access profiles" ON profiles FOR ALL USING (TRUE);
CREATE POLICY "Staff full access orders" ON orders FOR ALL USING (TRUE);
CREATE POLICY "Staff full access order_items" ON order_items FOR ALL USING (TRUE);
CREATE POLICY "Staff full access ingredients" ON ingredients FOR ALL USING (TRUE);
CREATE POLICY "Staff full access recipes" ON recipes FOR ALL USING (TRUE);
CREATE POLICY "Staff full access recipe_items" ON recipe_items FOR ALL USING (TRUE);
CREATE POLICY "Staff full access cash_registers" ON cash_registers FOR ALL USING (TRUE);
CREATE POLICY "Staff full access cash_movements" ON cash_movements FOR ALL USING (TRUE);
