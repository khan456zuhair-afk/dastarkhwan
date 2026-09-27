"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DastarkhwanLogo } from "@/components/brand/DastarkhwanLogo";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Please enter your contact phone number.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Sign up customer with metadata. The schema trigger `on_auth_user_created`
      // automatically inserts a corresponding row into `public.profiles` with role 'customer'.
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        setErrorMessage(error.message || "Failed to create account. Please verify your details.");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setIsSuccess(true);
        if (data.session) {
          setSuccessMessage("Welcome to the Royal Dastarkhwan! Redirecting to your destination...");
          setTimeout(() => {
            router.push(next);
            router.refresh();
          }, 1500);
        } else {
          // If Supabase project requires email confirmation
          setSuccessMessage(
            "Your imperial account has been registered. Please check your inbox for the confirmation link to complete activation."
          );
        }
      }
    } catch (err: any) {
      console.error("Unexpected signup error:", err);
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <DastarkhwanLogo size="lg" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full border border-primary/20 text-xs text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold uppercase tracking-widest text-[10px]">
            Privilege Membership
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
          Create Your <span className="italic text-primary">Account</span>
        </h1>
        <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
          Join our dining circle to save delivery addresses, view order history, and access royal
          banquet privileges.
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 bg-surface-container rounded-2xl border border-primary/20 shadow-2xl space-y-6">
        {errorMessage && (
          <div className="p-3.5 bg-error/10 border border-error/30 rounded-lg flex items-start gap-3 text-xs text-error">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="p-6 bg-surface-container-high rounded-xl border border-primary/30 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
              <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-on-surface">
                Account Created Successfully
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {successMessage}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 btn-imperial rounded-lg text-xs font-semibold"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">
                Full Name <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tariq Khan"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">
                Email Address <span className="text-primary">*</span>
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

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">
                Phone Number <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">
                Password <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
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
              className="w-full py-3 btn-imperial rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating Your Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Existing Account Footer */}
        <div className="pt-3 border-t border-outline-variant/20 text-center space-y-2">
          <p className="text-xs text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-tertiary font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guest checkout remains available without registration</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
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
            Loading Membership Portal...
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}

