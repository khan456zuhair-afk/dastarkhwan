"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DastarkhwanLogo } from "@/components/brand/DastarkhwanLogo";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  User,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  // Ensure safe customer redirect: defaults to /menu, strictly rejects /admin redirects
  const next =
    rawNext &&
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    !rawNext.startsWith("/admin")
      ? rawNext
      : "/menu";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setErrorMessage(
          error.message || "Invalid email or password. Please verify your credentials."
        );
        setIsLoading(false);
        return;
      }

      // Successful customer login: redirect to /menu or requested destination
      router.push(next);
      router.refresh();
    } catch (err: any) {
      console.error("Unexpected login error:", err);
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
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
          <User className="w-3.5 h-3.5" />
          <span className="font-semibold uppercase tracking-widest text-[10px]">
            Customer Dining Portal
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
          Customer <span className="italic text-primary">Sign In</span>
        </h1>
        <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
          Sign in to your customer dining account to track active banquet orders, view delivery history, and reserve tables.
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 bg-surface-container rounded-2xl border border-primary/20 shadow-2xl space-y-6">
        {errorMessage && (
          <div className="p-3.5 bg-error/10 border border-error/30 rounded-lg flex items-start gap-3 text-xs text-error animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-on-surface-variant">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. tariq@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-on-surface-variant">
                Password
              </label>
              <span className="text-[11px] text-primary/80">
                Secured via Supabase Auth
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
              <span>Signing In to Dining Circle...</span>
            ) : (
              <>
                <span>Sign In as Customer</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Signup Link & Guest Assurance */}
        <div className="pt-3 border-t border-outline-variant/20 text-center space-y-2">
          <p className="text-xs text-on-surface-variant">
            Don&apos;t have an account yet?{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(next)}`}
              className="text-primary font-semibold hover:underline"
            >
              Create Customer Account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-tertiary font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guest ordering is fully supported without login</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden selection:bg-primary selection:text-on-primary">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Back to website button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors py-2 px-3 rounded-lg bg-surface-container border border-outline-variant/30"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Grand Hall</span>
      </Link>

      <Suspense
        fallback={
          <div className="p-8 text-center text-sm text-on-surface-variant">
            Loading Customer Portal...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
