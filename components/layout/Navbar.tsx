"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DastarkhwanLogo } from "@/components/brand/DastarkhwanLogo";
import {
  MapPin,
  ShoppingBag,
  User,
  Calendar,
  Menu as MenuIcon,
  X,
  Phone,
  Clock,
  ChevronDown,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/context/cart-context";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  cartItemCount?: number;
  cartTotal?: number;
}

export function Navbar({ cartItemCount, cartTotal }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, total } = useCart();
  const displayCount = cartItemCount !== undefined ? cartItemCount : totalItems;
  const displayTotal = cartTotal !== undefined ? cartTotal : total;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check customer auth state via browser Supabase client
  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const name = user.user_metadata?.full_name || user.email?.split("@")[0];
          setDisplayName(name || "Customer");
        } else {
          setUser(null);
          setDisplayName(null);
        }
      } catch {
        setUser(null);
        setDisplayName(null);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const name = session.user.user_metadata?.full_name || session.user.email?.split("@")[0];
        setDisplayName(name || "Customer");
      } else {
        setUser(null);
        setDisplayName(null);
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDisplayName(null);
    setAccountDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Book Table", href: "/book-table" },
    { name: "Our Heritage", href: "/#heritage" },
    { name: "Location & Hours", href: "/#location" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      <div className="h-20 w-full px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        {/* Left: Emblem & Location Badge */}
        <div className="flex items-center gap-4 lg:gap-6">
          <DastarkhwanLogo size="sm" />

          {/* Single Branch Capsule */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full border border-outline-variant/40 text-xs text-on-surface-variant">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-on-surface-variant font-medium">DHA Phase 8, Karachi</span>
            <span className="text-outline-variant">•</span>
            <span className="text-primary font-medium">Dine-in & Delivery</span>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm tracking-wide transition-colors py-2 relative font-sans",
                  isActive
                    ? "text-primary font-semibold after:content-[''] after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-primary shadow-[0_2px_10px_rgba(242,202,80,0.3)]"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Table Reservation Button */}
          <Link
            href="/book-table"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-primary/40 bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold tracking-wide transition-all shadow-sm hover:border-primary"
          >
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Reserve Table</span>
          </Link>

          {/* Cart Trigger */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-on-surface transition-all hover:border-primary/40"
          >
            <ShoppingBag className="w-4 h-4 text-primary" />
            {displayCount > 0 ? (
              <>
                <span className="hidden md:inline text-xs font-medium text-on-surface">
                  {displayCount} {displayCount === 1 ? "item" : "items"} • Rs. {displayTotal.toLocaleString()}
                </span>
                <span className="md:hidden flex items-center justify-center w-4 h-4 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                  {displayCount}
                </span>
              </>
            ) : (
              <span className="hidden md:inline text-xs text-on-surface-variant font-medium">Cart</span>
            )}
          </Link>

          {/* Customer Account / Auth Trigger */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-primary/30 text-xs text-on-surface transition-all hover:border-primary cursor-pointer"
                aria-label="Account Menu"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-serif text-[11px] font-bold">
                  {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden md:inline font-medium max-w-[110px] truncate text-on-surface">
                  {displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-primary" />
              </button>

              {/* Account Dropdown */}
              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-high border border-primary/30 rounded-xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-outline-variant/20">
                    <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">
                      Imperial Patron
                    </p>
                    <p className="text-xs font-bold text-on-surface truncate">{displayName}</p>
                    {user?.email && (
                      <p className="text-[11px] text-on-surface-variant/80 truncate font-mono">
                        {user.email}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/menu"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-on-surface hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                    <span>Order Banquet</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-error hover:bg-error/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 hover:border-primary/40 text-xs font-semibold text-primary transition-all shadow-sm"
              aria-label="Customer Sign In"
            >
              <User className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Customer Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest/98 border-b border-outline-variant/30 px-6 py-6 space-y-5 animate-in slide-in-from-top duration-300">
          {/* User Status Bar in Mobile Menu */}
          {user ? (
            <div className="p-3 bg-surface-container rounded-lg border border-primary/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-serif text-xs font-bold shrink-0">
                  {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">{displayName}</p>
                  <p className="text-[10px] text-primary uppercase tracking-wider">
                    Imperial Patron
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-error font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-surface-container border border-primary/30 text-center text-xs font-semibold text-primary"
              >
                Customer Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg btn-imperial text-center text-xs font-semibold"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Single Branch Banner */}
          <div className="p-3 bg-surface-container rounded-lg border border-primary/20 flex items-center gap-2.5 text-xs text-on-surface-variant">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-on-surface">DHA Phase 8, Karachi</p>
              <p className="text-[11px] text-on-surface-variant">Daily 12:30 PM – 1:30 AM</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-on-surface hover:text-primary py-1 transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-xs text-primary/60">→</span>
              </Link>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <Link
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 btn-imperial rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Online Now</span>
            </Link>
            <Link
              href="/book-table"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 btn-ghost-gold rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Table at DHA Phase 8</span>
            </Link>
          </div>

          {/* Hotline */}
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" /> +92 21 3584 9200
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" /> Kitchen Active
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
