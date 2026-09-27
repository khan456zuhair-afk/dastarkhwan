import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderNumber, paymentMethod, gatewayRef, cardLast4, walletAccount } = body;

    if (!orderId && !orderNumber) {
      return NextResponse.json(
        { error: "Missing required order identifier (orderId or orderNumber)." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch current order details
    let query = supabaseAdmin
      .from("orders")
      .select("id, order_number, customer_name, subtotal, discount, tax, total, status, payment_status, payment_method");

    if (orderId) {
      query = query.eq("id", orderId);
    } else {
      query = query.eq("order_number", orderNumber);
    }

    const { data: order, error: fetchErr } = await query.maybeSingle();

    if (fetchErr) {
      console.error("Database fetch error for order:", fetchErr);
      return NextResponse.json(
        { error: "Database error while fetching order." },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // 2. If already paid, return early with idempotency
    if (order.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        orderNumber: order.order_number,
        message: "Order has already been settled.",
      });
    }

    // 3. Atomically update orders table: status -> 'confirmed', payment_status -> 'paid'
    const { error: updateErr } = await supabaseAdmin
      .from("orders")
      .update({
        status: "confirmed",
        payment_status: "paid",
        payment_method: "online_sandbox",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateErr) {
      console.error("Failed to update order status:", updateErr);
      return NextResponse.json(
        { error: "Failed to update order settlement status: " + updateErr.message },
        { status: 500 }
      );
    }

    // 4. Map paymentMethod to allowed sales_transactions check constraint: ('cash', 'card', 'online_gateway', 'split')
    let dbPaymentMethod: "card" | "online_gateway" = "online_gateway";
    if (paymentMethod === "card") {
      dbPaymentMethod = "card";
    }

    const txReference = gatewayRef || `TXN-ONL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const extraDetails = cardLast4 ? `Card ending in ${cardLast4}` : walletAccount ? `Wallet: ${walletAccount}` : "Instant Gateway Transfer";

    // 5. Insert audit record into sales_transactions
    const { data: txData, error: txErr } = await supabaseAdmin
      .from("sales_transactions")
      .insert({
        source: "online",
        source_order_id: order.id,
        customer_name: order.customer_name,
        payment_method: dbPaymentMethod,
        subtotal: order.subtotal,
        discount: order.discount,
        tax: order.tax,
        total: order.total,
        transaction_status: "completed",
        notes: `Online Gateway Checkout (${String(paymentMethod).toUpperCase()}) | Gateway Ref: ${txReference} | ${extraDetails}`,
      })
      .select("id")
      .maybeSingle();

    if (txErr) {
      console.warn("Notice: Order was updated to paid, but sales_transaction insert failed:", txErr.message);
    }

    return NextResponse.json({
      success: true,
      transactionId: txData?.id || txReference,
      orderNumber: order.order_number,
      total: order.total,
      settledAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Unhandled error in payment route handler:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error during payment execution." },
      { status: 500 }
    );
  }
}
