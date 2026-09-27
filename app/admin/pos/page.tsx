"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Utensils, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  DollarSign, 
  ShoppingBag,
  User,
  Phone,
  Tag
} from "lucide-react";

export default function AdminPOSPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [orderType, setOrderType] = useState("dine_in");
  const [customerName, setCustomerName] = useState("Walk-in Guest");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [kitchenNotes, setKitchenNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState<any | null>(null);

  useEffect(() => {
    fetchPOSData();
  }, []);

  const fetchPOSData = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const [menuRes, catRes, tablesRes] = await Promise.all([
        supabase.from("menu_items").select("*").eq("is_available", true),
        supabase.from("categories").select("*"),
        supabase.from("restaurant_tables").select("*")
      ]);

      setMenuItems(menuRes.data || []);
      setCategories(catRes.data || []);
      setTables(tablesRes.data || []);
    } catch (err) {
      console.error("Error fetching POS data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1, special_instructions: "" }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : null;
      }
      return c;
    }).filter(Boolean));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = Math.max(0, subtotal - discountValue);

  const handleCheckout = async (status: string, paymentStatus: string) => {
    if (cart.length === 0) {
      alert("Please add items to the POS cart first.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    
    try {
      const orderNumber = `DST-POS-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: customerName,
          phone: customerPhone || "N/A",
          order_type: orderType,
          table_id: selectedTable || null,
          status: status,
          payment_status: paymentStatus,
          subtotal: subtotal,
          discount_amount: discountValue,
          total_price: grandTotal,
          kitchen_notes: kitchenNotes
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsPayload = cart.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        item_name_snapshot: item.name,
        unit_price_snapshot: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity,
        special_instructions: item.special_instructions || null
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);
      if (itemsError) throw itemsError;

      if (paymentStatus === "paid") {
        await supabase.from("sales_transactions").insert({
          order_id: orderData.id,
          source: orderType,
          payment_method: paymentMethod,
          amount_paid: grandTotal
        });
      }

      setReceiptData({
        orderNumber,
        customerName,
        orderType,
        selectedTable,
        items: [...cart],
        subtotal,
        discount: discountValue,
        grandTotal,
        timestamp: new Date().toLocaleString()
      });

      setCart([]);
      setKitchenNotes("");
      alert(`Success! Order ${orderNumber} processed.`);
    } catch (err: any) {
      alert("Checkout failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMenu = menuItems.filter(item => {
    const matchesCat = selectedCategory === "all" || item.category_id === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 text-on-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Menu Catalog */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary/20 pb-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Utensils className="w-7 h-7 text-primary" />
                POS & Dine-In Terminal
              </h1>
              <p className="text-xs text-on-surface-variant">DHA Phase 8 Imperial Terminal</p>
            </div>
          </div>

          {/* Search & Categories */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-outline-variant" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:border-primary"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === "all" ? "bg-primary text-on-primary shadow-md" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id ? "bg-primary text-on-primary shadow-md" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredMenu.map(item => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between group shadow-sm hover:border-primary/50"
              >
                <div>
                  <h3 className="font-serif font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1">{item.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-2 border-t border-outline-variant/10">
                  <span className="font-mono font-bold text-primary text-xs">Rs. {item.price}</span>
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Active POS Ticket */}
        <div className="lg:col-span-5 bg-surface-container rounded-2xl border border-primary/20 shadow-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span>Active Ticket</span>
              <span className="text-xs font-mono px-2.5 py-1 bg-primary/10 text-primary rounded-lg">
                {cart.length} items
              </span>
            </h2>

            {/* Order Type & Table */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-outline-variant uppercase">Order Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-xs text-on-surface"
                >
                  <option value="dine_in">Dine-In</option>
                  <option value="takeaway">Takeaway</option>
                </select>
              </div>

              {orderType === "dine_in" && (
                <div>
                  <label className="text-[11px] font-semibold text-outline-variant uppercase">Table Assignment</label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-xs text-on-surface"
                  >
                    <option value="">Select Table...</option>
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>Table {t.table_number} ({t.location_area})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-outline-variant uppercase">Guest Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-xs text-on-surface"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-outline-variant uppercase">Phone Number</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-xs text-on-surface"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 divide-y divide-outline-variant/10">
              {cart.length === 0 ? (
                <p className="text-center py-8 text-xs text-on-surface-variant font-serif">Ticket is empty. Tap menu items to add.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="pt-2 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-on-surface">{item.name}</p>
                      <p className="font-mono text-[11px] text-primary">Rs. {item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded bg-surface-container-lowest hover:bg-surface-container-high">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded bg-surface-container-lowest hover:bg-surface-container-high">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 rounded text-red-400 hover:bg-red-500/10 ml-2">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals & Discounts */}
            <div className="space-y-2 pt-3 border-t border-outline-variant/20 text-xs font-mono">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal:</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Discount (PKR):</span>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-surface-container-lowest border border-outline-variant/30 rounded text-right text-xs"
                />
              </div>
              <div className="flex justify-between text-base font-bold text-primary pt-2 border-t border-outline-variant/20">
                <span>Grand Total:</span>
                <span>Rs. {grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Checkout Action Buttons */}
          <div className="space-y-3 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCheckout("preparing", "pending")}
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-2.5 bg-surface-container-high hover:bg-surface-container-highest border border-primary/40 rounded-xl text-xs font-bold text-primary transition-all flex items-center justify-center gap-2"
              >
                <span>Send to Kitchen</span>
              </button>

              <button
                onClick={() => handleCheckout("completed", "paid")}
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Settle & Print</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}