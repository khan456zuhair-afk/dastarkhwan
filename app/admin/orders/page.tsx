"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw, 
  Search, 
  Filter, 
  ChevronDown,
  Truck,
  ShoppingBag,
  User,
  Phone,
  FileText
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [lastSynced, setLastSynced] = useState<string>("");

  const fetchOrders = async () => {
    setIsLoading(true);
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            item_name_snapshot,
            unit_price_snapshot,
            quantity,
            line_total,
            special_instructions
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      // Update local state instantly
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 text-on-surface">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary/20 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              Live Orders Pipeline
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Real-time kitchen ticket management and order fulfillment tracker.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-outline-variant">
              Last Synced: {lastSynced || "Syncing..."}
            </span>
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-primary/30 rounded-xl text-sm font-medium flex items-center gap-2 transition-all text-primary"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-outline-variant" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-3.5 w-4 h-4 text-outline-variant" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
            >
              <option value="all">All Statuses ({orders.length})</option>
              <option value="pending">Pending Review</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">In Kitchen / Degh</option>
              <option value="ready">Ready for Dispatch</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="completed">Delivered & Settled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-outline-variant pointer-events-none" />
          </div>
        </div>

        {/* Orders Table / Cards List */}
        <div className="bg-surface-container rounded-2xl border border-primary/20 shadow-xl overflow-hidden">
          {isLoading && orders.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant font-serif">
              Loading imperial orders pipeline...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              No orders found matching the filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-high/50 text-xs font-semibold text-primary uppercase tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container-high/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-primary">
                        {order.order_number}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-on-surface">{order.customer_name}</p>
                        <p className="text-xs text-on-surface-variant font-mono">{order.phone}</p>
                      </td>
                      <td className="p-4 capitalize">
                        <span className="px-2.5 py-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs font-medium">
                          {order.order_type || "Delivery"}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-semibold text-on-surface">
                        Rs. {order.total_price?.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          order.status === 'preparing' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                          order.status === 'ready' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                          order.status === 'out_for_delivery' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}