"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/lib/types/menu";
import { useCart } from "@/lib/context/cart-context";
import { SpiceMeter } from "@/components/ui/SpiceMeter";
import { formatPKR } from "@/lib/utils";
import { Star, ShoppingBag, Plus, Minus, Check } from "lucide-react";

interface DishCardProps {
  item: MenuItem;
}

export function DishCard({ item }: DishCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedRecently, setAddedRecently] = useState(false);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addItem(item, quantity);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1800);
  };

  return (
    <div className="dish-card flex flex-col justify-between bg-surface-container rounded-xl overflow-hidden shadow-xl border border-primary/10 hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 group">
      {/* Top Visual Panel */}
      <div className="relative h-56 w-full overflow-hidden bg-surface-container-lowest">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {/* Origin Badge */}
        {item.originBadge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded text-[10px] font-sans font-semibold tracking-wider text-primary border border-primary/20 uppercase">
            {item.originBadge}
          </span>
        )}
        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur-md rounded text-primary text-xs font-medium border border-primary/20">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span>
            {item.rating.toFixed(1)} ({item.reviewCount})
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata Row: Portion & Spice */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-on-surface-variant font-medium">
              {item.portionInfo || "Imperial Portion"}
            </span>
            <SpiceMeter level={item.spiceLevel} />
          </div>

          {/* Dish Title */}
          <h3 className="font-serif text-lg font-semibold text-on-surface group-hover:text-primary transition-colors leading-snug">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>

        {/* Bottom Bar: Price, Counter & Add Button */}
        <div className="pt-2 space-y-3 border-t border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-serif text-xl font-bold text-primary">
              {formatPKR(item.price)}
            </span>

            {/* Quantity Stepper */}
            <div className="flex items-center bg-surface-container-high rounded-lg p-0.5 border border-outline-variant/30">
              <button
                type="button"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-semibold text-on-surface">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                aria-label="Increase quantity"
                className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              addedRecently
                ? "bg-tertiary text-on-tertiary shadow-md scale-[0.98]"
                : "btn-imperial"
            }`}
          >
            {addedRecently ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Dastarkhwan</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Dastarkhwan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

