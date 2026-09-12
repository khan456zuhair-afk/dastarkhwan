import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dastarkhwan — Imperial Pakistani Cuisine | DHA Phase 8, Karachi",
  description:
    "Slow-cooked Dum Pukht biryanis, hand-hammered wok karahis, and charcoal-kissed seekh kebabs prepared with heirloom spices, pure desi ghee, and royal saffron. DHA Phase 8, Karachi.",
  keywords: [
    "Pakistani restaurant",
    "Karachi luxury dining",
    "Dum Pukht Biryani",
    "Shinwari Karahi",
    "Nalli Nihari",
    "DHA Phase 8 Karachi",
    "Fine dining Pakistan",
  ],
};

import { ClientProviders } from "@/components/providers/ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${playfair.variable} ${jakarta.variable}`}>
      <body className="bg-surface text-on-surface min-h-screen flex flex-col font-sans antialiased selection:bg-primary selection:text-on-primary">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
