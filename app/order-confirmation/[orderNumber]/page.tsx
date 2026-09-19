import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPKR } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Utensils,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Flame,
  Receipt,
  Banknote,
  CreditCard,
  Calendar,
} from "lucide-react";

interface OrderConfirmationPageProps {
  params: {
    orderNumber: string;
  };
}

interface OrderItemRecord {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
  special_instructions: string | null;
}

interface OrderRecord {
  id: string;
  user_id: string | null;
  order_number: string;
  order_type: "delivery" | "pickup" | "takeaway";
  status: string;
  payment_status: string;
  payment_method: string;
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
  order_items: OrderItemRecord[];
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps): Promise<Metadata> {
  return {
    title: `Order #${params.orderNumber} | Dastarkhwan — Imperial Cuisine`,
    description: `Dining order details for reference ${params.orderNumber} at Dastarkhwan Flagship Haveli, DHA Phase 8, Karachi.`,
  };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = params;

  // Uses admin/service-role client server-side to allow guest orders (where user_id is NULL) to be retrieved by unique tracking order_number without being blocked by RLS
  const supabase = createAdminClient();

  let order: OrderRecord | null = null;
  let queryError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
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
        applied_coupon_code,
        created_at,
        order_items (
          id,
          order_id,
          menu_item_id,
          item_name_snapshot,
          unit_price_snapshot,
          quantity,
          line_total,
          special_instructions
        )
      `)
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) {
      console.error("Database query error on order lookup:", error);
      queryError = error.message;
    } else if (data) {
      order = data as unknown as OrderRecord;
    }
  } catch (err: any) {
    console.error("Unexpected error retrieving order:", err);
    queryError = err?.message || "Failed to communicate with database.";
  }

  // =========================================================================
  // STATE 1: DATABASE / NETWORK QUERY ERROR (Explicit message, no crash)
  // =========================================================================
  if (queryError) {
    return (
      <div className="min-h-screen bg-surface flex flex-col selection:bg-primary selection:text-on-primary">
        <Navbar />

        <main className="flex-1 pt-28 pb-24 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto w-full">
            <div className="bg-surface-container rounded-2xl border border-error/30 p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mx-auto text-error shadow-lg">
                <AlertTriangle className="w-8 h-8 stroke-[1.5]" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface-container-high rounded-full border border-error/20">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <span className="font-sans text-[11px] font-bold tracking-widest text-error uppercase">
                    DATABASE INQUIRY NOTICE
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                  Unable to Retrieve Order
                </h1>

                <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  We encountered a connection or server error while querying the order database for
                  reference:
                </p>

                <p className="font-mono text-xl sm:text-2xl font-bold text-primary tracking-widest pt-1">
                  {orderNumber}
                </p>
              </div>

              {/* Technical System Note */}
              <div className="p-3.5 bg-error/10 border border-error/20 rounded-lg text-left text-xs font-mono text-error/90 space-y-1">
                <p className="font-semibold uppercase tracking-wider text-[10px]">Error Details:</p>
                <p className="break-all">{queryError}</p>
              </div>

              <p className="text-xs text-on-surface-variant">
                If your payment was processed, your banquet order has been recorded. Please contact
                our Flagship Haveli Concierge for immediate verification.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-6 py-3.5 btn-imperial rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-lg"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Explore Imperial Menu</span>
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 btn-ghost-gold rounded-lg text-xs font-semibold inline-flex items-center justify-center"
                >
                  <span>Return to Grand Hall</span>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =========================================================================
  // STATE 2: ORDER NOT FOUND (Genuinely no matching row in database)
  // =========================================================================
  if (!order) {
    return (
      <div className="min-h-screen bg-surface flex flex-col selection:bg-primary selection:text-on-primary">
        <Navbar />

        <main className="flex-1 pt-28 pb-24 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto w-full">
            <div className="bg-surface-container rounded-2xl border border-primary/20 p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-lg">
                <FileQuestion className="w-8 h-8 stroke-[1.5]" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface-container-high rounded-full border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-outline animate-pulse" />
                  <span className="font-sans text-[11px] font-bold tracking-widest text-primary uppercase">
                    RECORD NOT FOUND
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                  Imperial Order Not Found
                </h1>

                <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  No registered banquet order exists matching the reference number:
                </p>

                <p className="font-mono text-xl sm:text-2xl font-bold text-primary tracking-widest pt-1 select-all">
                  {orderNumber}
                </p>
              </div>

              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Please confirm the reference code from your SMS / checkout screen, or return to our
                menu to place a fresh order.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-6 py-3.5 btn-imperial rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-lg"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Explore Imperial Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 btn-ghost-gold rounded-lg text-xs font-semibold inline-flex items-center justify-center"
                >
                  <span>Return to Grand Hall</span>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =========================================================================
  // STATE 3: ORDER FOUND (Real data rendered from database)
  // =========================================================================
  const statusConfig: Record<string, { label: string; badgeClass: string }> = {
    pending: {
      label: "ORDER RECEIVED • KITCHEN NOTIFIED",
      badgeClass: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    },
    confirmed: {
      label: "ORDER CONFIRMED • KITCHEN ACTIVE",
      badgeClass: "text-primary border-primary/30 bg-primary/10",
    },
    preparing: {
      label: "WOODFIRE & DUM IN PROGRESS",
      badgeClass: "text-tertiary border-tertiary/30 bg-tertiary/10",
    },
    ready: {
      label: "SEALED IN DEGH • READY FOR COLLECTION",
      badgeClass: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    },
    out_for_delivery: {
      label: "DISPATCHED • OUT FOR DELIVERY",
      badgeClass: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    },
    completed: {
      label: "CEREMONIALLY FULFILLED",
      badgeClass: "text-primary border-primary/30 bg-primary/10",
    },
    cancelled: {
      label: "ORDER CANCELLED",
      badgeClass: "text-error border-error/30 bg-error/10",
    },
  };

  const currentStatus = statusConfig[order.status] || {
    label: `STATUS: ${order.status.toUpperCase()}`,
    badgeClass: "text-primary border-primary/30 bg-primary/10",
  };

  const paymentMethodLabels: Record<string, string> = {
    cod: order.order_type === "delivery" ? "Cash on Delivery" : "Pay at Haveli Counter",
    online_sandbox: "Online Card / Gateway (Sandbox)",
    pos_cash: "Haveli POS Cash",
    pos_card: "Haveli POS Card",
  };

  const orderDateFormatted = new Date(order.created_at).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary selection:text-on-primary">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Top Ambient Glow */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

          <div className="max-w-3xl mx-auto w-full">
            {/* Main Order Confirmation Card */}
            <div className="bg-surface-container rounded-2xl border border-primary/30 p-6 sm:p-10 lg:p-12 text-center shadow-2xl space-y-8">
              {/* Gold Emblem Header */}
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-lg">
                  <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
                </div>

                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border ${currentStatus.badgeClass}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <span className="font-sans text-[11px] font-bold tracking-widest uppercase">
                    {currentStatus.label}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
                  Shukriya, <span className="italic text-primary">{order.customer_name}</span>!
                </h1>

                <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                  Our master ustaads have received your order for{" "}
                  <strong className="text-on-surface font-semibold">
                    {order.order_type === "delivery"
                      ? "Imperial Delivery (DHA Phase 8 & Clifton)"
                      : "Flagship Haveli Pick-up"}
                  </strong>
                  . Every dish is being prepared over fragrant acacia embers and sealed in
                  traditional earthen degh containers.
                </p>
              </div>

              {/* Order Reference Number Box */}
              <div className="p-6 bg-surface-container-high rounded-xl border border-primary/30 space-y-2">
                <p className="text-xs font-sans text-on-surface-variant uppercase tracking-wider font-semibold">
                  Imperial Order Reference Number
                </p>
                <p className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-widest select-all">
                  {order.order_number}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Please present or cite this reference number upon receipt or counter collection.
                </p>
              </div>

              {/* Fulfillment & Guest Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* Guest Contact & Fulfillment Mode */}
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-[11px]">
                    <Clock className="w-4 h-4" />
                    <span>Fulfillment Specification</span>
                  </div>
                  <div className="space-y-1 text-on-surface-variant">
                    <p>
                      <span className="text-on-surface font-medium">Mode:</span>{" "}
                      {order.order_type === "delivery"
                        ? "Delivery (DHA Phase 8 / Clifton)"
                        : "Pick-up from Haveli"}
                    </p>
                    <p>
                      <span className="text-on-surface font-medium">Recipient:</span>{" "}
                      {order.customer_name} ({order.customer_phone})
                    </p>
                    {order.customer_email && (
                      <p>
                        <span className="text-on-surface font-medium">Email:</span>{" "}
                        {order.customer_email}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{orderDateFormatted}</span>
                    </div>
                  </div>
                </div>

                {/* Location / Destination */}
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-[11px]">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {order.order_type === "delivery" ? "Delivery Destination" : "Pick-up Counter"}
                    </span>
                  </div>
                  <div className="space-y-1 text-on-surface-variant">
                    {order.order_type === "delivery" ? (
                      <>
                        <p className="text-on-surface font-medium leading-snug">
                          {order.delivery_address}
                        </p>
                        {order.delivery_notes && (
                          <p className="text-[11px] text-primary/90 italic pt-1">
                            Notes: &ldquo;{order.delivery_notes}&rdquo;
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-on-surface font-medium">Plot 14-C, Creek Avenue</p>
                        <p className="text-[11px]">Phase 8, DHA, Karachi Flagship Haveli</p>
                        <p className="text-[11px] text-on-surface-variant/80 pt-1">
                          Ready for collection at concierge counter in 30–40m.
                        </p>
                      </>
                    )}
                    <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                      {order.payment_method === "online_sandbox" ? (
                        <CreditCard className="w-3.5 h-3.5 text-tertiary" />
                      ) : (
                        <Banknote className="w-3.5 h-3.5 text-primary" />
                      )}
                      <span>
                        {paymentMethodLabels[order.payment_method] || order.payment_method} •{" "}
                        <span className="font-semibold uppercase">
                          {order.payment_status}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Items Breakdown (Joined from order_items) */}
              <div className="text-left space-y-4 pt-2 border-t border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-semibold text-on-surface flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-primary" />
                    <span>Banquet Selections ({order.order_items?.length || 0})</span>
                  </h3>
                  <span className="text-[11px] font-sans text-primary uppercase tracking-wider">
                    Database Verified
                  </span>
                </div>

                {/* Items List */}
                <div className="bg-surface-container-high rounded-xl border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/15 text-xs">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-serif font-semibold text-on-surface truncate">
                            {item.item_name_snapshot}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
                            <span>
                              {formatPKR(item.unit_price_snapshot)} × {item.quantity}
                            </span>
                            {item.special_instructions && (
                              <span className="italic text-primary/80 truncate">
                                &ldquo;{item.special_instructions}&rdquo;
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="font-serif font-semibold text-primary shrink-0">
                          {formatPKR(item.line_total || item.unit_price_snapshot * item.quantity)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-on-surface-variant text-xs">
                      Itemized list recorded with kitchen master ticket.
                    </div>
                  )}
                </div>

                {/* Financial Totals Breakdown */}
                <div className="p-4 sm:p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="text-on-surface font-semibold">
                      {formatPKR(order.subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>
                      {order.order_type === "delivery" ? "Delivery Surcharge" : "Pick-up Packaging"}
                    </span>
                    <span className="text-on-surface font-semibold">
                      {order.delivery_fee > 0
                        ? formatPKR(order.delivery_fee)
                        : order.order_type === "delivery"
                        ? "Free Delivery"
                        : "Complimentary"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Provincial Sales Tax (5%)</span>
                    <span className="text-on-surface font-semibold">{formatPKR(order.tax)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex items-center justify-between text-tertiary">
                      <span>
                        Privilege Discount{" "}
                        {order.applied_coupon_code && `(${order.applied_coupon_code})`}
                      </span>
                      <span className="font-semibold">-{formatPKR(order.discount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-primary/20 flex items-baseline justify-between">
                    <div>
                      <span className="font-serif text-base font-bold text-on-surface">
                        Total Amount
                      </span>
                      <p className="text-[10px] text-primary/80">
                        {order.payment_method === "cod" ? "Payable upon arrival" : "Settled via sandbox gateway"}
                      </p>
                    </div>
                    <span className="font-serif text-2xl font-bold text-primary">
                      {formatPKR(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fulfillment Progress Timeline */}
              <div className="text-left space-y-4 pt-2 border-t border-outline-variant/20">
                <h3 className="font-serif text-base font-semibold text-on-surface flex items-center gap-2">
                  <Flame className="w-4 h-4 text-primary" />
                  <span>Ceremonial Fulfillment Progress</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/20 space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Step 1
                    </span>
                    <p className="font-semibold text-on-surface">Kitchen Assembly</p>
                    <p className="text-[11px] text-on-surface-variant">
                      Selected prime halal cuts & heirloom spices locked in.
                    </p>
                  </div>

                  <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/20 space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Step 2
                    </span>
                    <p className="font-semibold text-on-surface">Woodfire & Dum</p>
                    <p className="text-[11px] text-on-surface-variant">
                      Freshly prepared and sealed in earthen deghs.
                    </p>
                  </div>

                  <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/20 space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Step 3
                    </span>
                    <p className="font-semibold text-on-surface">
                      {order.order_type === "delivery" ? "Dispatch (35–45m)" : "Counter Handover"}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {order.order_type === "delivery"
                        ? "Dispatched across DHA Phase 8 & Clifton."
                        : "Handed over warm at host concierge."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Branch Contact Details */}
              <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Plot 14-C, Creek Ave, Phase 8, DHA, Karachi</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>Concierge: +92 21 3584 9200</span>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-8 py-3.5 btn-imperial rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-lg"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Explore Imperial Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-8 py-3.5 btn-ghost-gold rounded-lg text-xs font-semibold inline-flex items-center justify-center"
                >
                  <span>Return to Grand Hall</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
