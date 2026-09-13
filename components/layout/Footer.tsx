import React from "react";
import Link from "next/link";
import { DastarkhwanLogo } from "@/components/brand/DastarkhwanLogo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Phone, Clock, MapPin, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 text-on-surface-variant font-sans">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Col (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-5">
            <DastarkhwanLogo size="md" />
            <p className="text-sm leading-relaxed text-on-surface-variant/90 max-w-md">
              Reviving the regal ceremonial banquets of the Mughal court and grand
              subcontinental traditions with Michelin-grade modern craft, fragrant
              heirloom spices, and pure royal warmth.
            </p>
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Delivery Hotline:{" "}
                  <strong className="text-on-surface font-semibold text-sm">
                    +92 21 3584 9200
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>Imperial Dining Hours: 12:00 PM – 1:30 AM Daily</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-tertiary shrink-0" />
                <span className="text-tertiary">100% Halal Certified Prime Cuts</span>
              </div>
            </div>
          </div>

          {/* Column 2: Culinary Courses */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-on-surface font-medium">
              Culinary Courses
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/menu?cat=dum-pukht-biryani" className="hover:text-primary transition-colors">
                  Dum Pukht & Biryani
                </Link>
              </li>
              <li>
                <Link href="/menu?cat=shinwari-karahi" className="hover:text-primary transition-colors">
                  Shinwari & Lahori Karahi
                </Link>
              </li>
              <li>
                <Link href="/menu?cat=angara-bbq-seekh" className="hover:text-primary transition-colors">
                  Angara BBQ & Seekh
                </Link>
              </li>
              <li>
                <Link href="/menu?cat=nihari-paya" className="hover:text-primary transition-colors">
                  Nihari & Paya
                </Link>
              </li>
              <li>
                <Link href="/menu?cat=tandoor-naan" className="hover:text-primary transition-colors">
                  Artisanal Tandoor & Roghani Naan
                </Link>
              </li>
              <li>
                <Link href="/menu?cat=mithai-desserts" className="hover:text-primary transition-colors">
                  Shahi Mithai & Kheer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Flagship Dining Haveli */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-on-surface font-medium">
              Flagship Haven
            </h4>
            <div className="space-y-2 text-xs">
              <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-semibold uppercase tracking-wider">
                Single Exclusive Location
              </span>
              <p className="text-on-surface font-medium text-sm flex items-start gap-1.5 pt-1">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Plot 14-C, Creek Avenue, Phase 8, DHA, Karachi
              </p>
              <p className="text-on-surface-variant">Lunch & Deg Feast: 12:30 PM – 4:00 PM</p>
              <p className="text-on-surface-variant">Royal Dinner: 7:00 PM – 1:30 AM</p>
              <p className="text-on-surface-variant pt-1 font-medium text-primary">
                Valet Parking & Private Majlis Rooms
              </p>
            </div>
          </div>

          {/* Column 4: Royal Dispatch */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-on-surface font-medium">
              Royal Dispatch
            </h4>
            <p className="text-xs leading-relaxed">
              Receive seasonal degustation menus and exclusive banquet invitations.
            </p>
            <NewsletterForm />
            <div className="pt-2">
              <Link
                href="/admin"
                className="text-[11px] text-outline hover:text-primary transition-colors underline"
              >
                Staff / Admin Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Dastarkhwan Heritage Dining Ltd. All Imperial Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-primary transition-colors">
              Our Heritage
            </Link>
            <Link href="/book-table" className="hover:text-primary transition-colors">
              Reserve Table
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact & Directions
            </Link>
            <span className="text-tertiary">Halal Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

