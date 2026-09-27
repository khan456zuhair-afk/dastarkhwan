"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DastarkhwanLogo } from "@/components/brand/DastarkhwanLogo";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowLeft, ShieldCheck } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(urlError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();

      // Attempt authentication with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Enforce generic message to prevent username enumeration
        setErrorMessage("Invalid credentials. Please verify your administrative email and password.");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Verify role strictly in public.profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile && (profile.role === "admin" || profile.role === "staff")) {
          // Authorized administrator
          router.push(next);
          router.refresh();
        } else {
          // Immediately revoke session for non-admin accounts
          await supabase.auth.signOut();
          setErrorMessage(
            "Access Denied: This portal is strictly restricted to administrators. Diners and customers must use the Customer Sign In."
          );
          setIsLoading(false);
        }
      }
    } catch {
      setErrorMessage("An unexpected error occurred during administrative verification. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 select-none">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <DastarkhwanLogo size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full border border-primary/20 text-xs text-primary shadow-sm">
          <Lock className="w-3.5 h-3.5" />
          <span className="font-semibold uppercase tracking-widest text-[10px]">
            Administrator Gateway
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
          Staff & Management Portal
        </h1>
        <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
          Authorized personnel only. Direct console access for live kitchen orders, table reservations, and culinary inventory.
        </p>
      </div>

      {/* Login Form Container */}
      <div className="p-6 sm:p-8 bg-surface-container rounded-2xl border border-primary/20 shadow-2xl space-y-6">
        {errorMessage && (
          <div className="p-3.5 bg-error-container/40 border border-error/40 rounded-lg flex items-start gap-3 text-xs text-error animate-in fade-in duration-200">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-on-surface-variant">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin.name@dastarkhwan.internal"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-xs"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-on-surface-variant">
                Password
              </label>
              <span className="text-[11px] text-primary/80 font-mono">RBAC Enforced</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 btn-imperial rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying Administrative Role...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Sign In to Admin Console</span>
              </>
            )}
          </button>
        </form>

        {/* Separation Link to Customer Login */}
        <div className="pt-3 border-t border-outline-variant/20 text-center space-y-2">
          <p className="text-xs text-on-surface-variant">
            Are you a dining guest?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Customer Sign In</span>
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-tertiary font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Strict Role-Based Access Control (RBAC)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden selection:bg-primary selection:text-on-primary">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Back to website button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors py-2 px-3 rounded-lg bg-surface-container border border-outline-variant/30"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Guest Website</span>
      </Link>

      <Suspense
        fallback={
          <div className="p-8 text-center text-sm text-on-surface-variant">
            Loading Admin Security Terminal...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
