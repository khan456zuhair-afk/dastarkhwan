-- ==========================================================
-- DASTARKHWAN RESTAURANT PLATFORM: INITIAL DATABASE SCHEMA
-- Migration: 20260911_initial_schema.sql
-- Single-Branch: DHA Phase 8, Karachi, Pakistan
-- ==========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- 1. PROFILES & ROLE-BASED ACCESS CONTROL
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index on email and role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Trigger: Automatically update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Security Trigger: Prevent users from escalating their own role
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.role IS DISTINCT FROM NEW.role) AND (current_user <> 'postgres' AND auth.role() <> 'service_role') THEN
    RAISE EXCEPTION 'Unauthorized: You do not possess permission to modify user roles.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_role_integrity
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- Trigger: Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'customer' -- Default is ALWAYS customer
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper functions for RLS checks (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==========================================================
-- 2. IMMUTABLE ADMIN AUDIT LOGS
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.admin_audit_logs(created_at DESC);

-- ==========================================================
-- 3. CATEGORIES & MENU ITEMS
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price INT NOT NULL CHECK (price >= 0), -- Price in PKR
  image_url TEXT NOT NULL,
  origin_badge TEXT,
  portion_info TEXT,
  ingredients TEXT[] DEFAULT '{}',
  dietary_tags TEXT[] DEFAULT '{}',
  spice_level INT DEFAULT 1 CHECK (spice_level BETWEEN 1 AND 4),
  preparation_time_minutes INT DEFAULT 25 CHECK (preparation_time_minutes > 0),
  is_available BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menu_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_slug ON public.menu_items(slug);
CREATE INDEX IF NOT EXISTS idx_menu_featured ON public.menu_items(is_featured);

CREATE TRIGGER set_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================================
-- 4. RESTAURANT TABLES & HOURS
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number TEXT NOT NULL UNIQUE,
  capacity INT NOT NULL CHECK (capacity > 0),
  location_area TEXT NOT NULL CHECK (location_area IN ('main_dining', 'family_majlis', 'sea_breeze_terrace', 'private_diwan')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.restaurant_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT false NOT NULL,
  notes TEXT,
  CONSTRAINT uq_day_of_week UNIQUE (day_of_week)
);

-- ==========================================================
-- 5. COUPONS
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INT NOT NULL CHECK (discount_value > 0),
  min_order_amount INT DEFAULT 0 NOT NULL,
  valid_from TIMESTAMPTZ DEFAULT now() NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  usage_count INT DEFAULT 0 NOT NULL,
  max_uses INT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================================
-- 6. ORDERS & ORDER ITEMS
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for guest checkout
  order_number TEXT NOT NULL UNIQUE, -- e.g. 'DST-ORD-84920'
  order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup', 'takeaway')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'online_sandbox', 'pos_cash', 'pos_card')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT,
  delivery_notes TEXT,
  subtotal INT NOT NULL CHECK (subtotal >= 0),
  delivery_fee INT DEFAULT 0 NOT NULL,
  discount INT DEFAULT 0 NOT NULL,
  tax INT DEFAULT 0 NOT NULL,
  total INT NOT NULL CHECK (total >= 0),
  applied_coupon_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name_snapshot TEXT NOT NULL,
  unit_price_snapshot INT NOT NULL CHECK (unit_price_snapshot >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  line_total INT NOT NULL CHECK (line_total >= 0),
  special_instructions TEXT
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ==========================================================
-- 7. TABLE RESERVATIONS
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reservation_code TEXT NOT NULL UNIQUE, -- e.g. 'DST-RES-9201'
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guest_count INT NOT NULL CHECK (guest_count BETWEEN 1 AND 30),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  special_request TEXT,
  seating_preference TEXT DEFAULT 'main_dining',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
  assigned_table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_res_date ON public.reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_res_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_res_code ON public.reservations(reservation_code);

CREATE TRIGGER set_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================================
-- 8. SALES TRANSACTIONS (CRITICAL FINANCIAL SEPARATION)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.sales_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('online', 'dine_in', 'takeaway')),
  source_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  table_number TEXT, -- Populated for dine-in POS
  customer_name TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'online_gateway', 'split')),
  subtotal INT NOT NULL CHECK (subtotal >= 0),
  discount INT DEFAULT 0 NOT NULL,
  tax INT DEFAULT 0 NOT NULL,
  total INT NOT NULL CHECK (total >= 0),
  transaction_status TEXT NOT NULL DEFAULT 'completed' CHECK (transaction_status IN ('completed', 'refunded', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sales_source ON public.sales_transactions(source);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales_transactions(created_at DESC);

-- ==========================================================
-- 9. RESTAURANT SETTINGS
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name TEXT DEFAULT 'Dastarkhwan' NOT NULL,
  branch_name TEXT DEFAULT 'DHA Phase 8 Flagship Haven' NOT NULL,
  branch_address TEXT DEFAULT 'Plot 14-C, Creek Avenue, Phase 8, DHA, Karachi, Pakistan' NOT NULL,
  phone TEXT DEFAULT '+92 21 3584 9200' NOT NULL,
  email TEXT DEFAULT 'contact@dastarkhwan.pk' NOT NULL,
  tax_rate_percent NUMERIC(4,2) DEFAULT 5.00 NOT NULL,
  delivery_fee_pkr INT DEFAULT 250 NOT NULL,
  min_delivery_order_pkr INT DEFAULT 1000 NOT NULL,
  max_reservation_guests INT DEFAULT 25 NOT NULL,
  reservation_slot_duration_minutes INT DEFAULT 120 NOT NULL,
  is_online_ordering_enabled BOOLEAN DEFAULT true NOT NULL,
  is_reservations_enabled BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Profiles are viewable by owner or admin"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin_or_staff());

CREATE POLICY "Profiles updateable by owner except role"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin());

-- ADMIN AUDIT LOGS (Append-only by staff/admin, viewable only by admin)
CREATE POLICY "Audit logs insertable by staff and admin"
ON public.admin_audit_logs FOR INSERT
WITH CHECK (public.is_admin_or_staff());

CREATE POLICY "Audit logs viewable only by admin"
ON public.admin_audit_logs FOR SELECT
USING (public.is_admin());

-- CATEGORIES POLICIES
CREATE POLICY "Categories viewable by everyone"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Categories manageable by admin"
ON public.categories FOR ALL
USING (public.is_admin());

-- MENU ITEMS POLICIES
CREATE POLICY "Active menu items viewable by everyone"
ON public.menu_items FOR SELECT
USING (is_available = true OR public.is_admin_or_staff());

CREATE POLICY "Menu items manageable by admin"
ON public.menu_items FOR ALL
USING (public.is_admin());

-- TABLES & HOURS POLICIES
CREATE POLICY "Tables and hours viewable by everyone"
ON public.restaurant_tables FOR SELECT USING (true);
CREATE POLICY "Tables manageable by admin"
ON public.restaurant_tables FOR ALL USING (public.is_admin());

CREATE POLICY "Hours viewable by everyone"
ON public.restaurant_hours FOR SELECT USING (true);
CREATE POLICY "Hours manageable by admin"
ON public.restaurant_hours FOR ALL USING (public.is_admin());

-- ORDERS POLICIES
CREATE POLICY "Public can insert orders"
ON public.orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Customers can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id OR public.is_admin_or_staff());

CREATE POLICY "Admin and staff can update orders"
ON public.orders FOR UPDATE
USING (public.is_admin_or_staff());

-- ORDER ITEMS POLICIES
CREATE POLICY "Order items insertable by anyone during checkout"
ON public.order_items FOR INSERT
WITH CHECK (true);

CREATE POLICY "Order items viewable by order owner or staff"
ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND (orders.user_id = auth.uid() OR public.is_admin_or_staff())
  )
);

-- RESERVATIONS POLICIES
CREATE POLICY "Public can submit reservations"
ON public.reservations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Customers view own reservations, admin views all"
ON public.reservations FOR SELECT
USING (auth.uid() = user_id OR public.is_admin_or_staff());

CREATE POLICY "Admins can update reservations"
ON public.reservations FOR UPDATE
USING (public.is_admin_or_staff());

-- SALES TRANSACTIONS POLICIES (STRICT SEPARATION: ZERO PUBLIC ACCESS)
CREATE POLICY "Sales transactions viewable only by admin and staff"
ON public.sales_transactions FOR SELECT
USING (public.is_admin_or_staff());

CREATE POLICY "Sales transactions insertable by staff and admin"
ON public.sales_transactions FOR INSERT
WITH CHECK (public.is_admin_or_staff());

-- SETTINGS POLICIES
CREATE POLICY "Settings viewable by everyone"
ON public.restaurant_settings FOR SELECT USING (true);

CREATE POLICY "Settings updateable only by admin"
ON public.restaurant_settings FOR UPDATE USING (public.is_admin());

