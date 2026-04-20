import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";

// ─────────────────────────────────────────────────────────────────────────────
// 🗂️  ASSET CONFIG
// ─────────────────────────────────────────────────────────────────────────────

// Background images (one per category)
import bg1 from "@/assets/sections/timeless-modal-bg-1.png";
import bg2 from "@/assets/sections/timeless-modal-bg-2.png";
import bg3 from "@/assets/sections/timeless-modal-bg-3.png";
import bg4 from "@/assets/sections/timeless-modal-bg-4.png";

// Product placeholder images
import clothingImg   from "@/assets/products/clothing/p1.png";
import makeupImg     from "@/assets/products/makeup/p1.png";
import fragranceImg  from "@/assets/products/fragrance/p1.png";
import bathBodyImg   from "@/assets/products/bath-body/p1.png";
import skincareImg   from "@/assets/products/skincare/p1.png";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "clothing",
    bg: bg1,
    variant: "clothing",
    href: "/clothing",
    subtitle: "Sleeveless, fitted beige dress with a V-neck.",
    products: [
      { id: 1, image: clothingImg, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/1" },
      { id: 2, image: clothingImg, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/2" },
    ],
  },
  {
    id: "makeup",
    bg: bg2,
    variant: "product",
    href: "/makeup",
    subtitle: "Bold colours and everyday essentials.",
    products: [
      { id: 3, image: makeupImg, name: "Matte Lip Colour", description: "Long-lasting matte finish.", price: "LKR 0000.00", href: "/products/makeup/1" },
      { id: 4, image: makeupImg, name: "Matte Lip Colour", description: "Long-lasting matte finish.", price: "LKR 0000.00", href: "/products/makeup/2" },
    ],
  },
  {
    id: "fragrance",
    bg: bg3,
    variant: "product",
    href: "/fragrance",
    subtitle: "Signature scents for every mood.",
    products: [
      { id: 5, image: fragranceImg, name: "Floral Eau de Parfum", description: "Light floral notes.", price: "LKR 0000.00", href: "/products/fragrance/1" },
      { id: 6, image: fragranceImg, name: "Floral Eau de Parfum", description: "Light floral notes.", price: "LKR 0000.00", href: "/products/fragrance/2" },
    ],
  },
  {
    id: "bath-body",
    bg: bg4,
    variant: "product",
    href: "/bath-body",
    subtitle: "Nourishing formulas for soft skin.",
    products: [
      { id: 7, image: bathBodyImg, name: "Shea Body Lotion", description: "Deep moisture, all day.", price: "LKR 0000.00", href: "/products/bath-body/1" },
      { id: 8, image: bathBodyImg, name: "Shea Body Lotion", description: "Deep moisture, all day.", price: "LKR 0000.00", href: "/products/bath-body/2" },
    ],
  },
  {
    id: "skincare",
    bg: bg4,       // update to bg5 once timeless-modal-bg-5.png is added
    variant: "product",
    href: "/skincare",
    subtitle: "Gentle routines for glowing skin.",
    products: [
      { id: 9,  image: skincareImg, name: "Hydrating Serum", description: "Light, fast-absorbing serum.", price: "LKR 0000.00", href: "/products/skincare/1" },
      { id: 10, image: skincareImg, name: "Hydrating Serum", description: "Light, fast-absorbing serum.", price: "LKR 0000.00", href: "/products/skincare/2" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function FeaturedProductSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const desktopScrollRef    = useRef(null);
  const desktopCategoryRefs = useRef([]);
  const mobileScrollRef     = useRef(null);
  const mobileCategoryRefs  = useRef([]);

  // Desktop: observe first card of each category inside the vertical scroll container
  useEffect(() => {
    const root = desktopScrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number(e.target.dataset.categoryIndex))
          .sort((a, b) => a - b);
        if (visible.length > 0) setActiveIndex(visible[0]);
      },
      { root, threshold: 0.5 }
    );

    desktopCategoryRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Mobile: observe first card of each category inside the horizontal scroll container
  useEffect(() => {
    const root = mobileScrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number(e.target.dataset.categoryIndex))
          .sort((a, b) => a - b);
        if (visible.length > 0) setActiveIndex(visible[0]);
      },
      { root, threshold: 0.5 }
    );

    mobileCategoryRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full overflow-hidden" style={{ maxWidth: "1920px", margin: "0 auto" }}>

      {/* ══════════════════════════════════════════════════
          DESKTOP — full-width bg image, card floats right
      ══════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex w-full items-stretch"
        style={{ height: "90vh", position: "relative" }}
      >
        {/* Crossfading background layers — one per category */}
        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.id}
            style={{
              position:           "absolute",
              inset:              0,
              backgroundImage:    `url(${cat.bg})`,
              backgroundSize:     "cover",
              backgroundPosition: "center",
              opacity:            activeIndex === i ? 1 : 0,
              transition:         "opacity 600ms ease",
              zIndex:             0,
            }}
          />
        ))}

        {/* Content layer sits above backgrounds */}
        <div className="relative flex w-full items-stretch" style={{ zIndex: 1 }}>

          {/* LEFT — transparent spacer with vertical subtitle */}
          <div className="relative flex-1">
            <div
              className="absolute left-0 top-0 bottom-0 flex items-center"
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
                {CATEGORIES[activeIndex].subtitle}
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
              ref={desktopScrollRef}
              className="h-full overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#e5e7eb transparent",
                padding:        "16px",
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.flatMap((cat, catIdx) =>
                  cat.products.map((product, prodIdx) => {
                    const isFirst = prodIdx === 0;
                    return (
                      <div
                        key={product.id}
                        ref={isFirst ? (el) => { desktopCategoryRefs.current[catIdx] = el; } : undefined}
                        data-category-index={isFirst ? catIdx : undefined}
                      >
                        <ProductCard
                          product={product}
                          variant={cat.variant}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>{/* end content layer */}
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE — image top, title, horizontal scroll cards
          Title is OUTSIDE the scroll area
      ══════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col bg-pink-400 rounded">

        {/* Background image — crossfading layers */}
        <div className="w-full relative overflow-hidden" style={{ height: "260px" }}>
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              style={{
                position:           "absolute",
                inset:              0,
                backgroundImage:    `url(${cat.bg})`,
                backgroundSize:     "cover",
                backgroundPosition: "center",
                opacity:            activeIndex === i ? 1 : 0,
                transition:         "opacity 600ms ease",
              }}
            />
          ))}
        </div>

        {/* Title — below image, outside the scroll area */}
        <div className="px-4 pt-5 pb-3 bg-white rounded-t-xl">
          <h2 className="text-[19px] font-light text-[#1a1a1a] tracking-wide capitalize">
            {CATEGORIES[activeIndex].id.replace("-", " & ")}
          </h2>
        </div>

        {/* Horizontal scroll cards */}
        <div
          ref={mobileScrollRef}
          className="flex gap-3 overflow-x-auto pb-5 px-4 bg-white"
          style={{
            scrollbarWidth:          "none",
            msOverflowStyle:         "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {CATEGORIES.flatMap((cat, catIdx) =>
            cat.products.map((product, prodIdx) => {
              const isFirst = prodIdx === 0;
              return (
                <div
                  key={product.id}
                  ref={isFirst ? (el) => { mobileCategoryRefs.current[catIdx] = el; } : undefined}
                  data-category-index={isFirst ? catIdx : undefined}
                  className="flex-shrink-0"
                  style={{ width: "155px" }}
                >
                  <ProductCard product={product} variant={cat.variant} />
                </div>
              );
            })
          )}

          {/* View All pill — links to active category */}
          <div className="flex-shrink-0 flex items-center justify-center px-2">
            <Link
              to={CATEGORIES[activeIndex].href}
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
