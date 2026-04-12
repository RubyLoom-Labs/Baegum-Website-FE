import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPromos } from "@/services/promo";

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

import promoBg1 from "@/assets/banners/promo/cream-set.png";
import promoBg2 from "@/assets/banners/promo/shampoo-set.png";
import promoBg3 from "@/assets/banners/promo/perfume-set.png";

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK DATA
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_PROMOS = [
  {
    id: 1,
    image:    promoBg1,
    alt:      "Luxurious Cream Set — Save 20% with code CREAMSET20",
    btnLabel: "Shop Now ....",
    btnBg:    "#1a1a1a",
    btnText:  "#ffffff",
    btnHoverBg: "#333333",
    href: "#",
  },
  {
    id: 2,
    image:    promoBg2,
    alt:      "Nourishing Shampoo Set — Save 20% with code HAIRSET20",
    btnLabel: "SHOP NOW ...",
    btnBg:    "#1a1a1a",
    btnText:  "#ffffff",
    btnHoverBg: "#333333",
    href: "#",
  },
  {
    id: 3,
    image:    promoBg3,
    alt:      "Luxurious Perfume Set — Save 20% with code SCENTSE20",
    btnLabel: "SHOP NOW ...",
    btnBg:    "#1a1a1a",
    btnText:  "#ffffff",
    btnHoverBg: "#333333",
    href: "#",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROMO CARD
// ─────────────────────────────────────────────────────────────────────────────

function PromoCard({ promo }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={promo.href}
      draggable={false}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block overflow-hidden "
    >
      {/* 1:1 square image */}
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        <img
          src={promo.image}
          alt={promo.alt}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover select-none"
        />

        {/* Shop Now — hidden by default, slides up on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 py-6 text-center text-[15px] font-medium tracking-wide"
          style={{
            backgroundColor: promo.btnBg,
            color:           promo.btnText,
            opacity:         hovered ? 1 : 0,
            transform:       hovered ? "translateY(0)" : "translateY(100%)",
            transition:      "opacity 0.3s ease, transform 0.3s ease",
            letterSpacing:   "0.04em",
          }}
        >
          {promo.btnLabel}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────

function MobileCarousel({ promos }) {
  const [current,    setCurrent]    = useState(0);
  const [dragStart,  setDragStart]  = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const total = promos.length;

  const goTo = useCallback((i) => setCurrent((i + total) % total), [total]);
  const next  = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev  = useCallback(() => goTo(current - 1), [current, goTo]);

  const onDragStart = (x) => { setDragStart(x); setIsDragging(false); };
  const onDragMove  = (x) => {
    if (dragStart !== null && Math.abs(x - dragStart) > 5) setIsDragging(true);
  };
  const onDragEnd = (x) => {
    if (dragStart === null) return;
    const diff = dragStart - x;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    setDragStart(null);
    setTimeout(() => setIsDragging(false), 0);
  };

  return (
    <div className="w-full">
      {/* Track */}
      <div
        className="overflow-hidden"
        onMouseDown={(e)  => onDragStart(e.clientX)}
        onMouseMove={(e)  => onDragMove(e.clientX)}
        onMouseUp={(e)    => onDragEnd(e.clientX)}
        onMouseLeave={()  => setDragStart(null)}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e)  => onDragMove(e.touches[0].clientX)}
        onTouchEnd={(e)   => onDragEnd(e.changedTouches[0].clientX)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="flex-shrink-0 w-full"
              onClick={(e) => isDragging && e.preventDefault()}
            >
              <PromoCard promo={promo} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {promos.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width:           i === current ? "20px" : "8px",
              height:          "8px",
              backgroundColor: i === current ? "#1a1a1a" : "#d1d5db",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function PromoBanners() {
  const [promos, setPromos] = useState(FALLBACK_PROMOS);
  const [loading, setLoading] = useState(true);

  // Fetch promo banners from backend on mount
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const response = await getPromos();

        // Handle different response formats
        let promosData = FALLBACK_PROMOS;
        if (response.data && Array.isArray(response.data.data)) {
          promosData = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          promosData = response.data;
        } else if (Array.isArray(response)) {
          promosData = response;
        }

        // Format promo data from API response
        const formattedPromos = Array.isArray(promosData)
          ? promosData.map((promo) => ({
              id: promo.id,
              image: promo.image || promo.banner_image || '',
              alt: promo.alt || promo.title || 'Promo Banner',
              btnLabel: promo.button_label || promo.btn_label || 'Shop Now',
              btnBg: promo.button_bg || promo.btn_bg || '#1a1a1a',
              btnText: promo.button_text || promo.btn_text || '#ffffff',
              btnHoverBg: promo.button_hover_bg || promo.btn_hover_bg || '#333333',
              href: promo.link || promo.url || promo.href || '#',
            }))
          : FALLBACK_PROMOS;

        setPromos(formattedPromos);
      } catch (error) {
        console.error('Failed to fetch promo banners:', error);
        // Use fallback data on error
        setPromos(FALLBACK_PROMOS);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  // Don't render anything while loading
  if (loading && promos === FALLBACK_PROMOS) {
    return null;
  }

  return (
    <section className="w-full py-10 pt-0 bg-white">

      {/* ── Desktop: 3 cols ─────────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 max-w-screen-xl mx-auto px-6">
        {promos.map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </div>

      {/* ── Mobile: full-width carousel ─────────────────────────── */}
      <div className="md:hidden">
        <MobileCarousel promos={promos} />
      </div>

    </section>
  );
}
