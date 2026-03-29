import { useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";
import FilterSidebar from "@/pages/Clothing/components/FilterSidebar";

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// Fragrance
import frag1 from "@/assets/products/fragrance/p1.png";
import frag2 from "@/assets/products/fragrance/p1.png";
import frag3 from "@/assets/products/fragrance/p1.png";

// Makeup
import makeup1 from "@/assets/products/makeup/p1.png";
import makeup2 from "@/assets/products/makeup/p1.png";
import makeup3 from "@/assets/products/makeup/p1.png";

// Skincare
import skin1 from "@/assets/products/skincare/p1.png";
import skin2 from "@/assets/products/skincare/p1.png";
import skin3 from "@/assets/products/skincare/p1.png";

// Bath & Body
import bath1 from "@/assets/products/bath-body/p1.png";
import bath2 from "@/assets/products/bath-body/p1.png";
import bath3 from "@/assets/products/bath-body/p1.png";

// Brands — mix of above for now
import brand1 from "@/assets/products/fragrance/p1.png";
import brand2 from "@/assets/products/makeup/p1.png";
import brand3 from "@/assets/products/skincare/p1.png";

// Best Sellers — mix of above for now
import bs1 from "@/assets/products/fragrance/p1.png";
import bs2 from "@/assets/products/clothing/p1.png";
import bs3 from "@/assets/products/skincare/p1.png";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS PER CATEGORY
// ─────────────────────────────────────────────────────────────────────────────

const PRODUCTS_BY_CATEGORY = {
  fragrance: [
    { id: 1, image: frag1, name: "Velora Eau de Parfum",    price: "Rs. 3,450.00", href: "/products/fragrance/2" },
    { id: 2, image: frag2, name: "Luxe Floral Mist",        price: "Rs. 1,850.00", href: "#" },
    { id: 3, image: frag3, name: "BAEGUM Signature Scent",  price: "Rs. 4,200.00", href: "#" },
    { id: 4, image: frag1, name: "Velora Eau de Parfum",    price: "Rs. 3,450.00", href: "#" },
    { id: 5, image: frag2, name: "Luxe Floral Mist",        price: "Rs. 1,850.00", href: "#" },
    { id: 6, image: frag3, name: "BAEGUM Signature Scent",  price: "Rs. 4,200.00", href: "#" },
  ],

  makeup: [
    { id: 1, image: makeup1, name: "Velvet Lip Color",       price: "Rs. 1,200.00", href: "#" },
    { id: 2, image: makeup2, name: "Glow Foundation",        price: "Rs. 2,400.00", href: "#" },
    { id: 3, image: makeup3, name: "Volume Mascara",         price: "Rs. 950.00",   href: "#" },
    { id: 4, image: makeup1, name: "Velvet Lip Color",       price: "Rs. 1,200.00", href: "#" },
    { id: 5, image: makeup2, name: "Glow Foundation",        price: "Rs. 2,400.00", href: "#" },
    { id: 6, image: makeup3, name: "Volume Mascara",         price: "Rs. 950.00",   href: "#" },
  ],

  skincare: [
    { id: 1, image: skin1, name: "Luxurious Cream Set",      price: "Rs. 3,200.00", href: "#" },
    { id: 2, image: skin2, name: "Hydration Serum",          price: "Rs. 2,800.00", href: "#" },
    { id: 3, image: skin3, name: "Brightening Toner",        price: "Rs. 1,500.00", href: "#" },
    { id: 4, image: skin1, name: "Luxurious Cream Set",      price: "Rs. 3,200.00", href: "#" },
    { id: 5, image: skin2, name: "Hydration Serum",          price: "Rs. 2,800.00", href: "#" },
    { id: 6, image: skin3, name: "Brightening Toner",        price: "Rs. 1,500.00", href: "#" },
  ],

  "bath-body": [
    { id: 1, image: bath1, name: "Lavender Body Wash",       price: "Rs. 1,100.00", href: "#" },
    { id: 2, image: bath2, name: "Rose Body Lotion",         price: "Rs. 1,350.00", href: "#" },
    { id: 3, image: bath3, name: "Vanilla Sugar Scrub",      price: "Rs. 980.00",   href: "#" },
    { id: 4, image: bath1, name: "Lavender Body Wash",       price: "Rs. 1,100.00", href: "#" },
    { id: 5, image: bath2, name: "Rose Body Lotion",         price: "Rs. 1,350.00", href: "#" },
    { id: 6, image: bath3, name: "Vanilla Sugar Scrub",      price: "Rs. 980.00",   href: "#" },
  ],

  brands: [
    { id: 1, image: brand1, name: "BAEGUM - Signature",     price: "Rs. 3,450.00", href: "#" },
    { id: 2, image: brand2, name: "Velvet Lip Color",        price: "Rs. 1,200.00", href: "#" },
    { id: 3, image: brand3, name: "Luxurious Cream Set",     price: "Rs. 3,200.00", href: "#" },
    { id: 4, image: brand1, name: "BAEGUM - Signature",     price: "Rs. 3,450.00", href: "#" },
    { id: 5, image: brand2, name: "Velvet Lip Color",        price: "Rs. 1,200.00", href: "#" },
    { id: 6, image: brand3, name: "Luxurious Cream Set",     price: "Rs. 3,200.00", href: "#" },
  ],

  "best-sellers": [
    { id: 1, image: bs1, name: "Velora Eau de Parfum",       price: "Rs. 3,450.00", href: "#" },
    { id: 2, image: bs2, name: "Oatmeal V-Neck Dress",       price: "Rs. 2,800.00", href: "#" },
    { id: 3, image: bs3, name: "Luxurious Cream Set",        price: "Rs. 3,200.00", href: "#" },
    { id: 4, image: bs1, name: "Velora Eau de Parfum",       price: "Rs. 3,450.00", href: "#" },
    { id: 5, image: bs2, name: "Oatmeal V-Neck Dress",       price: "Rs. 2,800.00", href: "#" },
    { id: 6, image: bs3, name: "Luxurious Cream Set",        price: "Rs. 3,200.00", href: "#" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_LABELS = {
  makeup:           "Makeup",
  fragrance:        "Fragrance",
  "bath-body":      "Bath & Body",
  skincare:         "Skincare",
  brands:           "Brands",
  "best-sellers":   "Best Sellers",
};

const TOTAL_PRODUCTS = 123; // replace with real count from API later

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
// CATEGORY PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const { category } = useParams();
  const [filterOpen,      setFilterOpen]      = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (key) =>
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const clearFilters = () => setSelectedFilters([]);
  const activeCount  = selectedFilters.length;

  const pageTitle = CATEGORY_LABELS[category] || "Products";

  // Pick products for current category, fallback to empty array
  const products = PRODUCTS_BY_CATEGORY[category] || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">

        {/* ── Page title ───────────────────────────────────────── 
        <h1 className="text-2xl font-light text-[#1a1a1a] tracking-wide mb-6">
          {pageTitle}
        </h1>*/}

        {/* ── Top bar: filter toggle + product count ────────────── */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-[13px] text-[#1a1a1a]
                       hover:text-gray-500 transition-colors font-medium"
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

        {/* ── Active filter chips — desktop ─────────────────────── */}
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

          {/* Desktop filter sidebar */}
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
              category={category}
              selected={selectedFilters}
              onToggle={toggleFilter}
              onClear={clearFilters}
              onClose={() => setFilterOpen(false)}
            />
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {products.length > 0 ? (
              <div
                className={`grid gap-x-4 gap-y-8
                  grid-cols-2
                  ${filterOpen
                    ? "md:grid-cols-2 lg:grid-cols-3"
                    : "md:grid-cols-3 lg:grid-cols-4"
                  }
                `}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="product"
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-24">
                <p className="text-gray-400 text-[14px] font-light">
                  No products found for this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter bottom sheet ────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFilterOpen(false)}
      />
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl
                    transition-transform duration-300 ease-out
                    ${filterOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="p-5 h-full overflow-y-auto">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <FilterSidebar
            category={category}
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