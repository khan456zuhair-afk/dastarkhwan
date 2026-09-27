"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  RefreshCcw, 
  Search, 
  Filter, 
  ChevronDown,
  CheckCircle2,
  XCircle,
  MapPin,
  FileText
} from "lucide-react";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lastSynced, setLastSynced] = useState<string>("");

  const fetchReservations = async () => {
    setIsLoading(true);
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          restaurant_tables (
            table_number,
            location_area,
            capacity
          )
        `)
        .order("reservation_date", { ascending: false })
        .order("reservation_time", { ascending: false });

      if (error) throw error;
      setReservations(data || []);
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", reservationId);

      if (error) throw error;

      // Update local state instantly
      setReservations(reservations.map(r => r.id === reservationId ? { ...r, status: newStatus } : r));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.reservation_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.phone?.includes(searchQuery) ||
      res.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || res.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 text-on-surface">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary/20 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-primary" />
              Table Reservations Management
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Real-time table booking tracking, seating allocations, and guest management.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-outline-variant">
              Last Synced: {lastSynced || "Syncing..."}
            </span>
            <button
              onClick={fetchReservations}
              disabled={isLoading}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-primary/30 rounded-xl text-sm font-medium flex items-center gap-2 transition-all text-primary"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Reservations</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-outline-variant" />
            <input
              type="text"
              placeholder="Search by Code, Guest Name, Email, or Phone..."
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
              <option value="all">All Statuses ({reservations.length})</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="seated">Seated</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-outline-variant pointer-events-none" />
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-surface-container rounded-2xl border border-primary/20 shadow-xl overflow-hidden">
          {isLoading && reservations.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant font-serif">
              Loading imperial reservations queue...
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              No reservations found matching the filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-high/50 text-xs font-semibold text-primary uppercase tracking-wider">
                    <th className="p-4">Reference Code</th>
                    <th className="p-4">Guest Details</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Party Size</th>
                    <th className="p-4">Seating Area</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm">
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-surface-container-high/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-primary">
                        {res.reservation_code}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-on-surface">{res.guest_name}</p>
                        <p className="text-xs text-on-surface-variant font-mono">{res.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-on-surface">{res.reservation_date}</p>
                        <p className="text-xs text-on-surface-variant font-mono">{res.reservation_time}</p>
                      </td>
                      <td className="p-4 font-mono font-semibold text-on-surface">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-primary" />
                          {res.party_size} Guests
                        </span>
                      </td>
                      <td className="p-4 capitalize">
                        <span className="px-2.5 py-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs font-medium">
                          {res.seating_area || "Grand Dining Hall"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          res.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          res.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          res.status === 'seated' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                          res.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={res.status}
                          onChange={(e) => updateReservationStatus(res.id, e.target.value)}
                          className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="seated">Seated</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no_show">No Show</option>
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