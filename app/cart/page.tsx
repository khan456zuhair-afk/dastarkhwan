"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatPKR } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  Utensils,
  Sparkles,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    orderType,
    setOrderType,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

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
                  ROYAL ORDER • DHA PHASE 8, KARACHI
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-on-surface tracking-tight">
                    Your Imperial <span className="italic text-primary">Dastarkhwan</span>
                  </h1>
                  <p className="font-sans text-xs sm:text-sm text-on-surface-variant pt-1">
                    Review your curated banquet selections before ceremonial preparation.
                  </p>
                </div>

                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-on-surface-variant hover:text-error transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Items</span>
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {items.length === 0 ? (
              <div className="my-12 max-w-lg mx-auto p-8 sm:p-12 bg-surface-container-low rounded-2xl border border-primary/20 text-center shadow-2xl space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
                    Your Dastarkhwan is Empty
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    No regal dishes have been added to your banquet yet. Explore our slow-cooked Dum
                    Pukht biryanis, Shinwari karahis, and charcoal kebabs.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 btn-imperial rounded-lg text-xs font-semibold tracking-wide"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Explore Imperial Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Cart Content Grid */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* Left Column: Cart Items (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Order Mode Toggle */}
                  <div className="bg-surface-container rounded-xl p-1.5 border border-outline-variant/30 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType("delivery")}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        orderType === "delivery"
                          ? "bg-primary text-on-primary shadow-md"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Imperial Delivery (DHA Phase 8 & Clifton)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("pickup")}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        orderType === "pickup"
                          ? "bg-primary text-on-primary shadow-md"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Pick-up from Flagship Haveli
                    </button>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    {items.map((item) => {
                      const lineTotal = item.menuItem.price * item.quantity;

                      return (
                        <div
                          key={item.menuItem.id}
                          className="bg-surface-container rounded-xl p-4 sm:p-5 border border-outline-variant/30 hover:border-primary/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          {/* Item Identity */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <img
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0 border border-primary/20 bg-surface-container-lowest"
                            />

                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-serif text-base sm:text-lg font-semibold text-on-surface leading-snug">
                                  {item.menuItem.name}
                                </h3>
                                {item.menuItem.originBadge && (
                                  <span className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-sans font-semibold tracking-wider text-primary border border-primary/20 uppercase">
                                    {item.menuItem.originBadge}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-on-surface-variant">
                                Unit Price:{" "}
                                <strong className="text-on-surface">
                                  {formatPKR(item.menuItem.price)}
                                </strong>
                                {item.menuItem.portionInfo && (
                                  <span className="text-outline-variant">
                                    {" "}
                                    • {item.menuItem.portionInfo}
                                  </span>
                                )}
                              </p>

                              {item.specialInstructions && (
                                <p className="text-[11px] text-primary/90 italic">
                                  Special instructions: &ldquo;{item.specialInstructions}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Stepper, Line Total & Remove Action */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20 shrink-0">
                            {/* Quantity Stepper */}
                            <div className="flex items-center bg-surface-container-high rounded-lg p-0.5 border border-outline-variant/30">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-xs font-semibold text-on-surface">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Line Total */}
                            <div className="text-right min-w-[90px]">
                              <span className="font-serif text-lg font-bold text-primary">
                                {formatPKR(lineTotal)}
                              </span>
                              <p className="text-[10px] text-on-surface-variant">
                                {item.quantity} × {formatPKR(item.menuItem.price)}
                              </p>
                            </div>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeItem(item.menuItem.id)}
                              aria-label={`Remove ${item.menuItem.name}`}
                              className="p-2 rounded-lg text-outline-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Return */}
                  <div className="pt-2">
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-container transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Explore & Add More Imperial Dishes</span>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Order Summary & Checkout (4 cols) */}
                <div className="lg:col-span-4">
                  <div className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-primary/20 shadow-xl space-y-6 sticky top-28">
                    <div className="space-y-1 pb-4 border-b border-outline-variant/30">
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-on-surface">
                        Imperial Invoice
                      </h2>
                      <p className="text-xs text-on-surface-variant">
                        Single Flagship Branch • DHA Phase 8, Karachi
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-3 text-xs font-sans">
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>Delicacies Subtotal</span>
                        <span className="text-on-surface font-semibold text-sm">
                          {formatPKR(subtotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>
                          {orderType === "delivery" ? "Imperial Delivery Fee" : "Haveli Pick-up Fee"}
                        </span>
                        <span className="text-on-surface font-semibold">
                          {deliveryFee > 0 ? formatPKR(deliveryFee) : "Complimentary"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>Sindh Restaurant Tax (5%)</span>
                        <span className="text-on-surface font-semibold">{formatPKR(tax)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex items-center justify-between text-tertiary">
                          <span>Royal Discount</span>
                          <span className="font-semibold">-{formatPKR(discount)}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-primary/20 flex items-baseline justify-between">
                        <div>
                          <span className="font-serif text-base font-bold text-on-surface">
                            Grand Total
                          </span>
                          <p className="text-[10px] text-on-surface-variant">All taxes & fees included</p>
                        </div>
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                          {formatPKR(total)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="pt-2">
                      <Link
                        href="/checkout"
                        className="w-full py-4 btn-imperial rounded-lg flex items-center justify-center gap-2.5 text-sm font-semibold tracking-wide shadow-lg cursor-pointer"
                      >
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <p className="text-[11px] text-center text-on-surface-variant pt-2">
                        Delivery address and payment method selected on next step.
                      </p>
                    </div>

                    {/* Branch Guarantees */}
                    <div className="pt-4 border-t border-outline-variant/20 space-y-2.5 text-[11px] text-on-surface-variant">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>Plot 14-C, Creek Ave, Phase 8, DHA, Karachi Flagship</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>Woodfire & clay pot dispatch in 35–45 minutes</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                        <span className="text-tertiary font-medium">
                          100% Halal Certified Prime Cuts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

