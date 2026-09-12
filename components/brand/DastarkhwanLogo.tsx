import React from "react";
import Link from "next/link";

interface DastarkhwanLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

export function DastarkhwanLogo({
  className = "",
  showWordmark = true,
  size = "md",
}: DastarkhwanLogoProps) {
  const heightClass = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
  }[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <svg
        viewBox="0 0 340 80"
        className={`${heightClass} w-auto object-contain transition-transform group-hover:scale-105 duration-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="dastarkhwanGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3E5AB" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Octagram Motif / Dastarkhwan Symbol */}
        <g transform="translate(10, 10)">
          <rect
            x="14"
            y="14"
            width="32"
            height="32"
            rx="4"
            transform="rotate(0 30 30)"
            stroke="url(#dastarkhwanGold)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.85"
          />
          <rect
            x="14"
            y="14"
            width="32"
            height="32"
            rx="4"
            transform="rotate(45 30 30)"
            stroke="url(#dastarkhwanGold)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.85"
          />
          {/* Central Golden Flame / Spice Bloom */}
          <circle cx="30" cy="30" r="8" fill="url(#dastarkhwanGold)" opacity="0.15" />
          <path
            d="M30 18 C33 24 38 27 38 32 C38 36.4 34.4 40 30 40 C25.6 40 22 36.4 22 32 C22 27 27 24 30 18 Z"
            fill="url(#dastarkhwanGold)"
          />
          <circle cx="30" cy="32" r="2.5" fill="#131315" />
          {/* Decorative Corner Dots */}
          <circle cx="30" cy="7" r="1.5" fill="url(#dastarkhwanGold)" />
          <circle cx="30" cy="53" r="1.5" fill="url(#dastarkhwanGold)" />
          <circle cx="7" cy="30" r="1.5" fill="url(#dastarkhwanGold)" />
          <circle cx="53" cy="30" r="1.5" fill="url(#dastarkhwanGold)" />
        </g>

        {/* Typography Brand Mark */}
        {showWordmark && (
          <g transform="translate(78, 20)">
            <text
              x="0"
              y="30"
              fontFamily="'Playfair Display', serif"
              fontSize="28"
              fontWeight="700"
              letterSpacing="4"
              fill="url(#dastarkhwanGold)"
              filter="url(#logoGlow)"
            >
              DASTARKHWAN
            </text>
            <text
              x="3"
              y="46"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="9.5"
              fontWeight="500"
              letterSpacing="5"
              fill="#C5BCAE"
              opacity="0.9"
            >
              IMPERIAL PAKISTANI CUISINE
            </text>
            <line
              x1="172"
              y1="43"
              x2="230"
              y2="43"
              stroke="url(#dastarkhwanGold)"
              strokeWidth="0.75"
              opacity="0.5"
            />
          </g>
        )}
      </svg>
    </Link>
  );
}

