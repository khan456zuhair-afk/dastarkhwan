import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  CheckCircle2,
  Utensils,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  ArrowRight,
  Flame,
} from "lucide-react";

interface OrderConfirmationPageProps {
  params: {
    orderNumber: string;
  };
}

export const metadata: Metadata = {
  title: "Order Confirmed | Dastarkhwan — Imperial Pakistani Cuisine",
  description: "Your imperial dining order has been received and is being prepared with ceremonial care.",
};

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = params;

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary selection:text-on-primary">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Top Ambient Glow */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

          <div className="max-w-2xl mx-auto w-full">
            {/* Confirmation Card */}
            <div className="bg-surface-container rounded-2xl border border-primary/30 p-8 sm:p-12 text-center shadow-2xl space-y-8">
              {/* Gold Emblem Header */}
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-lg">
                  <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface-container-high rounded-full border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  <span className="font-sans text-[11px] font-bold tracking-widest text-primary uppercase">
                    ORDER CONFIRMED • KITCHEN ACTIVE
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
                  Shukriya! Your Banquet is Under Preparation
                </h1>

                <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                  Our master ustaads have received your order. Every dish is being prepared over
                  fragrant acacia embers and sealed in traditional earthen degh containers.
                </p>
              </div>

              {/* Order Number Box */}
              <div className="p-6 bg-surface-container-high rounded-xl border border-primary/30 space-y-2">
                <p className="text-xs font-sans text-on-surface-variant uppercase tracking-wider font-semibold">
                  Imperial Order Reference Number
                </p>
                <p className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-widest select-all">
                  {orderNumber}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Please retain this reference number for order verification upon delivery or pick-up.
                </p>
              </div>

              {/* Next Steps Timeline */}
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
                      Freshly prepared and sealed in thermal containers.
                    </p>
                  </div>

                  <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/20 space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Step 3
                    </span>
                    <p className="font-semibold text-on-surface">Dispatch (35–45m)</p>
                    <p className="text-[11px] text-on-surface-variant">
                      Dispatched across DHA Phase 8 & Clifton.
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

