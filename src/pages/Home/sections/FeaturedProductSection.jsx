import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";

// ─────────────────────────────────────────────────────────────────────────────
// 🗂️  ASSET CONFIG
// ─────────────────────────────────────────────────────────────────────────────

import bgImage from "@/assets/sections/timeless-modal-bg.png";

import p1 from "@/assets/products/clothing/p1.png";
import p2 from "@/assets/products/clothing/p1.png";
import p3 from "@/assets/products/clothing/p1.png";
import p4 from "@/assets/products/clothing/p1.png";
import p5 from "@/assets/products/clothing/p1.png";
import p6 from "@/assets/products/clothing/p1.png";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_TITLE = "Timeless Modal";

const PRODUCTS = [
  { id: 1, image: p1, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/1" },
  { id: 2, image: p2, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/2" },
  { id: 3, image: p3, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/3" },
  { id: 4, image: p4, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/4" },
  { id: 5, image: p5, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/5" },
  { id: 6, image: p6, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/6" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function FeaturedProductSection() {

  return (
    <section className="w-full overflow-hidden" style={{ maxWidth: "1920px", margin: "0 auto" }}>

      {/* ══════════════════════════════════════════════════
          DESKTOP — full-width bg image, card floats right
      ══════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex w-full items-stretch"
        style={{
          height:             "90vh",
          backgroundImage:    `url(${bgImage})`,
          backgroundSize:     "cover",
          backgroundPosition: "center",
        }}
      >

        {/* LEFT — transparent spacer with vertical subtitle */}
        <div className="relative flex-1">
          {/* Vertical rotated subtitle — far left edge */}
          <div
            className="absolute left-0 top-0 bottom-0 flex items-center "
            style={{ paddingLeft: "6px" }}
          >
            <p
              className="text-white text-[10px] font-light tracking-[0.25em] uppercase select-none whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                transform:   "rotate(180deg)",
                opacity:     0.65,
              }}
            >
              Sleeveless, fitted beige dress with a V-neck.
            </p>
          </div>
        </div>

        {/* RIGHT — white card box floating over the bg image */}
        <div
          className="overflow-hidden border border-gray-200 bg-white rounded-md shadow-lg"
          style={{
            width:  "48%",
            margin: "60px 60px 60px 0",
          }}
        >
          {/* Scrollable 2-col product grid — fills full height */}
          <div
            className="h-full overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#e5e7eb transparent",
              padding:        "16px",
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="clothing"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE — image top, title, horizontal scroll cards
          Title is OUTSIDE the scroll area
      ══════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col bg-pink-400 rounded">

        {/* Background image — full width, portrait crop */}
        <div
          className="w-full relative overflow-hidden"
          style={{
            height:             "260px",
            backgroundImage:    `url(${bgImage})`,
            backgroundSize:     "cover",
            backgroundPosition: "right right",
          }}
        />

        {/* Title — below image, outside the scroll area */}
        <div className="px-4 pt-5 pb-3 bg-white rounded-t-xl">
          <h2 className="text-[19px] font-light text-[#1a1a1a] tracking-wide">
            {SECTION_TITLE}
          </h2>
        </div>

        {/* Horizontal scroll cards — no title inside */}
        <div
          className="flex gap-3 overflow-x-auto pb-5 px-4 bg-white"
          style={{
            scrollbarWidth:           "none",
            msOverflowStyle:          "none",
            WebkitOverflowScrolling:  "touch",
          }}
        >
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: "155px" }}
            >
              <ProductCard
                product={product}
                variant="clothing"
              />
            </div>
          ))}

          {/* View All pill at end */}
          <div className="flex-shrink-0 flex items-center justify-center px-2">
            <Link
              to="/clothing"
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-10 h-10 rounded-full border border-gray-300
                           flex items-center justify-center hover:border-[#1a1a1a]
                           transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              <span className="text-[10px] text-gray-400 font-light whitespace-nowrap">
                View All
              </span>
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}