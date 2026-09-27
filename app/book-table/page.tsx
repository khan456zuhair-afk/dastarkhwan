"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  Calendar, 
  Clock, 
  Users, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Copy
} from "lucide-react";

export default function BookTablePage() {
  // Form State
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00:00");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seatingPreference, setSeatingPreference] = useState("main_dining");
  const [specialRequest, setSpecialRequest] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ code: string; date: string; time: string; guests: number } | null>(null);
  const [copied, setCopied] = useState(false);

  // Get Today's Date in YYYY-MM-DD format for the min date attribute
  const todayStr = new Date().toISOString().split("T")[0];

  // Auto-prefill data if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (profile) {
          setName(profile.full_name || "");
          setEmail(profile.email || user.email || "");
          setPhone(profile.phone || "");
        }
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Call our secure server-side function
      const { data, error: rpcError } = await supabase.rpc("create_reservation", {
        p_date: date,
        p_time: time,
        p_guests: Number(guests),
        p_name: name,
        p_phone: phone,
        p_email: email,
        p_special_request: specialRequest || null,
        p_seating_preference: seatingPreference,
      });

      if (rpcError) throw rpcError;

      if (data && data.success) {
        setSuccessData({ 
          code: data.reservation_code,
          date,
          time,
          guests
        });
      } else {
        throw new Error(data?.message || "Failed to secure reservation.");
      }
    } catch (err: any) {
      console.error("Reservation Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SUCCESS STATE UI
  if (successData) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 py-12 pt-28">
        <div className="w-full max-w-lg p-8 bg-surface-container rounded-2xl border border-primary/30 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold text-on-surface">Table Secured</h2>
            <p className="text-sm text-on-surface-variant">Your imperial dining experience awaits.</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 space-y-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">Reservation Code</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl text-on-surface font-bold tracking-wider">{successData.code}</span>
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-surface-container hover:bg-surface-container-high rounded-md transition-colors border border-outline-variant/30 text-primary"
                title="Copy Code"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20 text-sm">
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Date</p>
                <p className="font-medium text-on-surface">{successData.date}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Time</p>
                <p className="font-medium text-on-surface">{successData.time.substring(0,5)}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Guests</p>
                <p className="font-medium text-on-surface">{successData.guests}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Link href="/" className="flex-1 py-3 btn-ghost-gold rounded-lg text-sm font-semibold flex justify-center items-center">
              Return to Grand Hall
            </Link>
            <Link href="/menu" className="flex-1 py-3 btn-imperial rounded-lg text-sm font-semibold flex justify-center items-center gap-2">
              <span>View Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // BOOKING FORM UI
  return (
    <div className="min-h-screen bg-surface pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-on-surface">
            Reserve Your <span className="text-primary italic">Table</span>
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Experience the grandeur of Imperial Pakistani Cuisine. Secure your table in advance to ensure a flawless dining experience.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-surface-container p-6 sm:p-10 rounded-2xl border border-primary/20 shadow-xl">
          
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl flex items-start gap-3 text-sm text-error">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Date, Time, Guests */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold text-primary border-b border-primary/20 pb-2">Dining Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Time *
                  </label>
                  <select
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    <option value="18:00:00">06:00 PM - Evening Service</option>
                    <option value="19:00:00">07:00 PM - Prime Dining</option>
                    <option value="20:00:00">08:00 PM - Prime Dining</option>
                    <option value="21:00:00">09:00 PM - Late Dinner</option>
                    <option value="22:00:00">10:00 PM - Late Dinner</option>
                    <option value="23:00:00">11:00 PM - Midnight Service</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Guests *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={30}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Seating Preference */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold text-primary border-b border-primary/20 pb-2">Seating Preference</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'main_dining', label: 'Grand Dining Hall', desc: 'Experience the vibrant imperial atmosphere.' },
                  { id: 'private_room', label: 'Shahi Majlis', desc: 'Private room for an exclusive experience.' },
                  { id: 'patio', label: 'Coastal Patio', desc: 'Outdoor seating with the sea breeze.' }
                ].map((pref) => (
                  <label 
                    key={pref.id}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      seatingPreference === pref.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="seating" 
                      value={pref.id}
                      checked={seatingPreference === pref.id}
                      onChange={() => setSeatingPreference(pref.id)}
                      className="sr-only"
                    />
                    <p className={`font-semibold text-sm ${seatingPreference === pref.id ? 'text-primary' : 'text-on-surface'}`}>
                      {pref.label}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      {pref.desc}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold text-primary border-b border-primary/20 pb-2">Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" /> Special Requests (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="Any dietary requirements or special occasions?"
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface placeholder:text-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 btn-imperial rounded-xl text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Securing your table...</span>
                ) : (
                  <>
                    <span>Confirm Reservation</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}