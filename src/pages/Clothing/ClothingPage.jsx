import { useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import FilterSidebar from "./components/FilterSidebar";

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

import p1 from "@/assets/products/clothing/p1.png";
import p2 from "@/assets/products/clothing/p1.png";
import p3 from "@/assets/products/clothing/p1.png";
import p4 from "@/assets/products/clothing/p1.png";
import p5 from "@/assets/products/clothing/p1.png";
import p6 from "@/assets/products/clothing/p1.png";
import p7 from "@/assets/products/clothing/p1.png";
import p8 from "@/assets/products/clothing/p1.png";

const PRODUCTS = [
  { id: 1,  image: p1, name: "Oatmeal V-Neck Dress",  description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/1" },
  { id: 2,  image: p2, name: "Oatmeal V-Neck Dress",  description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "#" },
  { id: 3,  image: p3, name: "Oatmeal V-Neck Dress",  description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "#" },
  { id: 4,  image: p4, name: "Oatmeal V-Neck Dress",  description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "#" },
  { id: 5,  image: p5, name: "Oatmeal V-Neck Dress",  description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "#" },
  { id: 6,  image: p6, name: "Oatmeal V-Neck Dress",  description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "#" },
  { id: 7,  image: p7, name: "Oatmeal V-Neck Dress",  description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "#" },
  { id: 8,  image: p8, name: "Oatmeal V-Neck Dress",  description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "#" },
];

const TOTAL_PRODUCTS = 123;
 
// ── Filter icon ───────────────────────────────────────────────────────────────
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="10" y1="18" x2="14" y2="18" />
  </svg>
);
 
// ─────────────────────────────────────────────────────────────────────────────
// CLOTHING PAGE
// ─────────────────────────────────────────────────────────────────────────────
 
export default function ClothingPage() {
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
 
  const toggleFilter = (key) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
 
  const clearFilters = () => setSelectedFilters([]);
 
  const activeCount = selectedFilters.length;
 
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
 
        {/* ── Top bar: Filter toggle + product count ────────────── */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-[13px] text-[#1a1a1a] hover:text-gray-500
                       transition-colors font-medium"
          >
            <FilterIcon />
            Filters
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#1a1a1a] text-white text-[10px]
                               flex items-center justify-center font-semibold">
                {activeCount}
              </span>
            )}
          </button>
 
          <p className="text-[13px] text-gray-400 font-light">
            {TOTAL_PRODUCTS} products
          </p>
        </div>
 
        {/* ── Active filter chips (desktop/tablet, above grid) ──── */}
        {selectedFilters.length > 0 && (
          <div className="hidden md:flex flex-wrap gap-2 mb-5">
            {selectedFilters.map((key) => {
              const label = key.split(":")[1];
              return (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300
                             rounded-full text-[12px] text-gray-600 hover:border-[#1a1a1a]
                             hover:text-[#1a1a1a] transition-colors font-light"
                >
                  ✕ {label}
                </button>
              );
            })}
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-[12px] text-gray-400 hover:text-[#1a1a1a]
                         underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
 
        {/* ── Main layout: sidebar + grid ──────────────────────── */}
        <div className="flex gap-6">
 
          {/* ── DESKTOP/TABLET FILTER SIDEBAR ──────────────────── */}
          <aside
            className="hidden md:block flex-shrink-0 overflow-hidden"
            style={{
              width:      filterOpen ? "260px" : "0px",
              opacity:    filterOpen ? 1 : 0,
              transition: "width 0.3s ease, opacity 0.3s ease",
              display:    filterOpen ? undefined : "none",
            }}
          >
            <FilterSidebar
                category="clothing"  
                selected={selectedFilters}
                onToggle={toggleFilter}
                onClear={clearFilters}
                onClose={() => setFilterOpen(false)}
            />
          </aside>
 
          {/* ── PRODUCT GRID ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div
              className={`grid gap-x-4 gap-y-8 transition-all duration-300
                /* Mobile: always 2 cols */
                grid-cols-2
                /* Tablet: 3 cols default, 2 cols when filter open */
                ${filterOpen
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "md:grid-cols-3 lg:grid-cols-4"
                }
              `}
            >
              {PRODUCTS.map((product) => (
                // ClothingPage.jsx — make sure this is there
                <ProductCard key={product.id} product={product} variant="clothing" />
              ))}
            </div>
          </div>
        </div>
      </div>
 
      {/* ── MOBILE FILTER OVERLAY ──────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFilterOpen(false)}
      />
 
      {/* Drawer slides up from bottom */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl
                    transition-transform duration-300 ease-out
                    ${filterOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="p-5 h-full overflow-y-auto">
          {/* Drag handle */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <FilterSidebar
            selected={selectedFilters}
            onToggle={toggleFilter}
            onClear={clearFilters}
            onClose={() => setFilterOpen(false)}
            isMobile
          />
        </div>
      </div>
    </div>
  );
}