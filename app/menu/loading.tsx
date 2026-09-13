import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary selection:text-on-primary">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Header Skeleton */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="h-4 w-48 bg-surface-container-high rounded-full mx-auto animate-pulse" />
            <div className="h-10 w-80 bg-surface-container-high rounded-lg mx-auto animate-pulse" />
            <div className="h-4 w-96 max-w-full bg-surface-container-high rounded mx-auto animate-pulse" />
          </div>

          {/* Category Tabs Skeleton */}
          <div className="flex justify-center gap-3 mt-10 overflow-x-auto py-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-9 w-32 bg-surface-container rounded-full animate-pulse shrink-0 border border-outline-variant/20"
              />
            ))}
          </div>
        </div>

        {/* Menu Cards Grid Skeleton */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
          {[1, 2].map((section) => (
            <div key={section} className="space-y-6">
              <div className="space-y-2">
                <div className="h-7 w-56 bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-96 max-w-full bg-surface-container rounded animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3].map((card) => (
                  <div
                    key={card}
                    className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/20 shadow-xl space-y-4 p-4 animate-pulse"
                  >
                    <div className="h-52 w-full bg-surface-container-high rounded-lg" />
                    <div className="h-5 w-3/4 bg-surface-container-high rounded" />
                    <div className="h-4 w-full bg-surface-container-high/60 rounded" />
                    <div className="h-4 w-1/2 bg-surface-container-high/40 rounded" />
                    <div className="h-10 w-full bg-surface-container-high rounded-lg mt-4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

