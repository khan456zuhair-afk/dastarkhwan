"use client";

import React from "react";
import { CartProvider } from "@/lib/context/cart-context";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

