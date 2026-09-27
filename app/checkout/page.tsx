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
  Smartphone,
  Lock,
  X,
  Sparkles,
  Shield,
  Zap,
  Check,
} from "lucide-react";

type PaymentMethodType = "cod" | "card" | "wallet";
type WalletProvider = "jazzcash" | "easypaisa";

interface PendingOrder {
  id: string;
  order_number: string;
  total: number;
  customer_name: string;
}

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("cod");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Online Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [walletProvider, setWalletProvider] = useState<WalletProvider>("jazzcash");
  const [paymentStep, setPaymentStep] = useState<"form" | "processing" | "success" | "failed">("form");
  const [processingStatusText, setProcessingStatusText] = useState("Initiating secure payment gateway...");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  // Wallet Inputs
  const [walletAccount, setWalletAccount] = useState("");
  const [walletCnicPin, setWalletCnicPin] = useState("");

  // Quick autofill for sandbox testing
  const handleAutofillCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("12/28");
    setCardCvc("888");
    setCardholderName(customerName || "Tariq Khan");
  };

  const handleAutofillWallet = () => {
    setWalletAccount(customerPhone || "0300 1234567");
    setWalletCnicPin("123456");
  };

  // If cart is empty, show empty state with link to menu
  if (items.length === 0 && !isPaymentModalOpen && !pendingOrder) {
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

  // Handle Initial Checkout Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation
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
      // Build items array strictly with menu_item_id, quantity, and special_instructions
      const itemsPayload = items.map((cartItem) => ({
        menu_item_id: cartItem.menuItem.id,
        quantity: cartItem.quantity,
        special_instructions: cartItem.specialInstructions || null,
      }));

      const supabase = createClient();
      const dbPaymentMethod = paymentMethod === "cod" ? "cod" : "online_sandbox";

      // Call secure order creation RPC
      const { data, error } = await supabase.rpc("create_order", {
        p_order_type: orderType,
        p_customer_name: customerName.trim(),
        p_customer_phone: customerPhone.trim(),
        p_items: itemsPayload,
        p_delivery_address: orderType === "delivery" ? deliveryAddress.trim() : null,
        p_customer_email: customerEmail.trim() || null,
        p_delivery_notes: deliveryNotes.trim() || null,
        p_coupon_code: couponCode.trim() || null,
        p_payment_method: dbPaymentMethod,
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

      // If Cash on Delivery, complete immediately
      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/order-confirmation/${data.order_number}`);
        return;
      }

      // If Online Payment (Card or Mobile Wallet), open Interactive Payment Gateway Modal
      setPendingOrder({
        id: data.id,
        order_number: data.order_number,
        total: data.total,
        customer_name: data.customer_name,
      });
      setIsSubmitting(false);
      setIsPaymentModalOpen(true);
      setPaymentStep("form");

      // Auto-populate default mock data for convenience
      if (paymentMethod === "card") {
        handleAutofillCard();
      } else {
        handleAutofillWallet();
      }
    } catch (err: any) {
      console.error("Unexpected error during checkout:", err);
      setErrorMessage(
        err?.message || "An unexpected error occurred while placing your order. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  // Execute Simulated Online Payment via Secure API Handler
  const handleExecutePayment = async () => {
    if (!pendingOrder) return;

    setPaymentError(null);
    setPaymentStep("processing");

    try {
      // Step 1: Gateway Handshake
      setProcessingStatusText("Connecting to secure payment switch...");
      await new Promise((r) => setTimeout(r, 700));

      // Step 2: 3D Secure / OTP Biometric Simulation
      setProcessingStatusText(
        paymentMethod === "card"
          ? "Performing 3D-Secure 256-bit card validation..."
          : `Verifying OTP with ${walletProvider === "jazzcash" ? "JazzCash" : "Easypaisa"} network...`
      );
      await new Promise((r) => setTimeout(r, 900));

      // Step 3: Server Settlement API Call
      setProcessingStatusText("Authorizing fund capture and settlement...");
      const response = await fetch("/api/checkout/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: pendingOrder.id,
          orderNumber: pendingOrder.order_number,
          paymentMethod: paymentMethod === "card" ? "card" : walletProvider,
          gatewayRef: `TXN-${paymentMethod.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          cardLast4: paymentMethod === "card" ? cardNumber.replace(/\s+/g, "").slice(-4) || "4242" : undefined,
          walletAccount: paymentMethod === "wallet" ? walletAccount || customerPhone : undefined,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Payment authorization was declined by the merchant gateway.");
      }

      // Step 4: Success & Celebration
      setPaymentStep("success");
      setProcessingStatusText("Payment Settled! Kitchen ticket confirmed.");

      // Clear cart after guaranteed settlement
      clearCart();

      // Smooth transition to Order Confirmation route
      setTimeout(() => {
        router.push(`/order-confirmation/${pendingOrder.order_number}`);
      }, 1500);
    } catch (err: any) {
      console.error("Payment execution error:", err);
      setPaymentError(err.message || "Payment authorization failed. Please try again.");
      setPaymentStep("failed");
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

                  {/* Section 3: Coupon & Payment Selection */}
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

                    {/* Payment Method 3-Option Selector */}
                    <div className="space-y-3 pt-2">
                      <span className="block text-xs font-medium text-on-surface">
                        Select Payment Method
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. COD Option */}
                        <label
                          className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === "cod"
                              ? "bg-primary/10 border-primary text-on-surface shadow-sm ring-1 ring-primary/40"
                              : "bg-surface-container-high border-outline-variant/40 text-on-surface-variant hover:border-primary/40"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="p-2 rounded-lg bg-surface-container border border-primary/20 text-primary">
                                <Banknote className="w-4 h-4" />
                              </div>
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === "cod"}
                                onChange={() => setPaymentMethod("cod")}
                                className="text-primary focus:ring-primary h-4 w-4 accent-primary cursor-pointer"
                              />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-on-surface block">
                                {orderType === "delivery" ? "Cash on Delivery" : "Pay at Counter"}
                              </span>
                              <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                                Settle via cash upon delivery or pickup.
                              </p>
                            </div>
                          </div>
                        </label>

                        {/* 2. Credit/Debit Card Option */}
                        <label
                          className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === "card"
                              ? "bg-primary/10 border-primary text-on-surface shadow-sm ring-1 ring-primary/40"
                              : "bg-surface-container-high border-outline-variant/40 text-on-surface-variant hover:border-primary/40"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="p-2 rounded-lg bg-surface-container border border-primary/20 text-primary">
                                <CreditCard className="w-4 h-4" />
                              </div>
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={() => setPaymentMethod("card")}
                                className="text-primary focus:ring-primary h-4 w-4 accent-primary cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-on-surface block">
                                  Credit / Debit Card
                                </span>
                              </div>
                              <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                                Visa, Mastercard, PayPak with 3D Secure.
                              </p>
                            </div>
                          </div>
                          <span className="mt-2 text-[10px] font-semibold text-primary inline-flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> 256-bit Secure
                          </span>
                        </label>

                        {/* 3. Digital Wallet (JazzCash / Easypaisa) Option */}
                        <label
                          className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === "wallet"
                              ? "bg-primary/10 border-primary text-on-surface shadow-sm ring-1 ring-primary/40"
                              : "bg-surface-container-high border-outline-variant/40 text-on-surface-variant hover:border-primary/40"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="p-2 rounded-lg bg-surface-container border border-primary/20 text-primary">
                                <Smartphone className="w-4 h-4" />
                              </div>
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="wallet"
                                checked={paymentMethod === "wallet"}
                                onChange={() => setPaymentMethod("wallet")}
                                className="text-primary focus:ring-primary h-4 w-4 accent-primary cursor-pointer"
                              />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-on-surface block">
                                Mobile Wallet
                              </span>
                              <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                                JazzCash & Easypaisa OTP direct checkout.
                              </p>
                            </div>
                          </div>
                          <span className="mt-2 text-[10px] font-semibold text-emerald-400 inline-flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> Instant OTP
                          </span>
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
                          <span>
                            {paymentMethod === "cod"
                              ? "Confirm & Place Imperial Order"
                              : "Proceed to Secure Online Payment"}
                          </span>
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
                            <span>
                              {paymentMethod === "cod"
                                ? "Confirm & Place Imperial Order"
                                : "Proceed to Secure Payment"}
                            </span>
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

      {/* ============================================================ */}
      {/* SECURE ONLINE PAYMENT GATEWAY MODAL */}
      {/* ============================================================ */}
      {isPaymentModalOpen && pendingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-primary/30 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Top Security Banner */}
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-on-surface flex items-center gap-1.5">
                    Dastarkhwan Secure Gateway
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    256-bit Encrypted SSL Sandbox Checkout
                  </p>
                </div>
              </div>

              {paymentStep !== "processing" && paymentStep !== "success" && (
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition"
                  title="Close Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Order Identifier & Amount Display */}
            <div className="p-4 bg-surface-container rounded-xl border border-primary/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-on-surface-variant block tracking-wider">
                  Order Reference
                </span>
                <span className="font-mono font-bold text-primary text-sm">
                  {pendingOrder.order_number}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-on-surface-variant block tracking-wider">
                  Locked Total
                </span>
                <span className="font-serif font-bold text-xl text-on-surface">
                  {formatPKR(pendingOrder.total)}
                </span>
              </div>
            </div>

            {/* Error in modal if any */}
            {paymentError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* STEP: PROCESSING SIMULATION */}
            {paymentStep === "processing" && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin flex items-center justify-center" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-on-surface">
                    Processing Settlement
                  </h4>
                  <p className="text-xs text-primary font-mono animate-pulse">
                    {processingStatusText}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Please do not refresh or navigate away from this page.
                  </p>
                </div>
              </div>
            )}

            {/* STEP: SUCCESS CELEBRATION */}
            {paymentStep === "success" && (
              <div className="py-10 flex flex-col items-center justify-center space-y-4 text-center animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xl text-on-surface">
                    Payment Authorized & Settled!
                  </h4>
                  <p className="text-xs text-emerald-400 font-medium">
                    Order {pendingOrder.order_number} is confirmed.
                  </p>
                  <p className="text-[11px] text-on-surface-variant pt-2">
                    Redirecting to your royal order tracker...
                  </p>
                </div>
              </div>
            )}

            {/* STEP: PAYMENT FORM (CARD OR WALLET) */}
            {(paymentStep === "form" || paymentStep === "failed") && (
              <div className="space-y-5">
                {/* Method Tabs if needed */}
                <div className="flex rounded-lg bg-surface-container p-1 border border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("card");
                      handleAutofillCard();
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === "card"
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("wallet");
                      handleAutofillWallet();
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === "wallet"
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Digital Wallet</span>
                  </button>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-on-surface-variant">Card Credentials</span>
                      <button
                        type="button"
                        onClick={handleAutofillCard}
                        className="text-primary hover:underline font-semibold flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Autofill Test Visa</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-medium text-on-surface">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className="w-full pl-3.5 pr-12 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-primary uppercase font-bold">
                          VISA / MC
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-medium text-on-surface">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          maxLength={5}
                          className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-medium text-on-surface">
                          CVC / Security Code
                        </label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="888"
                          maxLength={4}
                          className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-medium text-on-surface">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="Tariq Khan"
                        className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Digital Wallet Payment Form */}
                {paymentMethod === "wallet" && (
                  <div className="space-y-4">
                    {/* Provider Toggle */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setWalletProvider("jazzcash")}
                        className={`p-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-2 ${
                          walletProvider === "jazzcash"
                            ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-sm"
                            : "bg-surface-container border-outline-variant/20 text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>JazzCash Mobile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWalletProvider("easypaisa")}
                        className={`p-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-2 ${
                          walletProvider === "easypaisa"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-sm"
                            : "bg-surface-container border-outline-variant/20 text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Easypaisa Mobile</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-on-surface-variant">Wallet Account Info</span>
                      <button
                        type="button"
                        onClick={handleAutofillWallet}
                        className="text-primary hover:underline font-semibold flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Autofill Sandbox Account</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-medium text-on-surface">
                        Registered Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={walletAccount}
                        onChange={(e) => setWalletAccount(e.target.value)}
                        placeholder="0300 1234567"
                        className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-medium text-on-surface">
                        CNIC Last 6 Digits / MPIN
                      </label>
                      <input
                        type="password"
                        value={walletCnicPin}
                        onChange={(e) => setWalletCnicPin(e.target.value)}
                        placeholder="••••••"
                        maxLength={6}
                        className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                      />
                      <p className="text-[10px] text-on-surface-variant">
                        Simulated OTP prompt will authorize instantly without deduction.
                      </p>
                    </div>
                  </div>
                )}

                {/* Authorization Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    className="w-full py-3.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary/90 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize & Settle {formatPKR(pendingOrder.total)}</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      PCI-DSS Level 1 Gateway
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="hover:text-on-surface underline"
                    >
                      Settle Later or Change Method
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
