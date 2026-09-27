"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  UtensilsCrossed, 
  Search, 
  Plus, 
  Edit3, 
  ToggleLeft, 
  ToggleRight, 
  DollarSign, 
  Tag, 
  Layers,
  CheckCircle2,
  XCircle,
  RefreshCcw
} from "lucide-react";

export default function AdminMenuManagementPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // New Item Form State
  const [newItem, setNewItem] = useState({
    name: "",
    category_id: "",
    price: "",
    description: "",
    portion_info: "Serves 1-2",
    origin_badge: "Imperial Special",
    image_url: "",
    is_available: true
  });

  const fetchData = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const [menuRes, catRes] = await Promise.all([
        supabase.from("menu_items").select("*, categories(name)").order("name"),
        supabase.from("categories").select("*").order("name")
      ]);

      setMenuItems(menuRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error("Error fetching menu catalog:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ is_available: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      setMenuItems(menuItems.map(item => item.id === id ? { ...item, is_available: !currentStatus } : item));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    try {
      const slug = newItem.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { error } = await supabase.from("menu_items").insert({
        ...newItem,
        price: Number(newItem.price),
        slug
      });

      if (error) throw error;

      setIsCreateModalOpen(false);
      setNewItem({
        name: "",
        category_id: "",
        price: "",
        description: "",
        portion_info: "Serves 1-2",
        origin_badge: "Imperial Special",
        image_url: "",
        is_available: true
      });
      fetchData();
      alert("Menu item created successfully!");
    } catch (err: any) {
      alert("Error creating item: " + err.message);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({
          name: editingItem.name,
          price: Number(editingItem.price),
          description: editingItem.description,
          portion_info: editingItem.portion_info,
          origin_badge: editingItem.origin_badge,
          image_url: editingItem.image_url
        })
        .eq("id", editingItem.id);

      if (error) throw error;

      setEditingItem(null);
      fetchData();
      alert("Menu item updated successfully!");
    } catch (err: any) {
      alert("Error updating item: " + err.message);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === "all" || item.category_id === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = stockFilter === "all" || 
                         (stockFilter === "in_stock" && item.is_available) || 
                         (stockFilter === "out_of_stock" && !item.is_available);

    return matchesCat && matchesSearch && matchesStock;
  });

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 text-on-surface">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary/20 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <UtensilsCrossed className="w-8 h-8 text-primary" />
              Menu Items & Stock Management
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Control culinary catalog pricing, availability status, and add new imperial dishes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high border border-primary/30 rounded-xl text-xs font-medium flex items-center gap-2 text-primary transition-all"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Dish</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-outline-variant" />
            <input
              type="text"
              placeholder="Search dishes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:border-primary"
            />
          </div>

          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:border-primary"
            >
              <option value="all">All Stock States ({menuItems.length})</option>
              <option value="in_stock">In Stock Only</option>
              <option value="out_of_stock">Out of Stock / Sold Out</option>
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 items-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === "all" ? "bg-primary text-on-primary shadow" : "bg-surface-container text-on-surface-variant"
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id ? "bg-primary text-on-primary shadow" : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col justify-between shadow-md hover:border-primary/50 transition-all">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {item.origin_badge || "Imperial"}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-on-surface mt-1">{item.name}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                    item.is_available ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {item.is_available ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-2">{item.description}</p>
                
                <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-outline-variant/10">
                  <span className="text-primary font-bold text-sm">Rs. {item.price}</span>
                  <span className="text-on-surface-variant">{item.portion_info || "Serves 1-2"}</span>
                </div>
              </div>

              <div className="p-4 bg-surface-container-high/50 border-t border-outline-variant/20 flex justify-between items-center">
                <button
                  onClick={() => toggleAvailability(item.id, item.is_available)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    item.is_available ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                  }`}
                >
                  {item.is_available ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{item.is_available ? "Pause Stock" : "Make Available"}</span>
                </button>

                <button
                  onClick={() => setEditingItem(item)}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-highest border border-outline-variant/40 rounded-xl text-xs font-medium text-on-surface flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container border border-primary/30 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
              <h2 className="font-serif text-2xl font-bold text-primary">Create New Menu Item</h2>
              <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold uppercase text-outline-variant">Dish Title</label>
                  <input
                    type="text"
                    required
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm"
                    placeholder="e.g. Royal Shahi Biryani"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold uppercase text-outline-variant">Category</label>
                    <select
                      required
                      value={newItem.category_id}
                      onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm"
                    >
                      <option value="">Select Category...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold uppercase text-outline-variant">Price (PKR)</label>
                    <input
                      type="number"
                      required
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm font-mono"
                      placeholder="1850"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold uppercase text-outline-variant">Culinary Description</label>
                  <textarea
                    rows={3}
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm"
                    placeholder="Describe spices, tradition, and preparation..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-surface-container-high rounded-xl text-on-surface font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg"
                  >
                    Save Dish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container border border-primary/30 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
              <h2 className="font-serif text-2xl font-bold text-primary">Edit Menu Item</h2>
              <form onSubmit={handleUpdateItem} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold uppercase text-outline-variant">Dish Title</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold uppercase text-outline-variant">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold uppercase text-outline-variant">Culinary Description</label>
                  <textarea
                    rows={3}
                    value={editingItem.description || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 bg-surface-container-high rounded-xl text-on-surface font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg"
                  >
                    Update Dish
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
