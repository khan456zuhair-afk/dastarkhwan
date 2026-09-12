"use client";

import React from "react";
import Link from "next/link";
import { formatPKR } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  CreditCard,
  Utensils,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  // Demo baseline metrics (will sync to Supabase once live keys are active)
  const metrics = {
    todayTotalSales: 148500,
    todayOnlineSales: 62400,
    todayDineInSales: 86100,
    onlineOrderCount: 18,
    dineInTransactions: 24,
    pendingReservationsToday: 6,
    activeKitchenOrders: 4,
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DHA Phase 8, Karachi • Operations Console</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-on-surface">
            Imperial Operations Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant">
            Real-time management for online deliveries, table majlis bookings, and dining floor POS.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pos"
            className="px-4 py-2.5 btn-imperial rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Open POS Terminal</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 btn-ghost-gold rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span>Live Kitchen Orders</span>
          </Link>
        </div>
      </div>

      {/* Financial Separation Alert Banner */}
      <div className="p-4 bg-surface-container rounded-xl border border-primary/20 flex items-start gap-3 text-xs">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-semibold text-on-surface text-sm">
            Strict Financial Separation Enforced
          </h4>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Online delivery/pickup revenue and dine-in POS transactions are tracked as separate data
            models in the database to prevent cross-channel contamination.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Today */}
        <div className="p-5 bg-surface-container rounded-xl border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Today&apos;s Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-2xl font-bold text-primary">
            {formatPKR(metrics.todayTotalSales)}
          </p>
          <p className="text-[11px] text-tertiary">Online + Dine-In Combined</p>
        </div>

        {/* Online Orders Revenue */}
        <div className="p-5 bg-surface-container rounded-xl border border-primary/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span className="text-primary font-medium">Online Orders Revenue</span>
            <ShoppingBag className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-2xl font-bold text-on-surface">
            {formatPKR(metrics.todayOnlineSales)}
          </p>
          <p className="text-[11px] text-on-surface-variant">
            {metrics.onlineOrderCount} deliveries & pickups dispatched
          </p>
        </div>

        {/* Dine-In Restaurant Sales */}
        <div className="p-5 bg-surface-container rounded-xl border border-secondary/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span className="text-secondary font-medium">Dine-In POS Revenue</span>
            <CreditCard className="w-4 h-4 text-secondary" />
          </div>
          <p className="font-serif text-2xl font-bold text-on-surface">
            {formatPKR(metrics.todayDineInSales)}
          </p>
          <p className="text-[11px] text-on-surface-variant">
            {metrics.dineInTransactions} restaurant table tickets closed
          </p>
        </div>

        {/* Today's Table Reservations */}
        <div className="p-5 bg-surface-container rounded-xl border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Table Bookings Today</span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-2xl font-bold text-on-surface">
            {metrics.pendingReservationsToday} Parties
          </p>
          <p className="text-[11px] text-on-surface-variant">
            Family Majlis & Terrace allocations
          </p>
        </div>
      </div>

      {/* Two-Column Activity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Live Orders */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-semibold text-on-surface">
                Active Kitchen Orders
              </h3>
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-[11px] font-bold rounded-full">
                4 Preparing
              </span>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              <span>View Order Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "DST-ORD-1092",
                customer: "Naveed Chaudhry",
                items: "2x Shahi Dum Pukht Biryani, 1x Roghani Naan",
                total: 5120,
                type: "Delivery (DHA Phase 8)",
                status: "Preparing in Degh",
                statusColor: "bg-secondary/15 text-secondary border-secondary/30",
              },
              {
                id: "DST-ORD-1091",
                customer: "Dr. Shahana Raza",
                items: "1x Lahori Desi Murgh Karahi, 2x Naan",
                total: 2590,
                type: "Pickup",
                status: "Ready for Handover",
                statusColor: "bg-tertiary/15 text-tertiary border-tertiary/30",
              },
              {
                id: "DST-ORD-1090",
                customer: "Kamran Siddiqui",
                items: "1x Charsi Lamb Chops, 1x Nalli Nihari",
                total: 5140,
                type: "Delivery (Clifton Block 4)",
                status: "Out for Delivery",
                statusColor: "bg-primary/15 text-primary border-primary/30",
              },
            ].map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-primary">{ord.id}</span>
                    <span className="text-xs text-on-surface font-semibold">{ord.customer}</span>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      ({ord.type})
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{ord.items}</p>
                </div>
                <div className="text-right space-y-1 shrink-0">
                  <span className="font-serif font-bold text-sm text-on-surface">
                    {formatPKR(ord.total)}
                  </span>
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded border ${ord.statusColor}`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Table Reservations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-on-surface">
              Upcoming Reservations
            </h3>
            <Link
              href="/admin/reservations"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                code: "DST-RES-849",
                guest: "Senator M. Alvi",
                time: "8:00 PM Tonight",
                guests: "12 Guests",
                table: "Majlis C (Babur)",
                status: "Confirmed",
              },
              {
                code: "DST-RES-850",
                guest: "Farooq Hashmi",
                time: "8:30 PM Tonight",
                guests: "4 Guests",
                table: "Sea Breeze Terrace 2",
                status: "Confirmed",
              },
              {
                code: "DST-RES-851",
                guest: "Zahra Mansoor",
                time: "9:15 PM Tonight",
                guests: "6 Guests",
                table: "Table 3 (Main Hall)",
                status: "Pending Assignment",
              },
            ].map((res) => (
              <div
                key={res.code}
                className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs text-primary">{res.code}</span>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" /> {res.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{res.guest}</p>
                    <p className="text-xs text-on-surface-variant">
                      {res.guests} • {res.table}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary border border-tertiary/25 text-[10px] font-semibold rounded">
                    {res.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approved Administrators Status Card */}
      <div className="p-6 bg-surface-container-low rounded-xl border border-primary/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-base font-semibold text-on-surface">
              Approved Multi-Admin Roster (3 Designated Seats)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
            RBAC Active
          </span>
        </div>

        <p className="text-xs text-on-surface-variant">
          In accordance with security requirements, the platform supports exactly three approved
          administrative accounts through the invitation/seed workflow. No public registration can
          escalate to an admin role.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/30 space-y-1 text-xs">
            <p className="font-semibold text-on-surface">Admin 1: Operations Director</p>
            <p className="text-outline font-mono text-[11px]">
              admin.haider@dastarkhwan.internal
            </p>
            <p className="text-[10px] text-tertiary font-medium">Full System Authority</p>
          </div>
          <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/30 space-y-1 text-xs">
            <p className="font-semibold text-on-surface">Admin 2: Culinary & Inventory Lead</p>
            <p className="text-outline font-mono text-[11px]">
              admin.bilal@dastarkhwan.internal
            </p>
            <p className="text-[10px] text-tertiary font-medium">Menu, Stock & Kitchen Orders</p>
          </div>
          <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/30 space-y-1 text-xs">
            <p className="font-semibold text-on-surface">Admin 3: Finance & POS Supervisor</p>
            <p className="text-outline font-mono text-[11px]">
              admin.tariq@dastarkhwan.internal
            </p>
            <p className="text-[10px] text-tertiary font-medium">Sales Tracker & Dine-In POS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

