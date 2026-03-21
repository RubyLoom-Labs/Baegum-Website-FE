import { useState } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

import imgFragrances from "@/assets/categories/fragrances.jpg";
import imgBathBody   from "@/assets/categories/bath-body.jpg";
import imgSkinCare   from "@/assets/categories/skin-care.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 1, image: imgFragrances, label: "Fragrances", href: "#" },
  { id: 2, image: imgBathBody,   label: "Bath & Body", href: "#" },
  { id: 3, image: imgSkinCare,   label: "Skin Care",   href: "#" },
];

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CARD
// ─────────────────────────────────────────────────────────────────────────────

function CategoryCard({ category }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={category.href}
      draggable={false}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block overflow-hidden rounded-sm select-none"
    >
      {/* 1:1 image */}
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        <img
          src={category.image}
          alt={category.label}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
        />

        {/* Label pill — bottom center */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
          <div
            className="flex items-center gap-3 px-6 py-3 text-[15px] font-medium transition-all duration-300"
            style={{
              backgroundColor: hovered ? "#1a1a1a"  : "rgba(255,255,255,0.92)",
              color:           hovered ? "#ffffff"  : "#1a1a1a",
              minWidth:        "180px",
              justifyContent:  "center",
            }}
          >
            {category.label}
            {/* Arrow — appears on hover */}
            <span
              className="transition-all duration-300"
              style={{
                opacity:   hovered ? 1 : 0,
                transform: hovered ? "translateX(0)" : "translateX(-6px)",
              }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function CategoryShowcase() {
  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">

        {/* Desktop: 3 cols side by side */}
        {/* Mobile: stacked full width, one by one */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

      </div>
    </section>
  );
}