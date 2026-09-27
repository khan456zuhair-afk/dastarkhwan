"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Settings, 
  MapPin, 
  Users, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw,
  Sliders,
  Shield,
  Store
} from "lucide-react";

export default function AdminSettingsPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Table Form State
  const [newTable, setNewTable] = useState({
    table_number: "",
    capacity: 4,
    location_area: "main_dining",
    is_active: true
  });

  const fetchTables = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("restaurant_tables")
        .select("*")
        .order("table_number");

      if (error) throw error;
      setTables(data || []);
    } catch (err) {
      console.error("Error fetching tables:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const toggleTableStatus = async (id: string, currentStatus: boolean) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("restaurant_tables")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      setTables(tables.map(t => t.id === id ? { ...t, is_active: !currentStatus } : t));
    } catch (err: any) {
      alert("Failed to update table status: " + err.message);
    }
  };

  const deleteTable = async (id: string) => {
    if (!confirm("Are you sure you want to remove this table?")) return;
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("restaurant_tables")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setTables(tables.filter(t => t.id !== id));
    } catch (err: any) {
      alert("Cannot delete table linked with historical reservations. Deactivate it instead.");
    }
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    try {
      const { error } = await supabase.from("restaurant_tables").insert({
        table_number: newTable.table_number,
        capacity: Number(newTable.capacity),
        location_area: newTable.location_area,
        is_active: newTable.is_active
      });

      if (error) throw error;

      setIsModalOpen(false);
      setNewTable({ table_number: "", capacity: 4, location_area: "main_dining", is_active: true });
      fetchTables();
      alert("Table commissioned successfully!");
    } catch (err: any) {
      alert("Error adding table: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 text-on-surface">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary/20 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Restaurant Settings & Tables Management
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Configure floor layouts, seating capacities, and operational rules for DHA Phase 8 branch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTables}
              className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high border border-primary/30 rounded-xl text-xs font-medium flex items-center gap-2 text-primary transition-all"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Tables</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Commission New Table</span>
            </button>
          </div>
        </div>

        {/* Floor Seating Inventory */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Floor Seating Enclaves & Tables
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tables.map(table => (
              <div key={table.id} className="bg-surface-container rounded-2xl border border-outline-variant/30 p-5 space-y-4 shadow-md hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-lg text-primary">Table {table.table_number}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      table.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {table.is_active ? 'Active' : 'Offline'}
                    </span>
                  </div>

                  <p className="text-xs capitalize text-on-surface-variant">Area: {table.location_area?.replace('_', ' ')}</p>
                  
                  <div className="flex items-center gap-1.5 text-xs font-mono text-on-surface pt-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Capacity: {table.capacity} Guests</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10 text-xs">
                  <button
                    onClick={() => toggleTableStatus(table.id, table.is_active)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                      table.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {table.is_active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => deleteTable(table.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Table Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container border border-primary/30 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
              <h2 className="font-serif text-2xl font-bold text-primary">Commission New Table</h2>
              <form onSubmit={handleCreateTable} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold uppercase text-outline-variant">Table Identifier / Number</label>
                  <input
                    type="text"
                    required
                    value={newTable.table_number}
                    onChange={(e) => setNewTable({ ...newTable, table_number: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm"
                    placeholder="e.g. 12 or Majlis B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold uppercase text-outline-variant">Guest Capacity</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={30}
                      value={newTable.capacity}
                      onChange={(e) => setNewTable({ ...newTable, capacity: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold uppercase text-outline-variant">Location Area</label>
                    <select
                      value={newTable.location_area}
                      onChange={(e) => setNewTable({ ...newTable, location_area: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm"
                    >
                      <option value="main_dining">Grand Dining Hall</option>
                      <option value="family_majlis">Shahi Majlis</option>
                      <option value="sea_breeze_terrace">Coastal Patio</option>
                      <option value="private_diwan">Private Diwan</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-surface-container-high rounded-xl text-on-surface font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg"
                  >
                    Commission Table
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}



