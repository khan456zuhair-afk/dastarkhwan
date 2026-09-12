"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  cartItemCount?: number;
  cartTotal?: number;
}

export function Navbar({ cartItemCount = 0, cartTotal = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            {cartItemCount > 0 ? (
              <>
                <span className="hidden md:inline text-xs font-medium text-on-surface">
                  {cartItemCount} {cartItemCount === 1 ? "item" : "items"} • Rs. {cartTotal.toLocaleString()}
                </span>
                <span className="md:hidden flex items-center justify-center w-4 h-4 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                  {cartItemCount}
                </span>
              </>
            ) : (
              <span className="hidden md:inline text-xs text-on-surface-variant font-medium">Cart</span>
            )}
          </Link>

          {/* Account / Admin Link */}
          <Link
            href="/account"
            aria-label="Account"
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary transition-colors"
          >
            <User className="w-4 h-4" />
          </Link>

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

