import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DBCategory, DBMenuItem } from "@/lib/types/database.types";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DishCard } from "@/components/menu/DishCard";
import {
  Utensils,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Imperial Menu | Dastarkhwan — DHA Phase 8, Karachi",
  description:
    "Explore the imperial menu of Dastarkhwan. Slow-cooked Dum Pukht biryani, hand-hammered Shinwari karahi, charcoal kebabs, and Mughlai desserts in DHA Phase 8, Karachi.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const supabase = await createClient();

  // Fetch active categories and available menu items concurrently
  let categories: DBCategory[] = [];
  let menuItems: DBMenuItem[] = [];
  let fetchError: string | null = null;

  try {
    const [categoriesResult, menuItemsResult] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: true }),
    ]);

    if (categoriesResult.error) {
      console.error("Error fetching categories:", categoriesResult.error);
      fetchError = categoriesResult.error.message;
    } else if (categoriesResult.data) {
      categories = categoriesResult.data;
    }

    if (menuItemsResult.error) {
      console.error("Error fetching menu items:", menuItemsResult.error);
      fetchError = menuItemsResult.error.message;
    } else if (menuItemsResult.data) {
      menuItems = menuItemsResult.data;
    }
  } catch (err) {
    console.error("Unexpected error fetching menu:", err);
    fetchError = err instanceof Error ? err.message : "Database connection failure";
  }

  // Group menu items by category
  const itemsByCategoryId = new Map<string, DBMenuItem[]>();
  for (const item of menuItems) {
    const existing = itemsByCategoryId.get(item.category_id) || [];
    existing.push(item);
    itemsByCategoryId.set(item.category_id, existing);
  }

  // Filter categories that have available items
  const categoriesWithItems = categories.filter((cat) => {
    const items = itemsByCategoryId.get(cat.id);
    return items && items.length > 0;
  });

  const hasData = categoriesWithItems.length > 0 && menuItems.length > 0;

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary selection:text-on-primary">
      <Navbar />

      <main className="flex-1 pt-24 pb-24">
        {/* Top Ambient Glow */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

          {/* ================= HERO BANNER ================= */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface-container-high rounded-full border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-sans text-[11px] font-bold tracking-widest text-primary uppercase">
                  ROYAL DASTARKHWAN • DHA PHASE 8, KARACHI
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-on-surface tracking-tight leading-tight">
                The Imperial <span className="italic text-primary">Menu</span>
              </h1>

              <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Every creation is slow-cooked in traditional earthen deghs, cold-pressed mustard oil,
                or seared over fragrant acacia coal, honoring centuries-old Mughal culinary traditions.
              </p>

              {/* Badges / Information */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs text-on-surface-variant">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-md border border-outline-variant/30">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="text-on-surface">Plot 14-C, Creek Ave, Phase 8, DHA</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-md border border-outline-variant/30">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-on-surface">12:00 PM – 1:30 AM</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-md border border-outline-variant/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
                  <span className="text-tertiary font-medium">100% Halal Certified</span>
                </div>
              </div>
            </div>

            {/* Category Quick-Jump Navigation (When data is present) */}
            {hasData && (
              <div className="mt-10 pt-6 border-t border-outline-variant/20">
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  {categoriesWithItems.map((category) => (
                    <a
                      key={category.id}
                      href={`#${category.slug}`}
                      className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 hover:border-primary/50 text-xs font-medium text-on-surface hover:text-primary transition-all duration-200"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ================= MENU CONTENT OR EMPTY STATE ================= */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            {!hasData ? (
              /* Empty / RLS Misconfiguration / Error State */
              <div className="my-12 max-w-xl mx-auto p-8 sm:p-12 bg-surface-container-low rounded-2xl border border-primary/20 text-center shadow-2xl space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
                    Imperial Menu Under Preparation
                  </h2>
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                    Our master chefs are curating today&apos;s selections. No active dishes are currently
                    available to display.
                  </p>
                  {fetchError && (
                    <p className="text-xs text-error font-mono bg-error/10 p-3 rounded-lg border border-error/20">
                      System note: {fetchError}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/"
                    className="w-full sm:w-auto px-6 py-3 btn-imperial rounded-lg text-xs font-semibold"
                  >
                    Return to Grand Hall
                  </Link>
                  <Link
                    href="/book-table"
                    className="w-full sm:w-auto px-6 py-3 btn-ghost-gold rounded-lg text-xs font-semibold"
                  >
                    Reserve Imperial Table
                  </Link>
                </div>
              </div>
            ) : (
              /* Grouped Menu Categories and Dishes */
              <div className="space-y-16 sm:space-y-20">
                {categoriesWithItems.map((category) => {
                  const items = itemsByCategoryId.get(category.id) || [];

                  return (
                    <section
                      key={category.id}
                      id={category.slug}
                      className="scroll-mt-28 space-y-6"
                    >
                      {/* Category Header */}
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-primary/20">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                              {category.name}
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high border border-primary/20 text-[11px] font-sans font-semibold text-primary">
                              {items.length} {items.length === 1 ? "Dish" : "Dishes"}
                            </span>
                          </div>
                          {category.description && (
                            <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                              {category.description}
                            </p>
                          )}
                        </div>

                        <span className="text-[11px] font-sans text-primary/80 uppercase tracking-widest hidden sm:inline-block">
                          Imperial Course
                        </span>
                      </div>

                      {/* Dish Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {items.map((item) => {
                          const mappedItem = {
                            id: item.id,
                            name: item.name,
                            slug: item.slug,
                            categoryId: item.category_id,
                            categoryName: category.name,
                            description: item.description,
                            price: item.price,
                            imageUrl: item.image_url,
                            originBadge: item.origin_badge || undefined,
                            portionInfo: item.portion_info || undefined,
                            spiceLevel: item.spice_level ?? 1,
                            rating: Number(item.rating) || 5.0,
                            reviewCount: item.review_count ?? 0,
                            dietaryTags: item.dietary_tags || [],
                            isFeatured: item.is_featured ?? false,
                            isAvailable: item.is_available ?? true,
                            preparationTimeMinutes: item.preparation_time_minutes ?? 25,
                          };

                          return <DishCard key={item.id} item={mappedItem} />;
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

