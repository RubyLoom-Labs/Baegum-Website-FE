import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";
import { getFirstPageOccasions, getProductsByOccasionId } from "@/services/occasions";

// ─────────────────────────────────────────────────────────────────────────────
// 🗂️  ASSET CONFIG
//  Category background images for mobile cards
//  Product images for desktop cards
// ─────────────────────────────────────────────────────────────────────────────

import catClassic   from "@/assets/sections/cat-classic-modal.png";
import catCrepe     from "@/assets/sections/cat-textured-crepe.png";
import catOccasion  from "@/assets/sections/cat-occasion-sets.png";
import catEvening   from "@/assets/sections/cat-evening-luxe.png";

import p1 from "@/assets/products/clothing/p1.png";
import p2 from "@/assets/products/clothing/p1.png";
import p3 from "@/assets/products/clothing/p1.png";
import p4 from "@/assets/products/clothing/p1.png";
import p5 from "@/assets/products/clothing/p1.png";

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert product photo path to full image URL
 */
const getFullProductImageUrl = (photoPath) => {
  if (!photoPath) return p1;
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const cleanPath = photoPath.startsWith('/') ? photoPath.substring(1) : photoPath;
  return `${apiUrl}/storage/${cleanPath}`;
};

/**
 * Format API product response to card format
 */
const formatProductForCard = (apiProduct, categorySlug = 'clothing') => {
  if (!apiProduct) return null;

  // Get the first photo from photos array
  const photos = apiProduct.photos || [];
  const primaryPhoto = photos.find(p => p.is_primary) || photos[0];
  const imageUrl = primaryPhoto ? getFullProductImageUrl(primaryPhoto.photo_path) : p1;

  return {
    id: apiProduct.id,
    image: imageUrl,
    name: apiProduct.name,
    description: apiProduct.sub_topic || `${apiProduct.brand?.name || ''} - ${apiProduct.product_category?.name || ''}`,
    price: `Rs.${parseFloat(apiProduct.price).toFixed(2)}`,
    href: `/products/${categorySlug}/${apiProduct.id}`,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  {
    id:       "classic-modal",
    label:    "Classic Modal",
    href:     "/clothing?collection=classic-modal",
    subtitle: "Soft comfort, timeless style.",
    bgImage:  catClassic,
    products: [
      { id: 1, image: p1, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/1" },
      { id: 2, image: p2, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/2" },
      { id: 3, image: p3, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/3" },
      { id: 4, image: p4, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/4" },
      { id: 5, image: p5, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/5" },
    ],
  },
  {
    id:       "textured-crepe",
    label:    "Textured Crepe",
    href:     "/clothing?collection=textured-crepe",
    subtitle: "Elevated texture, refined finish.",
    bgImage:  catCrepe,
    products: [
      { id: 6,  image: p2, name: "Textured Crepe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/6" },
      { id: 7,  image: p3, name: "Textured Crepe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/7" },
      { id: 8,  image: p4, name: "Textured Crepe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/8" },
      { id: 9,  image: p5, name: "Textured Crepe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/9" },
      { id: 10, image: p1, name: "Textured Crepe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/10" },
    ],
  },
  {
    id:       "occasion-sets",
    label:    "Occasion Sets",
    href:     "/clothing?collection=occasion-sets",
    subtitle: "Coordinated sets for every moment.",
    bgImage:  catOccasion,
    products: [
      { id: 11, image: p3, name: "Occasion Set", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/11" },
      { id: 12, image: p4, name: "Occasion Set", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/12" },
      { id: 13, image: p5, name: "Occasion Set", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/13" },
      { id: 14, image: p1, name: "Occasion Set", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/14" },
      { id: 15, image: p2, name: "Occasion Set", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/15" },
    ],
  },
  {
    id:       "evening-luxe",
    label:    "Evening Luxe",
    href:     "/clothing?collection=evening-luxe",
    subtitle: "Statement pieces for the night.",
    bgImage:  catEvening,
    products: [
      { id: 16, image: p4, name: "Evening Luxe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/16" },
      { id: 17, image: p5, name: "Evening Luxe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/17" },
      { id: 18, image: p1, name: "Evening Luxe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/18" },
      { id: 19, image: p2, name: "Evening Luxe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/19" },
      { id: 20, image: p3, name: "Evening Luxe Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "Rs.0000.00", href: "/products/clothing/20" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARROW BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function ArrowBtn({ direction, onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-10
                 w-9 h-9 bg-white/85 hover:bg-white active:bg-gray-100
                 border border-gray-200 rounded-full flex items-center justify-center
                 shadow-sm transition-all duration-200 hover:shadow"
      style={{ [direction === "left" ? "left" : "right"]: "6px" }}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {direction === "left"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />
        }
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP SECTION
// ─────────────────────────────────────────────────────────────────────────────

function DesktopSection({ tabs, activeTab, setActiveTab, loading, products, loadingProducts }) {
  const scrollRef = useRef(null);
  const tab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (loading || !tab) return null;

  return (
    <div className="hidden md:block w-full">

      {/* ── Tab navigation ──────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-8 px-6 mb-6">
        {tabs.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              data-occasion-id={t.occasionId}
              title={`ID: ${t.occasionId}`}
              className="relative pb-1 text-[14px] tracking-wide transition-colors duration-200"
              style={{
                color:      isActive ? "#FF8989" : "#6b7280",
                fontWeight: isActive ? "500"      : "300",
              }}
            >
              {t.label}
              {/* Active underline */}
              <span
                className="absolute bottom-0 left-0 h-px transition-all duration-300"
                style={{
                  width:           isActive ? "100%" : "0%",
                  backgroundColor: "#FF8989",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* ── Horizontal scroll cards with edge arrows ─────────────── */}
      <div className="relative">
        <ArrowBtn direction="left"  onClick={() => scroll("left")}  />
        <ArrowBtn direction="right" onClick={() => scroll("right")} />

        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto"
          style={{
            scrollbarWidth:   "none",
            msOverflowStyle:  "none",
            scrollSnapType:   "x mandatory",
          }}
        >
          {loadingProducts ? (
            <div className="w-full flex items-center justify-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 px-2"
                style={{
                  width:         "calc(20% + 4px)", // ~5 cards visible
                  scrollSnapAlign: "start",
                }}
              >
                <ProductCard product={product} variant="clothing" />
              </div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center py-8">
              <p className="text-gray-500">No products available</p>
            </div>
          )}
        </div>
      </div>

      {/* ── View All button ────────────────────────────────────────── */}
      <div className="flex justify-center mt-7 mb-2">
        <Link
          to={tab.href}
          className="px-16 py-3 border border-gray-300 text-[#1a1a1a] text-[13px]
                     font-light tracking-wide hover:border-[#1a1a1a] hover:bg-gray-50
                     active:bg-gray-100 transition-colors"
        >
          View All....
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE SECTION — 4 category image cards carousel
// ─────────────────────────────────────────────────────────────────────────────

function MobileSection({ tabs, loading, products, loadingProducts }) {
  const [current, setCurrent] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef(null);

  const total = tabs.length;

  const goTo = (i) => setCurrent((i + total) % total);
  const next  = () => goTo(current + 1);
  const prev  = () => goTo(current - 1);

  // Autoplay — advance every 4s
  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 4000);
  };

  useEffect(() => {
    if (!loading && total > 0) {
      resetTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [loading, total]);

  const onDragStart = (x) => { setDragStart(x); setIsDragging(false); };
  const onDragMove  = (x) => { if (dragStart !== null && Math.abs(x - dragStart) > 5) setIsDragging(true); };
  const onDragEnd   = (x) => {
    if (dragStart === null) return;
    const diff = dragStart - x;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetTimer(); }
    setDragStart(null);
    setTimeout(() => setIsDragging(false), 0);
  };

  if (loading || tabs.length === 0) return null;

  const tab = tabs[current];

  return (
    <div className="md:hidden w-full px-4">

      {/* 1:1 square card using paddingBottom trick */}
      <div
        className="relative w-full overflow-hidden select-none"
        style={{ paddingBottom: "100%" }} // 1:1 ratio
        onMouseDown={(e)  => onDragStart(e.clientX)}
        onMouseMove={(e)  => onDragMove(e.clientX)}
        onMouseUp={(e)    => onDragEnd(e.clientX)}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e)  => onDragMove(e.touches[0].clientX)}
        onTouchEnd={(e)   => onDragEnd(e.changedTouches[0].clientX)}
      >
        {/* Sliding track — absolutely fills the 1:1 box */}
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)`, width: `${total * 100}%` }}
        >
          {tabs.map((t) => (
            <div
              key={t.id}
              className="relative flex-shrink-0 h-full"
              style={{
                width:              `${100 / total}%`,
                backgroundImage:    `url(${t.bgImage})`,
                backgroundSize:     "cover",
                backgroundPosition: "center top",
              }}
            >
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0) 100%)" }}
              />
            </div>
          ))}
        </div>

        {/* Text overlay — bottom of card */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-10">
          <h3 className="text-white text-[21px] font-light tracking-wide leading-tight mb-1"
              data-occasion-id={tab.occasionId}>
            {tab.label}
          </h3>
          <p className="text-white/75 text-[13px] font-light mb-4">
            {tab.subtitle}
          </p>
          <Link
            to={tab.href}
            onClick={(e) => isDragging && e.preventDefault()}
            className="block w-full py-3.5 border border-white/50 text-white text-[13px]
                       font-light tracking-wide text-center hover:bg-white/10
                       active:bg-white/20 transition-colors"
          >
            View All..
          </Link>
        </div>
      </div>

      {/* Dots — below the card, clearly visible */}
      <div className="flex justify-center gap-2 mt-4 mb-2">
        {tabs.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetTimer(); }}
            aria-label={`Go to ${tabs[i].label}`}
            className="rounded-full transition-all duration-300"
            style={{
              width:           i === current ? "18px" : "6px",
              height:          "6px",
              backgroundColor: i === current ? "#1a1a1a" : "#d1d5db",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch occasions from API
  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        setLoadingOccasions(true);
        const response = await getFirstPageOccasions();
        
        // Extract occasions data from response
        const occasions = response.data || [];

        // Map occasions to tab structure
        const dynamicTabs = occasions.slice(0, 4).map((occasion, index) => {
          // Use occasion ID as the tab ID, convert name to slug for href
          const tabId = `occasion-${occasion.id}`;
          const nameSlug = occasion.name.toLowerCase().replace(/\s+/g, '-');
          
          return {
            id:           tabId,
            occasionId:   occasion.id,
            label:        occasion.display_name || occasion.name,
            occasionName: occasion.name,
            href:         `/products/${nameSlug}`,
            subtitle:     `Explore our ${occasion.display_name} collection`,
            bgImage:      TABS[index]?.bgImage || TABS[0]?.bgImage,
            products:     [],
          };
        });

        setTabs(dynamicTabs);
        // Set first tab as active
        if (dynamicTabs.length > 0) {
          setActiveTab(dynamicTabs[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch occasions:', error);
        // Fallback to original static TABS
        setTabs(TABS);
        setActiveTab(TABS[0]?.id || 'classic-modal');
      } finally {
        setLoadingOccasions(false);
      }
    };

    fetchOccasions();
  }, []);

  // Fetch products when active tab changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeTab) return;

      const activeTabData = tabs.find(t => t.id === activeTab);
      if (!activeTabData?.occasionId) return;

      try {
        setLoadingProducts(true);
        const response = await getProductsByOccasionId(activeTabData.occasionId, 5);
        
        // Extract products from response
        const productsData = response.data || [];

        // Format products for card display
        const formattedProducts = productsData.map(product => 
          formatProductForCard(product, activeTabData.occasionName.toLowerCase())
        ).filter(Boolean);

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Failed to fetch products for occasion:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [activeTab, tabs]);

  const loading = loadingOccasions;
  const tabsToUse = tabs.length > 0 ? tabs : TABS;
  const activeTabId = activeTab || (tabsToUse[0]?.id);

  // Get current tab with dynamic products
  const currentTab = tabsToUse.find(t => t.id === activeTabId);
  const displayProducts = products.length > 0 ? products : currentTab?.products || [];

  return (
    <section className="w-full bg-white py-14" style={{ maxWidth: "1920px", margin: "0 auto" }}>
      <DesktopSection tabs={tabsToUse} activeTab={activeTabId} setActiveTab={setActiveTab} loading={loading} products={displayProducts} loadingProducts={loadingProducts} />
      <MobileSection tabs={tabsToUse} loading={loading} products={displayProducts} loadingProducts={loadingProducts} />
    </section>
  );
}