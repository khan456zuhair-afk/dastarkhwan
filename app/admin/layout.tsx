"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DastarkhwanLogo } from "@/components/brand/DastarkhwanLogo";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  CreditCard,
  Utensils,
  FolderTree,
  TrendingUp,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on admin login page, render children without admin sidebar shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Live Orders Pipeline", href: "/admin/orders", icon: ShoppingBag },
    { name: "Table Reservations", href: "/admin/reservations", icon: Calendar },
    { name: "POS / Dine-In Terminal", href: "/admin/pos", icon: CreditCard },
    { name: "Menu Items & Stock", href: "/admin/menu", icon: Utensils },
    { name: "Culinary Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Sales Tracker (Separate)", href: "/admin/sales", icon: TrendingUp },
    { name: "Restaurant Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row text-on-surface">
      {/* Mobile Admin Top Bar */}
      <div className="lg:hidden h-16 bg-surface-container-lowest border-b border-outline-variant/30 px-4 flex items-center justify-between z-40 sticky top-0">
        <DastarkhwanLogo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-surface-container text-primary"
            aria-label="Toggle navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar Shell */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-surface-container-lowest border-r border-primary/20 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:shrink-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-outline-variant/20 space-y-4">
          <DastarkhwanLogo size="md" />
          <div className="p-2.5 bg-surface-container rounded-lg border border-primary/20 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-on-surface">Admin Haven</p>
              <p className="text-[11px] text-on-surface-variant">DHA Phase 8, Karachi</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group",
                  isActive
                    ? "bg-primary text-on-primary font-semibold shadow-md"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-on-primary" : "text-primary group-hover:text-primary"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-outline-variant/20 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
              <span>View Live Guest Site</span>
            </span>
            <span className="text-[10px] text-outline">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-error hover:bg-error-container/20 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out from Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 overflow-y-auto min-h-screen bg-surface p-4 sm:p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}

