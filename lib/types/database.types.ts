export type UserRole = "customer" | "staff" | "admin";

export type OrderType = "delivery" | "pickup" | "takeaway";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "cod" | "online_sandbox" | "pos_cash" | "pos_card";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled"
  | "no_show";

export type TableLocationArea =
  | "main_dining"
  | "family_majlis"
  | "sea_breeze_terrace"
  | "private_diwan";

export type SalesSource = "online" | "dine_in" | "takeaway";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  target_entity: string;
  target_id: string;
  details: Record<string, any>;
  ip_address: string | null;
  created_at: string;
}

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DBMenuItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  origin_badge: string | null;
  portion_info: string | null;
  ingredients: string[];
  dietary_tags: string[];
  spice_level: number;
  preparation_time_minutes: number;
  is_available: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface DBTable {
  id: string;
  table_number: string;
  capacity: number;
  location_area: TableLocationArea;
  is_active: boolean;
  created_at: string;
}

export interface DBRestaurantHour {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  notes: string | null;
}

export interface DBCoupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_count: number;
  max_uses: number | null;
  created_at: string;
}

export interface DBOrder {
  id: string;
  user_id: string | null;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string | null;
  delivery_notes: string | null;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  tax: number;
  total: number;
  applied_coupon_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
  special_instructions: string | null;
}

export interface DBReservation {
  id: string;
  user_id: string | null;
  reservation_code: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  special_request: string | null;
  seating_preference: TableLocationArea;
  status: ReservationStatus;
  assigned_table_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBSalesTransaction {
  id: string;
  source: SalesSource;
  source_order_id: string | null;
  table_number: string | null;
  customer_name: string | null;
  payment_method: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  transaction_status: "completed" | "refunded" | "cancelled";
  created_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface DBRestaurantSettings {
  id: string;
  restaurant_name: string;
  branch_name: string;
  branch_address: string;
  phone: string;
  email: string;
  tax_rate_percent: number;
  delivery_fee_pkr: number;
  min_delivery_order_pkr: number;
  max_reservation_guests: number;
  reservation_slot_duration_minutes: number;
  is_online_ordering_enabled: boolean;
  is_reservations_enabled: boolean;
  updated_at: string;
}

