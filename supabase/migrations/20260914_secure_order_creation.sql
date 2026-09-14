-- ==========================================================
-- DASTARKHWAN MIGRATION: SECURE SERVER-SIDE ORDER CREATION
-- Date: 2026-09-14
-- Purpose:
--   1. Idempotently verify coupon & restaurant setting columns.
--   2. Replace direct client table inserts with a hardened,
--      atomic, SECURITY DEFINER Postgres function (create_order).
--   3. Calculate all prices, taxes, delivery fees, and discounts
--      strictly server-side (zero trust for client-provided prices).
--   4. Fetch latest active restaurant settings ordered by updated_at DESC.
--   5. Enforce minimum delivery order threshold and live coupon rules.
--   6. Revoke public direct INSERT policies on orders and order_items.
-- ==========================================================

-- 1. SCHEMA VERIFICATIONS & COLUMN HARDENING
-- Ensure coupons table has usage tracking columns
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS max_uses INT DEFAULT NULL;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS usage_count INT NOT NULL DEFAULT 0;

-- Ensure restaurant_settings has created_at alongside existing updated_at
ALTER TABLE public.restaurant_settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now() NOT NULL;


-- 2. HARDEN ROW LEVEL SECURITY (RLS) POLICIES
-- Remove permissive public INSERT policies (closes client price tampering vulnerability)
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Order items insertable by anyone during checkout" ON public.order_items;

-- Allow only administrators and staff to perform raw inserts (e.g. POS / manual entry)
DROP POLICY IF EXISTS "Admin and staff can insert orders" ON public.orders;
CREATE POLICY "Admin and staff can insert orders"
ON public.orders FOR INSERT
WITH CHECK (public.is_admin_or_staff());

DROP POLICY IF EXISTS "Admin and staff can insert order items" ON public.order_items;
CREATE POLICY "Admin and staff can insert order items"
ON public.order_items FOR INSERT
WITH CHECK (public.is_admin_or_staff());


-- 3. CREATE SECURE ORDER CREATION FUNCTION
CREATE OR REPLACE FUNCTION public.create_order(
  p_order_type TEXT,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_items JSONB,
  p_delivery_address TEXT DEFAULT NULL,
  p_customer_email TEXT DEFAULT NULL,
  p_delivery_notes TEXT DEFAULT NULL,
  p_coupon_code TEXT DEFAULT NULL,
  p_payment_method TEXT DEFAULT 'cod'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_settings RECORD;
  v_tax_rate NUMERIC(4,2);
  v_delivery_fee_setting INT;
  v_min_delivery_order INT;
  v_is_ordering_enabled BOOLEAN;

  v_item_elem JSONB;
  v_menu_item_id UUID;
  v_quantity INT;
  v_instructions TEXT;

  v_db_item RECORD;
  v_subtotal INT := 0;
  v_line_total INT := 0;
  v_delivery_fee INT := 0;
  v_discount INT := 0;
  v_tax INT := 0;
  v_total INT := 0;

  v_clean_coupon TEXT := NULL;
  v_coupon RECORD;
  v_applied_coupon TEXT := NULL;

  v_order_number TEXT;
  v_order_id UUID;
  v_user_id UUID;
BEGIN
  -- ---------------------------------------------------------
  -- A. INPUT SANITIZATION & VALIDATION
  -- ---------------------------------------------------------

  -- Order Type Validation (supports online delivery/pickup as well as takeaway)
  IF p_order_type IS NULL OR p_order_type NOT IN ('delivery', 'pickup', 'takeaway') THEN
    RAISE EXCEPTION 'Invalid order type: "%". Must be delivery, pickup, or takeaway.', p_order_type;
  END IF;

  -- Customer Identity Validation
  IF p_customer_name IS NULL OR trim(p_customer_name) = '' THEN
    RAISE EXCEPTION 'Customer name is required.';
  END IF;

  IF p_customer_phone IS NULL OR trim(p_customer_phone) = '' THEN
    RAISE EXCEPTION 'Customer phone number is required.';
  END IF;

  -- Delivery Address Validation for Delivery Orders
  IF p_order_type = 'delivery' AND (p_delivery_address IS NULL OR trim(p_delivery_address) = '') THEN
    RAISE EXCEPTION 'Delivery address is required for delivery orders in DHA Phase 8 & Clifton.';
  END IF;

  -- Payment Method Validation
  IF p_payment_method IS NULL OR p_payment_method NOT IN ('cod', 'online_sandbox', 'pos_cash', 'pos_card') THEN
    RAISE EXCEPTION 'Invalid payment method: "%".', p_payment_method;
  END IF;

  -- Items Array Validation
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item.';
  END IF;

  -- ---------------------------------------------------------
  -- B. RESTAURANT SETTINGS VERIFICATION (Most Recently Updated)
  -- ---------------------------------------------------------
  SELECT
    tax_rate_percent,
    delivery_fee_pkr,
    min_delivery_order_pkr,
    is_online_ordering_enabled
  INTO v_settings
  FROM public.restaurant_settings
  ORDER BY updated_at DESC
  LIMIT 1;

  IF FOUND THEN
    v_tax_rate := v_settings.tax_rate_percent;
    v_delivery_fee_setting := v_settings.delivery_fee_pkr;
    v_min_delivery_order := v_settings.min_delivery_order_pkr;
    v_is_ordering_enabled := v_settings.is_online_ordering_enabled;
  ELSE
    -- Conservative defaults if settings row is uninitialized
    v_tax_rate := 5.00;
    v_delivery_fee_setting := 250;
    v_min_delivery_order := 1000;
    v_is_ordering_enabled := true;
  END IF;

  IF NOT v_is_ordering_enabled THEN
    RAISE EXCEPTION 'Online ordering is currently suspended by restaurant management.';
  END IF;

  -- ---------------------------------------------------------
  -- C. VALIDATE ITEMS & COMPUTE SUBTOTAL FROM LIVE PRICES
  -- ---------------------------------------------------------
  -- We loop through each client item, inspect real menu_items records,
  -- verify availability, and calculate true line totals.
  FOR v_item_elem IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    BEGIN
      v_menu_item_id := (v_item_elem->>'menu_item_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid menu_item_id format in order item payload: %', v_item_elem->>'menu_item_id';
    END;

    IF v_menu_item_id IS NULL THEN
      RAISE EXCEPTION 'Each order item must specify a valid menu_item_id.';
    END IF;

    v_quantity := (v_item_elem->>'quantity')::INT;
    IF v_quantity IS NULL OR v_quantity <= 0 THEN
      RAISE EXCEPTION 'Item quantity must be a positive integer greater than zero.';
    END IF;

    -- Fetch live item snapshot from database
    SELECT id, name, price, is_available
    INTO v_db_item
    FROM public.menu_items
    WHERE id = v_menu_item_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Menu item "%" does not exist in the imperial catalog.', v_menu_item_id;
    END IF;

    IF NOT v_db_item.is_available THEN
      RAISE EXCEPTION 'Dish "%" is currently unavailable from the kitchen.', v_db_item.name;
    END IF;

    -- Subtotal calculation strictly uses database price
    v_line_total := v_db_item.price * v_quantity;
    v_subtotal := v_subtotal + v_line_total;
  END LOOP;

  -- ---------------------------------------------------------
  -- D. MINIMUM ORDER THRESHOLD CHECK FOR DELIVERY
  -- ---------------------------------------------------------
  IF p_order_type = 'delivery' AND v_subtotal < v_min_delivery_order THEN
    RAISE EXCEPTION 'Minimum order amount for imperial delivery is Rs. % (current subtotal: Rs. %).',
      v_min_delivery_order, v_subtotal;
  END IF;

  -- ---------------------------------------------------------
  -- E. COUPON CODE VALIDATION & DISCOUNT CALCULATION
  -- ---------------------------------------------------------
  IF p_coupon_code IS NOT NULL AND trim(p_coupon_code) <> '' THEN
    v_clean_coupon := upper(trim(p_coupon_code));

    SELECT *
    INTO v_coupon
    FROM public.coupons
    WHERE upper(code) = v_clean_coupon;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Coupon code "%" is invalid or does not exist.', v_clean_coupon;
    END IF;

    IF NOT v_coupon.is_active THEN
      RAISE EXCEPTION 'Coupon code "%" is no longer active.', v_clean_coupon;
    END IF;

    IF now() < v_coupon.valid_from THEN
      RAISE EXCEPTION 'Coupon code "%" is not yet active.', v_clean_coupon;
    END IF;

    IF now() > v_coupon.valid_until THEN
      RAISE EXCEPTION 'Coupon code "%" has expired.', v_clean_coupon;
    END IF;

    IF v_coupon.max_uses IS NOT NULL AND v_coupon.usage_count >= v_coupon.max_uses THEN
      RAISE EXCEPTION 'Coupon code "%" has reached its maximum redemption limit.', v_clean_coupon;
    END IF;

    IF v_subtotal < v_coupon.min_order_amount THEN
      RAISE EXCEPTION 'Coupon code "%" requires a minimum order amount of Rs. % (current subtotal: Rs. %).',
        v_clean_coupon, v_coupon.min_order_amount, v_subtotal;
    END IF;

    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
      v_discount := round(v_subtotal * (v_coupon.discount_value::NUMERIC / 100.0))::INT;
    ELSIF v_coupon.discount_type = 'fixed' THEN
      v_discount := least(v_subtotal, v_coupon.discount_value);
    ELSE
      v_discount := 0;
    END IF;

    -- Increment usage count
    UPDATE public.coupons
    SET usage_count = usage_count + 1
    WHERE id = v_coupon.id;

    v_applied_coupon := v_coupon.code;
  END IF;

  -- ---------------------------------------------------------
  -- F. FINANCIAL TOTALS COMPUTATION
  -- ---------------------------------------------------------
  IF p_order_type = 'delivery' THEN
    v_delivery_fee := v_delivery_fee_setting;
  ELSE
    v_delivery_fee := 0;
  END IF;

  v_tax := round(v_subtotal * (v_tax_rate / 100.0))::INT;
  v_total := greatest(0, v_subtotal + v_delivery_fee + v_tax - v_discount);

  -- ---------------------------------------------------------
  -- G. GENERATE UNIQUE HUMAN-READABLE ORDER NUMBER
  -- ---------------------------------------------------------
  LOOP
    v_order_number := 'DST-' || to_char(now(), 'YYMMDD') || '-' || lpad(floor(random() * 90000 + 10000)::TEXT, 5, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = v_order_number);
  END LOOP;

  -- Assign authenticated user if logged in (or NULL for guest)
  v_user_id := auth.uid();

  -- ---------------------------------------------------------
  -- H. ATOMIC TRANSACTION INSERT: ORDERS & ORDER_ITEMS
  -- ---------------------------------------------------------
  INSERT INTO public.orders (
    user_id,
    order_number,
    order_type,
    status,
    payment_status,
    payment_method,
    customer_name,
    customer_phone,
    customer_email,
    delivery_address,
    delivery_notes,
    subtotal,
    delivery_fee,
    discount,
    tax,
    total,
    applied_coupon_code
  ) VALUES (
    v_user_id,
    v_order_number,
    p_order_type,
    'pending',
    'pending',
    p_payment_method,
    trim(p_customer_name),
    trim(p_customer_phone),
    nullif(trim(p_customer_email), ''),
    CASE WHEN p_order_type = 'delivery' THEN trim(p_delivery_address) ELSE NULL END,
    nullif(trim(p_delivery_notes), ''),
    v_subtotal,
    v_delivery_fee,
    v_discount,
    v_tax,
    v_total,
    v_applied_coupon
  ) RETURNING id INTO v_order_id;

  -- Insert order item snapshots
  FOR v_item_elem IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_menu_item_id := (v_item_elem->>'menu_item_id')::UUID;
    v_quantity := (v_item_elem->>'quantity')::INT;
    v_instructions := v_item_elem->>'special_instructions';

    SELECT name, price
    INTO v_db_item
    FROM public.menu_items
    WHERE id = v_menu_item_id;

    INSERT INTO public.order_items (
      order_id,
      menu_item_id,
      item_name_snapshot,
      unit_price_snapshot,
      quantity,
      line_total,
      special_instructions
    ) VALUES (
      v_order_id,
      v_menu_item_id,
      v_db_item.name,
      v_db_item.price,
      v_quantity,
      v_db_item.price * v_quantity,
      nullif(trim(v_instructions), '')
    );
  END LOOP;

  -- ---------------------------------------------------------
  -- I. RETURN STRUCTURED ORDER CONFIRMATION
  -- ---------------------------------------------------------
  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'order_type', p_order_type,
    'customer_name', trim(p_customer_name),
    'customer_phone', trim(p_customer_phone),
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'tax', v_tax,
    'discount', v_discount,
    'total', v_total,
    'applied_coupon', v_applied_coupon,
    'status', 'pending',
    'created_at', now()
  );
END;
$$;

-- 4. PERMISSIONS
-- Grant execute permissions to anonymous guests and authenticated customers
GRANT EXECUTE ON FUNCTION public.create_order(TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
