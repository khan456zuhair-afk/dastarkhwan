"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DishCard } from "@/components/menu/DishCard";
import { CATEGORIES, MENU_ITEMS } from "@/lib/data/mock-menu";
import { useCart } from "@/lib/context/cart-context";
import {
  Utensils,
  Calendar,
  Clock,
  Sparkles,
  Flame,
  ShieldCheck,
  Star,
  Phone,
  MapPin,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const { totalItems, total } = useCart();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");

  const featuredDishes =
    selectedCategoryTab === "all"
      ? MENU_ITEMS.slice(0, 4)
      : selectedCategoryTab === "mutton"
      ? MENU_ITEMS.filter((i) => i.id === "item-1" || i.id === "item-3" || i.id === "item-5")
      : selectedCategoryTab === "murgh"
      ? MENU_ITEMS.filter((i) => i.id === "item-2")
      : MENU_ITEMS.filter((i) => i.id === "item-3");

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary selection:text-on-primary">
      <Navbar cartItemCount={totalItems} cartTotal={total} />

      <main className="flex-1 pt-20">
        {/* Top Ambient Glow Aura */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

          {/* ================= 1. HERO SECTION ================= */}
          <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 lg:pt-14 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Headline & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                {/* Regality Overline */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface-container-high rounded-full border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-sans text-[11px] font-bold tracking-widest text-primary uppercase">
                    ESTD. 1982 • DHA PHASE 8, KARACHI • PAKISTAN
                  </span>
                </div>

                {/* Main Hero Headline */}
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-on-surface tracking-tight leading-[1.15]">
                  A Taste of{" "}
                  <span className="italic text-primary">Imperial Tradition,</span>{" "}
                  Crafted for the Connoisseur
                </h1>

                {/* Body Copy */}
                <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Slow-cooked Dum Pukht biryanis, hand-hammered wok karahis, and
                  charcoal-kissed seekh kebabs prepared with heirloom spices, pure desi
                  ghee, and royal saffron.
                </p>

                {/* Dual CTAs - PRIMARY: Order Online, SECONDARY: Book a Table */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 btn-imperial rounded-lg text-sm font-semibold tracking-wide"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Order Online for Imperial Delivery</span>
                  </Link>

                  <Link
                    href="/book-table"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 btn-ghost-gold rounded-lg text-sm font-semibold tracking-wide"
                  >
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Reserve a Table</span>
                  </Link>
                </div>

                {/* Kitchen Active Live Capsule */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-md border border-outline-variant/30">
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                    <span className="text-on-surface font-semibold">Kitchen Active Now</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>
                      Express Dispatch:{" "}
                      <strong className="text-on-surface">35–45 mins</strong> (DHA Phase 8 &
                      Clifton, Karachi)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Panel */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-surface-container-low border border-primary/20 group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdI9aq93eam9PkBJ5fzLXxh4URXCYDXgVoS_NCMnUpXaWR89qs-lwB6uGBx1GRiMCBXxu9e3ocoAdINsCTcERNphun_Gu9P15JCkX3lWsmxN_61fR5JRCg5acdbZGqzSbHoPKWJIslKlah5qo-Q8iKBove-7ylg9k6en0pzpuQfjftOaoGzn_8S8_gsxipxmYsF411ssShoBvnJ-gOAW0h4FvXith7lfbBBZFLonPJcH3AfqQUGwnO"
                    alt="Royal feast spread of Pakistani cuisine featuring Dum Pukht biryani, karahi and kebabs"
                    className="w-full h-[400px] sm:h-[480px] lg:h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Atmospheric Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />

                  {/* Floating Gastronomy Micro-Card */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 bg-surface-container/90 backdrop-blur-md rounded-xl border border-primary/20 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                        <Flame className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base sm:text-lg font-bold text-on-surface">
                            Shahi Dastarkhwan Platter
                          </span>
                          <span className="hidden sm:inline-block bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Chef Reserve
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant">
                          Saffron Basmati, Seekh Kebabs & Desi Ghee Karahi
                        </p>
                      </div>
                    </div>
                    <div className="text-right pl-3 shrink-0">
                      <span className="font-serif text-lg sm:text-xl font-bold text-primary">
                        Rs. 4,850
                      </span>
                      <p className="text-[11px] text-tertiary font-medium">Feeds 3–4 Guests</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges Strip */}
            <div className="mt-14 pt-8 border-t border-outline-variant/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface">100% Halal Certified</h4>
                    <p className="text-[11px] text-on-surface-variant">Ethically sourced prime cuts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                  <Flame className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface">Heirloom Woodfire</h4>
                    <p className="text-[11px] text-on-surface-variant">Acacia & Coal Tandoor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                  <Sparkles className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface">Royal Bawarchi Legacy</h4>
                    <p className="text-[11px] text-on-surface-variant">Generational ustaad chefs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                  <Star className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface">Pure Desi Ghee & Saffron</h4>
                    <p className="text-[11px] text-on-surface-variant">Zero compromise on purity</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ================= 2. CULINARY CATEGORIES ================= */}
        <section className="w-full bg-surface-container-low py-16 px-4 sm:px-6 lg:px-12 border-y border-outline-variant/20" id="categories">
          <div className="max-w-[1440px] mx-auto space-y-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-sans">
                  The Imperial Courses
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-on-surface font-medium">
                  Imperial Culinary Courses
                </h2>
                <p className="text-sm text-on-surface-variant max-w-xl">
                  Each course is prepared using historical methods dating back to the grand kitchens
                  of the Mughal emperors.
                </p>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>View Complete Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Categories Rail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/menu?cat=${cat.slug}`}
                  className="group relative rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30 hover:border-primary/50 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="h-36 w-full overflow-hidden bg-surface-container-lowest">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      {cat.badge && (
                        <span className="text-[10px] font-bold tracking-wider text-primary uppercase">
                          {cat.badge}
                        </span>
                      )}
                      <h3 className="font-serif text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                        {cat.description}
                      </p>
                    </div>
                    <div className="pt-2 flex items-center gap-1 text-[11px] text-primary font-semibold">
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 3. FEATURED MASTERPIECES ================= */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-12" id="masterpieces">
          <div className="max-w-[1440px] mx-auto space-y-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-sans">
                  Crafted Daily
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-on-surface font-medium">
                  The Ustaad&apos;s Masterpieces
                </h2>
                <p className="text-sm text-on-surface-variant max-w-xl">
                  Signature preparations cooked daily in limited small-batch deghs to maintain the
                  sanctity of flavor.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-surface-container p-1 rounded-lg border border-outline-variant/30">
                <button
                  onClick={() => setSelectedCategoryTab("all")}
                  className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategoryTab === "all"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  All Signature Dishes
                </button>
                <button
                  onClick={() => setSelectedCategoryTab("mutton")}
                  className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategoryTab === "mutton"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Mutton & Lamb
                </button>
                <button
                  onClick={() => setSelectedCategoryTab("murgh")}
                  className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategoryTab === "murgh"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Desi Murgh
                </button>
                <button
                  onClick={() => setSelectedCategoryTab("grill")}
                  className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategoryTab === "grill"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Charcoal Grill
                </button>
              </div>
            </div>

            {/* Masterpiece Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDishes.map((item) => (
                <DishCard key={item.id} item={item} />
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-3.5 btn-ghost-gold rounded-lg text-sm font-semibold tracking-wide"
              >
                <Utensils className="w-4 h-4 text-primary" />
                <span>Explore Full Imperial Menu</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= 4. THE DASTARKHWAN HERITAGE & STORY ================= */}
        <section className="w-full bg-surface-container-lowest py-20 px-4 sm:px-6 lg:px-12 border-y border-outline-variant/20 relative" id="heritage">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Mosaic Column */}
            <div className="lg:col-span-6 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden shadow-lg h-60 border border-primary/20">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Wapq181N-6WqMbztyzpVMugn7YX4iLZwyzbGy2w3-GD06lXn7j5JssEmnRJO2tQeLZVSdaKEqjLHzqoqxFiokSe1tYOv6Jtld18tgNKxlotZ4-619vzvbOMuozgd2bemVhEZ3lsyVB1zYqoucqoCCLLjnhQz6e6cmETPkZ-Ym0iU3vzcwypFIq1QBeBuA4LfT2e5Lh8PLDIk76FLem0-aac9VJ_pv3xAKkIvQ26hmUzx-gf5dX3c"
                      alt="Ustaad bawarchi delicately stirring firewood degh"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase">
                      Ancestral Secret
                    </span>
                    <h4 className="font-serif text-base font-semibold text-on-surface">
                      32 Hand-Ground Spices
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Whole star anise, green cardamom, and wild saffron pounded in stone mortars.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase">
                      The Dastarkhwan Rite
                    </span>
                    <h4 className="font-serif text-base font-semibold text-on-surface">
                      Imperial Kinship
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      The ceremonial banquet where travelers and nobility shared food as equals.
                    </p>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg h-60 border border-primary/20">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpPCugYiqNlakVcqPZpIt4VqL9T7zP1OAYl9hKpIUIbFxvncXysacZ7y0daqMVXXFT6WK-lTbWBoJRMWWNl9tUVNWlL1MkluxUhT4FR3b78Aw_PWYqJrHdY9bqzRjlTDsgkDlYPm1CgHknt-9K6QYso9BMQFwWfbDEnmpsKmNNbbg7m4kOOG3_Gul45M38SRPJ3uTEj2MRaa7lL83L_MC1i9EJLEgzJg6QSKAWJvmUJqMRhjiH81lS"
                      alt="Opulent haveli dining room with traditional velvet cushions and warm chandeliers"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-sans">
                Our Royal Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-on-surface font-medium leading-tight">
                From the Walled City of Lahore to the Caravans of the Grand Trunk Road
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed">
                In historical Mughal dining, the <em>Dastarkhwan</em> was not merely a banquet
                cloth; it was an imperial sanctuary of kinship and generosity. Every feast was an
                orchestration of sensory devotion: slow heat, earthen cookware, and unhurried
                conversation.
              </p>
              <p className="text-sm text-on-surface-variant/90 leading-relaxed">
                Founded four decades ago by Master Chef Ustaad Karim Buksh, we carry forward this
                royal legacy without shortcuts. Our gravies are simmered through the night, our cuts
                are aged in salt brine and mustard essence, and every single naan is slapped into clay
                walls heated strictly with babool wood charcoal.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3.5 bg-surface-container rounded-lg border border-outline-variant/30">
                  <span className="font-serif text-2xl sm:text-3xl text-primary font-bold">
                    42+
                  </span>
                  <p className="text-[11px] text-on-surface-variant uppercase font-semibold mt-0.5">
                    Years of Craft
                  </p>
                </div>
                <div className="p-3.5 bg-surface-container rounded-lg border border-outline-variant/30">
                  <span className="font-serif text-2xl sm:text-3xl text-primary font-bold">
                    32
                  </span>
                  <p className="text-[11px] text-on-surface-variant uppercase font-semibold mt-0.5">
                    Secret Spices
                  </p>
                </div>
                <div className="p-3.5 bg-surface-container rounded-lg border border-outline-variant/30">
                  <span className="font-serif text-2xl sm:text-3xl text-primary font-bold">
                    180K
                  </span>
                  <p className="text-[11px] text-on-surface-variant uppercase font-semibold mt-0.5">
                    Feasts Hosted
                  </p>
                </div>
                <div className="p-3.5 bg-surface-container rounded-lg border border-outline-variant/30">
                  <span className="font-serif text-2xl sm:text-3xl text-primary font-bold">
                    4.9
                  </span>
                  <p className="text-[11px] text-on-surface-variant uppercase font-semibold mt-0.5">
                    Diner Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. BANQUET & TABLE RESERVATION EXPERIENCE ================= */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-12" id="reservation">
          <div className="max-w-[1440px] mx-auto bg-surface-container rounded-2xl overflow-hidden shadow-2xl border border-primary/20 grid grid-cols-1 lg:grid-cols-12">
            {/* Left Form Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full border border-primary/20 text-xs text-primary font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Dine-In Reservations at DHA Phase 8, Karachi</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
                  Reserve an Imperial Table
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Whether hosting family celebrations, diplomatic luncheons, or corporate banquets,
                  our exclusive Karachi majlis rooms provide unparalleled royal hospitality.
                </p>
              </div>

              {/* Teaser Booking Direct Link Form */}
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs space-y-2">
                  <div className="flex items-center justify-between text-on-surface font-semibold">
                    <span>Flagship Dining Estate</span>
                    <span className="text-primary">DHA Phase 8, Karachi</span>
                  </div>
                  <p className="text-on-surface-variant">
                    Exclusive indoor air-conditioned Majlis, Family Diwan, and Sea Breeze Courtyard
                    seating available.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/book-table"
                    className="px-7 py-3.5 btn-imperial rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Open Table Booking Engine</span>
                  </Link>

                  <a
                    href="tel:+922135849200"
                    className="px-5 py-3.5 btn-ghost-gold rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <span>Call Concierge: +92 21 3584 9200</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Atmosphere Image */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2S44HQWGTQoLHZAJsDekS1rkj4_4qIZGb5ptDXQZLw3wtKOI_GRvs-iIxA1lfKFDfYYsmAFGrZdURMsuaxhZnx4fN0SnnBogYU4tnxLBjuTDFAO7N7CTSO5HvpNJD2dMUvoNDO8U6dHjwOvFAS9onpSx5Hw8dh23JvmDHOHvxm3PwIFkMcJkLApuqBEgLldSPqzx4y-zKKCrYbYSH1rBhALFkA00bhRhKyjE7Wsq42EiHeOsBArni"
                alt="Imperial dining table set with silver tableware and brass candelabras"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent lg:bg-gradient-to-r lg:from-surface-container lg:to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-on-surface space-y-1">
                <p className="font-serif text-lg text-primary font-semibold">
                  Catering & Wedding Deghs
                </p>
                <p className="text-xs text-on-surface-variant">
                  We dispatch master chefs with woodfire deghs to cater royal weddings across
                  Pakistan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. TESTIMONIALS ================= */}
        <section className="w-full bg-surface-container-low py-16 px-4 sm:px-6 lg:px-12 border-y border-outline-variant/20">
          <div className="max-w-[1440px] mx-auto space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-sans">
                Guest Impressions
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-on-surface font-medium">
                Honored by Discerning Palates
              </h2>
              <p className="text-sm text-on-surface-variant">
                The culinary critics, cultural icons, and loyal families who make Dastarkhwan their
                second home.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="p-6 bg-surface-container rounded-xl border border-outline-variant/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center text-primary gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface italic leading-relaxed">
                    “The Dum Pukht Mutton Biryani is unrivaled anywhere between Delhi and Lahore. The
                    fragrance of asli ghee and pure saffron hit you the moment the dough seal is cut
                    open. Simply peerless.”
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-serif font-bold">
                    Z
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Zainab Jahangir</p>
                    <p className="text-xs text-on-surface-variant">Culinary Historian • Critic</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="p-6 bg-surface-container rounded-xl border border-outline-variant/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center text-primary gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface italic leading-relaxed">
                    “Hosting diplomatic delegations at their DHA Phase 8 Haveli is always our safest
                    bet. The Shinwari Karahi tossed before guests and the bone-marrow Nihari always
                    leave international dignitaries mesmerized.”
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-serif font-bold">
                    F
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Farooq Hashmi</p>
                    <p className="text-xs text-on-surface-variant">Ambassadorial Protocol Officer</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="p-6 bg-surface-container rounded-xl border border-outline-variant/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center text-primary gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface italic leading-relaxed">
                    “Delivery arrived in custom insulated degh packaging! The seekh kebabs were
                    sizzling hot and smoky, and the roghani naans retained their crisp sesame crust.
                    Outstanding hospitality.”
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-serif font-bold">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Asadullah Sheikh</p>
                    <p className="text-xs text-on-surface-variant">DHA Phase 8 Resident</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 7. FLAGSHIP LOCATION & HOURS ================= */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-12" id="location">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Info Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-sans">
                  Flagship Estate
                </span>
                <h2 className="font-serif text-3xl text-on-surface font-medium">
                  Grand Dining Location
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Immerse your senses in hand-carved jharokas, live woodfire kitchens, and live
                  classical melodies every evening.
                </p>
              </div>

              <div className="p-6 bg-surface-container rounded-xl border border-primary/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg text-primary font-semibold">
                    Karachi Flagship Haven
                  </span>
                  <span className="px-2 py-0.5 bg-tertiary/15 text-tertiary text-[10px] font-bold rounded uppercase">
                    Single Location
                  </span>
                </div>
                <p className="text-sm text-on-surface flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  Plot 14-C, Creek Avenue, Phase 8, DHA, Karachi, Pakistan
                </p>
                <div className="space-y-1.5 text-xs text-on-surface-variant border-t border-outline-variant/20 pt-3">
                  <p>
                    <strong className="text-on-surface">Lunch & Imperial Degh:</strong> 12:30 PM –
                    4:00 PM
                  </p>
                  <p>
                    <strong className="text-on-surface">Royal Dinner Banquet:</strong> 7:00 PM –
                    1:30 AM Daily
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                  <a
                    href="tel:+922135849200"
                    className="text-primary font-semibold flex items-center gap-1.5 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> +92 21 3584 9200
                  </a>
                  <span className="text-on-surface-variant">• Valet Parking</span>
                  <span className="text-on-surface-variant">• Sea Breeze Majlis</span>
                </div>
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden shadow-lg h-52 border border-outline-variant/30">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA74W8uGN4fBmq3ose7eKrUfq2_4TSTmCSfHtJJld8B_8ZNM6Tq8n5z5jY030bTkrQiPLSgaomskbpfTpsoMBRQpd_jvQaL9jLC0k74Ei5fBCRCmfJVr8JZbOlKULKYMLxi1nvSnfzA7B28XA3BpGtqpnvqzLZgG98XkExEWLYX0zVeDAnWRq54xRPwdCIdHr4jdtp1mPjsODiR2GNASRcGK5t_bDHvIMFa7d9awPj8SvXrBiLbYQ8-"
                    alt="Master chef tossing fresh Lahori Karahi in iron wok"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg h-64 border border-outline-variant/30">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJlC28-lPoSvJVL55T92n16ayT-l9ENgMe-JoeUulcrdz2xnH9VRz15cLsSmmxLIDrevnJ7GiNFeMJoQEFjFNzH8p6i7EyDqvSwQyqXQH-r72PG_GKnZTX_IUZXj_g4qWpUbXt-wSA9zvIzfkudRjsNwhuv4CQQJX_8lu27X3D7MtiJiwYvIBjyrfsXzSHpCZv7C0YamPsx3Zk5yOaBPEvGGjCfo4Ow7h-Ws9Cr4D2CoGL0eJ5YAhM"
                    alt="Luxurious dining room with chandeliers"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <div className="rounded-xl overflow-hidden shadow-lg h-64 border border-outline-variant/30">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWL3gI4gjnzB3_UJ6ZvQkeshcqYOMJ6RbqFA59qvlhMKDHeWEFHp15xRDNutNMJWPsMZGh4IMNV1a5AjWvDpCcyEkF9Qs3_72uImCssWgSdmRBG-SfvDEno85aXHqUPMlqRhc-pA5-vAo9kOarnG6l7zCUk05LOJnzDFO1CvanGM90xpMEvRJ5NbDCe5fLo1pNgdzFlC4MsgvDcFWQtyOtMpoQKZUbKgfnsXR7S4xGrYJW0kGOblhU"
                    alt="Fresh hot Roghani naan from tandoor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg h-52 border border-outline-variant/30">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBTs8Xz-dBwNIVFsgMkiwt03LKraj9UsB1RQYkjLcei36eAiIsKiN5h_Prv6KqMgEoY43RRF-ZIS4tFrRTI3Uz3RLRNL90m21QusSm2LXydi0dt_IRsR7LwMXeforrmXBaoOWcyyEb1meukgqEUBMY2r_7dGe5Zkl7q1rGZjwbGf534JZJtyrYxHSD5JH-WFsY8701XoLbV1mO1Z6gX5qp0v0zhxvf796_v27NSOLTuZmSUlL6lU9_"
                    alt="Shahi desserts in terracotta pots"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

