import { useState } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// 🗂️  ASSET CONFIG
// ─────────────────────────────────────────────────────────────────────────────

import iconShorts    from "@/assets/icons/trends/shorts.svg";
import iconShorts2   from "@/assets/icons/trends/shorts2.svg";
import iconPerfume   from "@/assets/icons/trends/perfume.svg";
import iconHandbag   from "@/assets/icons/trends/handbag.svg";
import iconSoap      from "@/assets/icons/trends/soap.svg";
import iconTshirt1   from "@/assets/icons/trends/tshirt1.svg";
import iconTshirt2   from "@/assets/icons/trends/tshirt2.svg";
import iconTshirt3   from "@/assets/icons/trends/tshirt3.svg";
import iconTshirt4   from "@/assets/icons/trends/tshirt4.svg";
import iconSneaker   from "@/assets/icons/trends/sneaker.svg";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const TRENDS = [
  { id: 1,  icon: iconShorts,  label: "Shorts",    href: "#" },
  { id: 2,  icon: iconShorts2, label: "Bottoms",   href: "#" },
  { id: 3,  icon: iconPerfume, label: "Fragrance", href: "#" },
  { id: 4,  icon: iconHandbag, label: "Bags",      href: "#" },
  { id: 5,  icon: iconSoap,    label: "Skincare",  href: "#" },
  { id: 6,  icon: iconTshirt1, label: "Tops",      href: "#" },
  { id: 7,  icon: iconTshirt2, label: "T-Shirts",  href: "#" },
  { id: 8,  icon: iconTshirt3, label: "Casual",    href: "#" },
  { id: 9,  icon: iconTshirt4, label: "Basic",     href: "#" },
  { id: 10, icon: iconSneaker, label: "Footwear",  href: "#" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP TREND CARD
// ─────────────────────────────────────────────────────────────────────────────

function TrendCard({ icon, label, href, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  const isActive = active || hovered;

  return (
    <Link
      to={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex items-center justify-center rounded-xl border bg-white
                 transition-all duration-300 ease-out p-6"
      style={{
        borderColor:  isActive ? "#1a1a1a"                              : "#e5e7eb",
        boxShadow:    isActive ? "0 4px 20px rgba(0,0,0,0.10)"         : "none",
        transform:    isActive ? "translateY(-1px)"                     : "translateY(0)",
      }}
    >
      <img
        src={icon}
        alt={label}
        draggable={false}
        className="object-contain select-none w-10 h-10"
        style={{
          transform:  isActive ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.3s ease",
        }}
      />
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE TREND CELL
// ─────────────────────────────────────────────────────────────────────────────

function MobileTrendCell({ icon, label, href, borderRight, borderBottom }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Link
      to={href}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={()   => setTimeout(() => setPressed(false), 300)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={()   => setTimeout(() => setPressed(false), 300)}
      className="flex items-center justify-center bg-white transition-colors duration-200"
      style={{
        // Rectangle shape — wider than tall feel
        paddingTop:    "28px",
        paddingBottom: "28px",
        borderRight:  borderRight  ? "1px solid #e5e7eb" : "none",
        borderBottom: borderBottom ? "1px solid #e5e7eb" : "none",
        backgroundColor: pressed ? "#f9fafb" : "#ffffff",
      }}
    >
      <img
        src={icon}
        alt={label}
        draggable={false}
        className="object-contain select-none w-10 h-10"
        style={{
          transform:  pressed ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.25s ease",
          filter:     pressed ? "drop-shadow(0 2px 6px rgba(0,0,0,0.18))" : "none",
        }}
      />
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function TopTrends() {
  const [active, setActive] = useState(null);

  // Mobile shows first 6 items in a 3×2 grid
  const mobileItems = TRENDS.slice(0, 6);

  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">

        {/* ── Title ──────────────────────────────────────────────────── */}
        <h2 className="text-2xl font-light text-[#1a1a1a] mb-8 tracking-wide
                       text-left md:text-center">
          Top Trends
        </h2>

        {/* ── Desktop: 5 cols × 2 rows ────────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-5 gap-3">
          {TRENDS.map((trend) => (
            <TrendCard
              key={trend.id}
              icon={trend.icon}
              label={trend.label}
              href={trend.href}
              active={active === trend.id}
              onClick={() => setActive(trend.id)}
            />
          ))}
        </div>

        {/* ── Mobile: 3 cols × 2 rows ──────────────────────────────── */}
        {/* Outer border gives the rectangular card look from the design */}
        <div
          className="md:hidden overflow-hidden"
          style={{
            border:       "1px solid #e5e7eb",
            borderRadius: "10px",
          }}
        >
          <div className="grid grid-cols-3">
            {mobileItems.map((trend, i) => (
              <MobileTrendCell
                key={trend.id}
                icon={trend.icon}
                label={trend.label}
                href={trend.href}
                borderRight={i % 3 !== 2}        // not last in row
                borderBottom={i < 3}              // first row only
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}