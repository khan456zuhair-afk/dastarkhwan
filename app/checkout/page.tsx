"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/cart-context";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatPKR } from "@/lib/utils";
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Utensils,
  CreditCard,
  Banknote,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    orderType,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    appliedCoupon,
    clearCart,
  } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [couponCode, setCouponCode] = useState(appliedCoupon || "");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online_sandbox">("cod");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If cart is empty, show empty state with link to menu
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col selection:bg-primary selection:text-on-primary">
        <Navbar />
        <main className="flex-1 pt-28 pb-24 flex items-center justify-center px-4">
          <div className="max-w-md w-full p-8 sm:p-10 bg-surface-container rounded-2xl border border-primary/20 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
                Your Dastarkhwan is Empty
              </h1>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                You cannot proceed to checkout without selecting dishes. Explore our imperial banquet
                offerings first.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/menu"
                className="w-full sm:w-auto px-6 py-3.5 btn-imperial rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Imperial Menu</span>
              </Link>
              <Link
                href="/cart"
                className="w-full sm:w-auto px-6 py-3.5 btn-ghost-gold rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2"
              >
                <span>View Cart</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation (UX only; server function is final authority)
    if (!customerName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage("Please enter your contact phone number.");
      return;
    }

    if (orderType === "delivery" && !deliveryAddress.trim()) {
      setErrorMessage("Please enter your delivery address in DHA Phase 8 / Clifton.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build items array strictly with menu_item_id, quantity, and special_instructions.
      // NEVER pass any price, subtotal, tax, or discount from client!
      const itemsPayload = items.map((cartItem) => ({
        menu_item_id: cartItem.menuItem.id,
        quantity: cartItem.quantity,
        special_instructions: cartItem.specialInstructions || null,
      }));

      const supabase = createClient();

      // Call the hardened SECURITY DEFINER function via Supabase RPC
      const { data, error } = await supabase.rpc("create_order", {
        p_order_type: orderType,
        p_customer_name: customerName.trim(),
        p_customer_phone: customerPhone.trim(),
        p_items: itemsPayload,
        p_delivery_address: orderType === "delivery" ? deliveryAddress.trim() : null,
        p_customer_email: customerEmail.trim() || null,
        p_delivery_notes: deliveryNotes.trim() || null,
        p_coupon_code: couponCode.trim() || null,
        p_payment_method: paymentMethod,
      });

      if (error) {
        console.error("Order creation failed on server:", error);
        setErrorMessage(error.message || "Unable to place order. Please verify your details.");
        setIsSubmitting(false);
        return;
      }

      if (!data || !data.order_number) {
        setErrorMessage("Unexpected response from order server. Please contact the concierge.");
        setIsSubmitting(false);
        return;
      }

      // Success: Clear cart and redirect to order confirmation route
      clearCart();
      router.push(`/order-confirmation/${data.order_number}`);
    } catch (err: any) {
      console.error("Unexpected error during checkout:", err);
      setErrorMessage(
        err?.message || "An unexpected error occurred while placing your order. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary selection:text-on-primary">
      <Navbar />

      <main className="flex-1 pt-24 pb-24">
        {/* Top Ambient Glow */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-6">
            {/* Header / Breadcrumb */}
            <div className="space-y-2 mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface-container-high rounded-full border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-sans text-[11px] font-bold tracking-widest text-primary uppercase">
                  CEREMONIAL CHECKOUT • DHA PHASE 8, KARACHI
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-on-surface tracking-tight">
                    Imperial <span className="italic text-primary">Checkout</span>
                  </h1>
                  <p className="font-sans text-xs sm:text-sm text-on-surface-variant pt-1">
                    Please provide your details. Orders are prepared fresh at our Flagship Haveli.
                  </p>
                </div>

                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Review Dastarkhwan Cart</span>
                </Link>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="mb-8 p-4 sm:p-5 bg-error/10 border border-error/30 rounded-xl flex items-start gap-3 text-error shadow-lg animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-sans font-semibold text-xs uppercase tracking-wider">
                    Unable to Place Order
                  </h4>
                  <p className="text-xs sm:text-sm text-error/90 leading-relaxed font-mono">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Checkout Form & Summary Grid */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* Left Column: Details & Inputs (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Order Mode Confirmation Badge */}
                  <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        {orderType === "delivery" ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <MapPin className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-sans font-semibold text-primary uppercase tracking-wider">
                          Selected Fulfillment Mode
                        </span>
                        <h3 className="font-serif text-base font-semibold text-on-surface">
                          {orderType === "delivery"
                            ? "Imperial Delivery (DHA Phase 8 & Clifton)"
                            : "Pick-up from Flagship Haveli"}
                        </h3>
                      </div>
                    </div>

                    <Link
                      href="/cart"
                      className="text-xs font-semibold text-primary hover:underline shrink-0"
                    >
                      Change in Cart
                    </Link>
                  </div>

                  {/* Section 1: Customer Contact Info */}
                  <div className="bg-surface-container rounded-xl p-6 sm:p-7 border border-outline-variant/30 space-y-5">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-on-surface pb-3 border-b border-outline-variant/20">
                      1. Guest & Contact Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="customerName"
                          className="block text-xs font-medium text-on-surface"
                        >
                          Full Name <span className="text-primary">*</span>
                        </label>
                        <input
                          id="customerName"
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Tariq Khan"
                          className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/50 rounded-lg text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="customerPhone"
                          className="block text-xs font-medium text-on-surface"
                        >
                          Phone Number <span className="text-primary">*</span>
                        </label>
                        <input
                          id="customerPhone"
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. +92 300 1234567"
                          className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/50 rounded-lg text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors font-mono"
                        />
                      </div>
                    </div>

                    {/* Email (Optional) */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="customerEmail"
                        className="block text-xs font-medium text-on-surface"
                      >
                        Email Address <span className="text-on-surface-variant text-[11px]">(Optional for order receipt)</span>
                      </label>
                      <input
                        id="customerEmail"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. tariq@example.com"
                        className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/50 rounded-lg text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Section 2: Fulfillment Location / Address */}
                  <div className="bg-surface-container rounded-xl p-6 sm:p-7 border border-outline-variant/30 space-y-5">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-on-surface pb-3 border-b border-outline-variant/20">
                      2. {orderType === "delivery" ? "Delivery Destination" : "Pick-up Details"}
                    </h2>

                    {orderType === "delivery" ? (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="deliveryAddress"
                            className="block text-xs font-medium text-on-surface"
                          >
                            Street Address & Landmark <span className="text-primary">*</span>
                          </label>
                          <textarea
                            id="deliveryAddress"
                            required
                            rows={3}
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Plot / House number, Street, Phase 8 / Clifton, Karachi"
                            className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/50 rounded-lg text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="deliveryNotes"
                            className="block text-xs font-medium text-on-surface"
                          >
                            Delivery Instructions <span className="text-on-surface-variant text-[11px]">(Optional)</span>
                          </label>
                          <input
                            id="deliveryNotes"
                            type="text"
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                            placeholder="e.g. Ring bell twice, leave with security gate"
                            className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/50 rounded-lg text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-surface-container-high rounded-lg border border-primary/20 space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="font-sans font-semibold text-xs uppercase tracking-wider">
                            Flagship Haveli Pick-up Counter
                          </span>
                        </div>
                        <p className="text-xs text-on-surface font-medium">
                          Plot 14-C, Creek Avenue, Phase 8, DHA, Karachi
                        </p>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          Your delicacies will be sealed in traditional earthen degh packaging and
                          ready at our host concierge counter within 30–40 minutes of confirmation.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Coupon & Payment */}
                  <div className="bg-surface-container rounded-xl p-6 sm:p-7 border border-outline-variant/30 space-y-5">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-on-surface pb-3 border-b border-outline-variant/20">
                      3. Coupon & Payment Settlement
                    </h2>

                    {/* Coupon Code Input */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="couponCode"
                        className="block text-xs font-medium text-on-surface"
                      >
                        Royal Privilege Coupon Code <span className="text-on-surface-variant text-[11px]">(Optional)</span>
                      </label>
                      <input
                        id="couponCode"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. IMPERIAL10 or ROYAL500"
                        className="w-full sm:w-80 px-4 py-2.5 bg-surface-container-high border border-outline-variant/50 rounded-lg text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary uppercase font-mono tracking-wider"
                      />
                      <p className="text-[11px] text-on-surface-variant">
                        Server verifies coupon validity, active date, and minimum threshold upon submission.
                      </p>
                    </div>

                    {/* Payment Method Radio Options */}
                    <div className="space-y-2.5 pt-2">
                      <span className="block text-xs font-medium text-on-surface">
                        Select Payment Method
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* COD Option */}
                        <label
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === "cod"
                              ? "bg-primary/10 border-primary text-on-surface shadow-sm"
                              : "bg-surface-container-high border-outline-variant/40 text-on-surface-variant hover:border-primary/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                            className="text-primary focus:ring-primary h-4 w-4"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Banknote className="w-4 h-4 text-primary" />
                              <span className="text-xs font-bold text-on-surface">
                                {orderType === "delivery" ? "Cash on Delivery" : "Pay at Counter"}
                              </span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant">
                              Settle with cash or mobile bank transfer upon delivery.
                            </p>
                          </div>
                        </label>

                        {/* Online Sandbox Option */}
                        <label
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === "online_sandbox"
                              ? "bg-primary/10 border-primary text-on-surface shadow-sm"
                              : "bg-surface-container-high border-outline-variant/40 text-on-surface-variant hover:border-primary/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="online_sandbox"
                            checked={paymentMethod === "online_sandbox"}
                            onChange={() => setPaymentMethod("online_sandbox")}
                            className="text-primary focus:ring-primary h-4 w-4"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-primary" />
                              <span className="text-xs font-bold text-on-surface">
                                Online Gateway (Sandbox)
                              </span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant">
                              Simulated secure card / digital wallet settlement.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submission Button for Mobile */}
                  <div className="lg:hidden pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 btn-imperial rounded-lg flex items-center justify-center gap-2.5 text-sm font-semibold tracking-wide shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Ceremonially Placing Order...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm & Place Imperial Order</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column: Order Summary (4 cols) */}
                <div className="lg:col-span-4">
                  <div className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-primary/20 shadow-xl space-y-6 sticky top-28">
                    <div className="space-y-1 pb-4 border-b border-outline-variant/30">
                      <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-on-surface">
                          Order Summary
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high border border-primary/20 text-[11px] font-sans font-semibold text-primary">
                          {items.length} {items.length === 1 ? "Item" : "Items"}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        Review your items before server confirmation.
                      </p>
                    </div>

                    {/* Selected Dishes Micro-List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="flex items-center justify-between text-xs py-1.5 border-b border-outline-variant/15"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              className="w-10 h-10 rounded-md object-cover border border-primary/20 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-serif font-semibold text-on-surface truncate">
                                {item.menuItem.name}
                              </p>
                              <p className="text-[11px] text-on-surface-variant">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="text-primary font-serif font-semibold shrink-0 ml-2">
                            {formatPKR(item.menuItem.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Estimated Invoice Breakdown */}
                    <div className="space-y-2.5 text-xs font-sans pt-2 border-t border-outline-variant/30">
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>Estimated Subtotal</span>
                        <span className="text-on-surface font-semibold">
                          {formatPKR(subtotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>
                          {orderType === "delivery" ? "Estimated Delivery Fee" : "Haveli Pick-up"}
                        </span>
                        <span className="text-on-surface font-semibold">
                          {deliveryFee > 0 ? formatPKR(deliveryFee) : "Complimentary"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>Estimated Tax (5%)</span>
                        <span className="text-on-surface font-semibold">{formatPKR(tax)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex items-center justify-between text-tertiary">
                          <span>Estimated Privilege Discount</span>
                          <span className="font-semibold">-{formatPKR(discount)}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-primary/20 flex items-baseline justify-between">
                        <div>
                          <span className="font-serif text-base font-bold text-on-surface">
                            Estimated Total
                          </span>
                          <p className="text-[10px] text-primary/80">
                            Verified & locked by kitchen server
                          </p>
                        </div>
                        <span className="font-serif text-2xl font-bold text-primary">
                          {formatPKR(total)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Submit Button */}
                    <div className="hidden lg:block pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 btn-imperial rounded-lg flex items-center justify-center gap-2.5 text-sm font-semibold tracking-wide shadow-lg disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Ceremonially Placing Order...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm & Place Imperial Order</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Single Branch Assurances */}
                    <div className="pt-4 border-t border-outline-variant/20 space-y-2 text-[11px] text-on-surface-variant">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>Plot 14-C, Creek Ave, Phase 8, DHA, Karachi Flagship</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>Fresh dispatch in 35–45 minutes</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-tertiary shrink-0 mt-0.5" />
                        <span className="text-tertiary">100% Halal Certified Prime Cuts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

