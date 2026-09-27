"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  TrendingUp,
  CreditCard,
  Wallet,
  Calendar,
  Download,
  RefreshCcw,
  Search,
  CheckCircle2,
  Utensils,
  Truck,
  ShoppingBag,
  ArrowUpRight,
  Filter,
  DollarSign,
  Layers,
  Clock,
  FileSpreadsheet
} from "lucide-react";

interface SalesTransaction {
  id: string;
  source: string;
  source_order_id?: string | null;
  table_number?: string | null;
  customer_name?: string | null;
  payment_method: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  transaction_status: string;
  notes?: string | null;
  created_at: string;
}

interface OrderRecord {
  id: string;
  order_number: string;
  order_type: string;
  status: string;
  payment_status: string;
  payment_method: string;
  customer_name: string;
  customer_phone?: string;
  total: number;
  tax: number;
  discount: number;
  created_at: string;
}

interface FinancialLedgerEntry {
  id: string;
  code: string;
  orderNumber?: string;
  source: "dine_in" | "takeaway" | "delivery" | "online";
  customerName: string;
  paymentMethod: "cash" | "card" | "online" | "split" | "cod";
  amount: number;
  tax: number;
  discount: number;
  tableNumber?: string;
  status: string;
  timestamp: string;
  sourceType: "sales_transaction" | "online_order";
}

export default function AdminSalesPage() {
  const [transactions, setTransactions] = useState<SalesTransaction[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"today" | "7days" | "month" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const fetchData = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // 1. Fetch sales_transactions
      const { data: salesData, error: salesErr } = await supabase
        .from("sales_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (salesErr) {
        console.warn("Could not query sales_transactions:", salesErr.message);
      }

      // 2. Fetch completed/paid orders
      const { data: ordersData, error: ordersErr } = await supabase
        .from("orders")
        .select("id, order_number, order_type, status, payment_status, payment_method, customer_name, customer_phone, total, tax, discount, created_at")
        .order("created_at", { ascending: false });

      if (ordersErr) {
        console.warn("Could not query orders:", ordersErr.message);
      }

      setTransactions(salesData || []);
      setOrders(ordersData || []);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error refreshing financials:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Merge & harmonize sales_transactions + orders without double-counting
  const unifiedLedger = useMemo<FinancialLedgerEntry[]>(() => {
    const list: FinancialLedgerEntry[] = [];
    const accountedOrderIds = new Set<string>();

    // 1. Ingest sales_transactions (Primary ledger for POS & Settled revenue)
    transactions.forEach((tx) => {
      if (tx.source_order_id) {
        accountedOrderIds.add(tx.source_order_id);
      }

      let normPayment: FinancialLedgerEntry["paymentMethod"] = "cash";
      if (tx.payment_method === "card") normPayment = "card";
      else if (tx.payment_method === "online_gateway") normPayment = "online";
      else if (tx.payment_method === "split") normPayment = "split";

      let normSource: FinancialLedgerEntry["source"] = "dine_in";
      if (tx.source === "takeaway") normSource = "takeaway";
      else if (tx.source === "online") normSource = "online";

      list.push({
        id: tx.id,
        code: `TXN-${tx.id.slice(0, 8).toUpperCase()}`,
        orderNumber: tx.source_order_id ? `ORD-${tx.source_order_id.slice(0, 6)}` : undefined,
        source: normSource,
        customerName: tx.customer_name || "Walk-in Guest",
        paymentMethod: normPayment,
        amount: tx.total,
        tax: tx.tax || 0,
        discount: tx.discount || 0,
        tableNumber: tx.table_number || undefined,
        status: tx.transaction_status,
        timestamp: tx.created_at,
        sourceType: "sales_transaction",
      });
    });

    // 2. Ingest completed or paid orders that don't have an explicit sales_transaction record
    orders.forEach((ord) => {
      if (accountedOrderIds.has(ord.id)) return; // Avoid duplicate counting
      if (ord.payment_status !== "paid" && ord.status !== "completed") return; // Only realized revenue

      let normPayment: FinancialLedgerEntry["paymentMethod"] = "cash";
      if (ord.payment_method === "pos_card") normPayment = "card";
      else if (ord.payment_method === "online_sandbox") normPayment = "online";
      else if (ord.payment_method === "cod") normPayment = "cod";

      let normSource: FinancialLedgerEntry["source"] = "delivery";
      if (ord.order_type === "takeaway" || ord.order_type === "pickup") normSource = "takeaway";

      list.push({
        id: ord.id,
        code: ord.order_number,
        orderNumber: ord.order_number,
        source: normSource,
        customerName: ord.customer_name || "Guest Diner",
        paymentMethod: normPayment,
        amount: ord.total,
        tax: ord.tax || 0,
        discount: ord.discount || 0,
        status: ord.status,
        timestamp: ord.created_at,
        sourceType: "online_order",
      });
    });

    // Sort by timestamp descending
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions, orders]);

  // Apply filters: Timeframe, Search, Source, Payment
  const filteredLedger = useMemo(() => {
    const now = new Date();

    return unifiedLedger.filter((entry) => {
      const entryDate = new Date(entry.timestamp);

      // Timeframe Filter
      if (timeframe === "today") {
        const isSameDay =
          entryDate.getDate() === now.getDate() &&
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear();
        if (!isSameDay) return false;
      } else if (timeframe === "7days") {
        const diffDays = (now.getTime() - entryDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      } else if (timeframe === "month") {
        const isSameMonth =
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear();
        if (!isSameMonth) return false;
      }

      // Source Filter
      if (sourceFilter !== "all" && entry.source !== sourceFilter) {
        return false;
      }

      // Payment Filter
      if (paymentFilter !== "all") {
        if (paymentFilter === "cash" && entry.paymentMethod !== "cash" && entry.paymentMethod !== "cod") return false;
        if (paymentFilter === "card" && entry.paymentMethod !== "card") return false;
        if (paymentFilter === "online" && entry.paymentMethod !== "online") return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = entry.code.toLowerCase().includes(q);
        const matchesOrder = entry.orderNumber?.toLowerCase().includes(q);
        const matchesCustomer = entry.customerName.toLowerCase().includes(q);
        const matchesTable = entry.tableNumber?.toLowerCase().includes(q);
        if (!matchesCode && !matchesOrder && !matchesCustomer && !matchesTable) {
          return false;
        }
      }

      return true;
    });
  }, [unifiedLedger, timeframe, sourceFilter, paymentFilter, searchQuery]);

  // Financial KPI Metrics
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let todayCollections = 0;
    const now = new Date();

    filteredLedger.forEach((item) => {
      if (item.status !== "refunded" && item.status !== "cancelled") {
        totalRevenue += item.amount;

        const d = new Date(item.timestamp);
        if (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        ) {
          todayCollections += item.amount;
        }
      }
    });

    const validCount = filteredLedger.filter((i) => i.status !== "refunded" && i.status !== "cancelled").length;
    const avgOrderValue = validCount > 0 ? Math.round(totalRevenue / validCount) : 0;

    // Payment Method Breakdown
    const paymentBreakdown = {
      cash: { count: 0, sum: 0 },
      card: { count: 0, sum: 0 },
      online: { count: 0, sum: 0 },
    };

    // Source Breakdown
    const sourceBreakdown = {
      dine_in: { count: 0, sum: 0 },
      takeaway: { count: 0, sum: 0 },
      delivery: { count: 0, sum: 0 },
    };

    filteredLedger.forEach((item) => {
      if (item.status === "refunded" || item.status === "cancelled") return;

      // Payment
      if (item.paymentMethod === "cash" || item.paymentMethod === "cod") {
        paymentBreakdown.cash.count += 1;
        paymentBreakdown.cash.sum += item.amount;
      } else if (item.paymentMethod === "card") {
        paymentBreakdown.card.count += 1;
        paymentBreakdown.card.sum += item.amount;
      } else {
        paymentBreakdown.online.count += 1;
        paymentBreakdown.online.sum += item.amount;
      }

      // Source
      if (item.source === "dine_in") {
        sourceBreakdown.dine_in.count += 1;
        sourceBreakdown.dine_in.sum += item.amount;
      } else if (item.source === "takeaway") {
        sourceBreakdown.takeaway.count += 1;
        sourceBreakdown.takeaway.sum += item.amount;
      } else {
        sourceBreakdown.delivery.count += 1;
        sourceBreakdown.delivery.sum += item.amount;
      }
    });

    return {
      totalRevenue,
      todayCollections,
      avgOrderValue,
      totalCount: validCount,
      paymentBreakdown,
      sourceBreakdown,
    };
  }, [filteredLedger]);

  // CSV Export handler
  const exportToCSV = () => {
    if (filteredLedger.length === 0) return;

    const headers = [
      "Transaction ID",
      "Order Reference",
      "Source",
      "Table",
      "Customer",
      "Payment Method",
      "Amount (PKR)",
      "Status",
      "Date & Time",
    ];

    const rows = filteredLedger.map((row) => [
      row.code,
      row.orderNumber || "N/A",
      row.source.toUpperCase(),
      row.tableNumber || "N/A",
      `"${row.customerName.replace(/"/g, '""')}"`,
      row.paymentMethod.toUpperCase(),
      row.amount,
      row.status.toUpperCase(),
      new Date(row.timestamp).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Dastarkhwan_Financial_Ledger_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto text-on-surface">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Treasury & Settlement Ledger</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-on-surface">
            Sales Tracker & Financial Reports
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Aggregated revenue reporting across Floor POS, Takeaway, and Online Deliveries.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {lastRefreshed && (
            <span className="hidden sm:inline text-xs text-on-surface-variant flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Synced {lastRefreshed}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface-container rounded-lg border border-primary/20 text-on-surface hover:text-primary hover:border-primary/40 transition-colors text-xs font-medium disabled:opacity-50"
            title="Refresh Financials"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredLedger.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* High-Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-6 bg-surface-container-lowest rounded-xl border border-primary/30 relative overflow-hidden group shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-medium text-on-surface-variant tracking-wider">
              Total Realized Revenue
            </span>
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-primary tracking-tight">
            PKR {metrics.totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-2">
            <span className="text-emerald-400 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Filtered Scope
            </span>
            <span>({metrics.totalCount} transactions)</span>
          </div>
        </div>

        {/* Today's Collections */}
        <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 relative overflow-hidden group shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-medium text-on-surface-variant tracking-wider">
              Today's Collections
            </span>
            <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-on-surface tracking-tight">
            PKR {metrics.todayCollections.toLocaleString()}
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Settled today from midnight to now
          </p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-medium text-on-surface-variant tracking-wider">
              Average Order Value
            </span>
            <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-on-surface tracking-tight">
            PKR {metrics.avgOrderValue.toLocaleString()}
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Average ticket size across completed bills
          </p>
        </div>

        {/* Settled Transactions */}
        <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-medium text-on-surface-variant tracking-wider">
              Settled Volume
            </span>
            <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-on-surface tracking-tight">
            {metrics.totalCount}
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Bills successfully closed & audited
          </p>
        </div>
      </div>

      {/* Breakdowns: Payment Method & Channel Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 space-y-5">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <h2 className="font-serif font-bold text-lg text-on-surface">Payment Method Mix</h2>
            </div>
            <span className="text-xs text-on-surface-variant">Realized Revenue</span>
          </div>

          <div className="space-y-4">
            {/* Cash */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-on-surface flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  Cash on Hand / COD
                </span>
                <span className="text-primary font-mono">
                  PKR {metrics.paymentBreakdown.cash.sum.toLocaleString()} (
                  {metrics.totalRevenue > 0
                    ? Math.round((metrics.paymentBreakdown.cash.sum / metrics.totalRevenue) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      metrics.totalRevenue > 0
                        ? (metrics.paymentBreakdown.cash.sum / metrics.totalRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                {metrics.paymentBreakdown.cash.count} transactions settled via physical currency
              </p>
            </div>

            {/* Card */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-on-surface flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
                  POS Terminal Cards (Visa/Mastercard)
                </span>
                <span className="text-primary font-mono">
                  PKR {metrics.paymentBreakdown.card.sum.toLocaleString()} (
                  {metrics.totalRevenue > 0
                    ? Math.round((metrics.paymentBreakdown.card.sum / metrics.totalRevenue) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      metrics.totalRevenue > 0
                        ? (metrics.paymentBreakdown.card.sum / metrics.totalRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                {metrics.paymentBreakdown.card.count} transactions processed on merchant POS
              </p>
            </div>

            {/* Online / Sandbox */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-on-surface flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Online Gateway / Digital Transfer
                </span>
                <span className="text-primary font-mono">
                  PKR {metrics.paymentBreakdown.online.sum.toLocaleString()} (
                  {metrics.totalRevenue > 0
                    ? Math.round((metrics.paymentBreakdown.online.sum / metrics.totalRevenue) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      metrics.totalRevenue > 0
                        ? (metrics.paymentBreakdown.online.sum / metrics.totalRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                {metrics.paymentBreakdown.online.count} transactions through web checkout
              </p>
            </div>
          </div>
        </div>

        {/* Channel Sources */}
        <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 space-y-5">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <h2 className="font-serif font-bold text-lg text-on-surface">Order Channel Share</h2>
            </div>
            <span className="text-xs text-on-surface-variant">Fulfillment Channels</span>
          </div>

          <div className="space-y-4">
            {/* Dine In */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-on-surface flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-primary" />
                  Dine-In Hall (POS Tables)
                </span>
                <span className="text-primary font-mono">
                  PKR {metrics.sourceBreakdown.dine_in.sum.toLocaleString()} (
                  {metrics.totalRevenue > 0
                    ? Math.round((metrics.sourceBreakdown.dine_in.sum / metrics.totalRevenue) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      metrics.totalRevenue > 0
                        ? (metrics.sourceBreakdown.dine_in.sum / metrics.totalRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                {metrics.sourceBreakdown.dine_in.count} tables served at DHA Phase 8 Haven
              </p>
            </div>

            {/* Takeaway */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-on-surface flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-secondary" />
                  Takeaway & Pickup Counters
                </span>
                <span className="text-primary font-mono">
                  PKR {metrics.sourceBreakdown.takeaway.sum.toLocaleString()} (
                  {metrics.totalRevenue > 0
                    ? Math.round((metrics.sourceBreakdown.takeaway.sum / metrics.totalRevenue) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      metrics.totalRevenue > 0
                        ? (metrics.sourceBreakdown.takeaway.sum / metrics.totalRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                {metrics.sourceBreakdown.takeaway.count} takeaway parcels collected
              </p>
            </div>

            {/* Delivery */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-on-surface flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  Online Home Delivery
                </span>
                <span className="text-primary font-mono">
                  PKR {metrics.sourceBreakdown.delivery.sum.toLocaleString()} (
                  {metrics.totalRevenue > 0
                    ? Math.round((metrics.sourceBreakdown.delivery.sum / metrics.totalRevenue) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      metrics.totalRevenue > 0
                        ? (metrics.sourceBreakdown.delivery.sum / metrics.totalRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                {metrics.sourceBreakdown.delivery.count} doorstep deliveries across Karachi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Filter Controls & Search */}
      <div className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Timeframe Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-lg border border-outline-variant/20 self-start">
            <button
              onClick={() => setTimeframe("today")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                timeframe === "today"
                  ? "bg-primary text-on-primary font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe("7days")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                timeframe === "7days"
                  ? "bg-primary text-on-primary font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeframe("month")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                timeframe === "month"
                  ? "bg-primary text-on-primary font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                timeframe === "all"
                  ? "bg-primary text-on-primary font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              All Time
            </button>
          </div>

          {/* Secondary Selectors (Source, Payment) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Source dropdown */}
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/20 text-xs">
              <span className="text-on-surface-variant">Source:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-transparent text-primary font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-surface-container text-on-surface">All Sources</option>
                <option value="dine_in" className="bg-surface-container text-on-surface">Dine-In</option>
                <option value="takeaway" className="bg-surface-container text-on-surface">Takeaway</option>
                <option value="delivery" className="bg-surface-container text-on-surface">Delivery</option>
              </select>
            </div>

            {/* Payment method dropdown */}
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/20 text-xs">
              <span className="text-on-surface-variant">Payment:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-transparent text-primary font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-surface-container text-on-surface">All Methods</option>
                <option value="cash" className="bg-surface-container text-on-surface">Cash / COD</option>
                <option value="card" className="bg-surface-container text-on-surface">Card</option>
                <option value="online" className="bg-surface-container text-on-surface">Online Gateway</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Transaction ID, Order #, Guest name, or Table number..."
            className="w-full bg-surface-container pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant/30 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/* Financial Transactions Ledger Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            <h3 className="font-serif font-bold text-on-surface text-base">
              Settlement Ledger ({filteredLedger.length} Records)
            </h3>
          </div>
          <span className="text-xs text-on-surface-variant">Amounts in PKR</span>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
            <RefreshCcw className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs uppercase tracking-widest font-medium">Auditing financial database...</p>
          </div>
        ) : filteredLedger.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant space-y-2">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="font-medium text-sm text-on-surface">No financial transactions match your query</p>
            <p className="text-xs text-on-surface-variant">
              Adjust filters or settle orders via the POS Terminal or Online Store.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container/60 text-on-surface-variant uppercase tracking-wider text-[11px] border-b border-outline-variant/20">
                <tr>
                  <th className="py-3.5 px-5">Identifier</th>
                  <th className="py-3.5 px-4">Channel & Context</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4 text-right">Amount (PKR)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                {filteredLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container/40 transition">
                    {/* Identifier */}
                    <td className="py-4 px-5 font-mono">
                      <div className="font-semibold text-primary">{row.code}</div>
                      {row.orderNumber && row.orderNumber !== row.code && (
                        <div className="text-[10px] text-on-surface-variant mt-0.5">
                          Ref: {row.orderNumber}
                        </div>
                      )}
                    </td>

                    {/* Channel & Context */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {row.source === "dine_in" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                            <Utensils className="w-3 h-3" />
                            Dine-In {row.tableNumber ? `(T-${row.tableNumber})` : ""}
                          </span>
                        )}
                        {row.source === "takeaway" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary/10 text-secondary border border-secondary/20">
                            <ShoppingBag className="w-3 h-3" /> Takeaway
                          </span>
                        )}
                        {(row.source === "delivery" || row.source === "online") && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Truck className="w-3 h-3" /> Delivery
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4 font-medium text-on-surface">
                      {row.customerName}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-4">
                      <span className="capitalize font-mono text-[11px] text-on-surface-variant flex items-center gap-1">
                        {row.paymentMethod === "cash" || row.paymentMethod === "cod" ? (
                          <Wallet className="w-3 h-3 text-emerald-400" />
                        ) : row.paymentMethod === "card" ? (
                          <CreditCard className="w-3 h-3 text-blue-400" />
                        ) : (
                          <DollarSign className="w-3 h-3 text-amber-400" />
                        )}
                        {row.paymentMethod.replace("_", " ")}
                      </span>
                    </td>

                    {/* Settled Amount */}
                    <td className="py-4 px-4 text-right font-mono font-bold text-on-surface text-sm">
                      {row.amount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          row.status === "completed" || row.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : row.status === "refunded"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {row.status}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-5 text-right font-mono text-on-surface-variant text-[11px]">
                      {new Date(row.timestamp).toLocaleDateString()}{" "}
                      <span className="text-on-surface-variant/60">
                        {new Date(row.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
