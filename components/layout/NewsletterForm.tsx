"use client";

import React from "react";
import { Send } from "lucide-react";

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Thank you for subscribing to the Imperial Dispatch.");
      }}
      className="space-y-2"
    >
      <div className="relative">
        <input
          type="email"
          required
          placeholder="Your royal email"
          className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/60 rounded-lg text-on-surface placeholder:text-outline text-xs focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="absolute right-1 top-1 bottom-1 px-3 bg-primary-container hover:bg-primary text-on-primary rounded-md transition-colors flex items-center justify-center cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}

