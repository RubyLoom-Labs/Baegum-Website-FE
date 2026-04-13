import { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

import slide1Desktop from "@/assets/banners/slide1-desktop.png";
import slide1Mobile  from "@/assets/banners/slide1-mobile.png";

import slide2Desktop from "@/assets/banners/slide2-desktop.png";
import slide2Mobile  from "@/assets/banners/slide1-mobile.png";

//import slide3Desktop from "@/assets/banners/slide3-desktop.jpg";
//import slide3Mobile  from "@/assets/banners/slide3-mobile.jpg";

// ─────────────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 1,
    desktop: slide1Desktop,
    mobile:  slide1Mobile,
    alt:     "Solar Shades — Hot Looks. Vivid Vibes.",
    href:    "#",          // link when banner is clicked
  },
  {
    id: 2,
    desktop: slide2Desktop,
    mobile:  slide2Mobile,
    alt:     "Banner Slide 2",
    href:    "#",
  },/*
  {
    id: 3,
    desktop: slide3Desktop,
    mobile:  slide3Mobile,
    alt:     "Banner Slide 3",
    href:    "#",
  },*/
];

// Milliseconds each slide stays before auto-advancing
const AUTOPLAY_DELAY = 4000;
 
// ── Arrow icons ───────────────────────────────────────────────────────────────
 
const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
 
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
 
// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
 
export default function HeroBanner() {
  const [current,   setCurrent]   = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef(null);
  const total = SLIDES.length;
 
  // ── Navigation ─────────────────────────────────────────────────────────────
 
  const goTo = useCallback((index) => {
    setCurrent((index + total) % total);
  }, [total]);
 
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
 
  // ── Autoplay ───────────────────────────────────────────────────────────────
 
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTOPLAY_DELAY);
  }, [total]);
 
  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);
 
  // ── Swipe / drag ───────────────────────────────────────────────────────────
 
  const onDragStart = (clientX) => {
    setDragStart(clientX);
    setIsDragging(false);
  };
 
  const onDragMove = (clientX) => {
    if (dragStart !== null && Math.abs(clientX - dragStart) > 5) {
      setIsDragging(true);
    }
  };
 
  const onDragEnd = (clientX) => {
    if (dragStart === null) return;
    const diff = dragStart - clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetTimer();
    }
    setDragStart(null);
    setTimeout(() => setIsDragging(false), 0);
  };
 
  // ── Keyboard ───────────────────────────────────────────────────────────────
 
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  { prev(); resetTimer(); }
      if (e.key === "ArrowRight") { next(); resetTimer(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, resetTimer]);
 
  const handleArrowClick = (fn) => { fn(); resetTimer(); };
 
  // ── Render ─────────────────────────────────────────────────────────────────
 
  return (
    <section
      className="relative w-full overflow-hidden select-none mx-auto"
      style={{ maxWidth: "1920px", maxHeight: "650px" }}
      aria-label="Hero banner"
      // Mouse
      onMouseDown={(e)  => onDragStart(e.clientX)}
      onMouseMove={(e)  => onDragMove(e.clientX)}
      onMouseUp={(e)    => onDragEnd(e.clientX)}
      onMouseLeave={()  => setDragStart(null)}
      // Touch
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e)  => onDragMove(e.touches[0].clientX)}
      onTouchEnd={(e)   => onDragEnd(e.changedTouches[0].clientX)}
    >
 
      {/* ── Slides track ─────────────────────────────────────────── */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <a
            key={slide.id}
            href={slide.href}
            className="relative flex-shrink-0 w-full block"
            draggable={false}
            onClick={(e) => isDragging && e.preventDefault()}
          >
            {/* Desktop */}
            <img
              src={slide.desktop}
              alt={slide.alt}
              className="hidden md:block w-full object-cover object-center h-[75vh]"
              style={{ maxHeight: "100vh" }}
              draggable={false}
            />
            {/* Mobile */}
            <img
              src={slide.mobile}
              alt={slide.alt}
              className="block md:hidden w-full h-[60vh] object-cover object-center"
              draggable={false}
            />
          </a>
        ))}
      </div>
 
      {/* ── Arrows — desktop only ─────────────────────────────────── */}
      {total > 1 && (
        <>
          {/*<button
            onClick={() => handleArrowClick(prev)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 items-center justify-center rounded-full
                       bg-white/70 hover:bg-white text-[#1a1a1a]
                       shadow-md transition-all duration-200 hover:scale-105"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>/}
 
          {/*<button
            onClick={() => handleArrowClick(next)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 items-center justify-center rounded-full
                       bg-white/70 hover:bg-white text-[#1a1a1a]
                       shadow-md transition-all duration-200 hover:scale-105"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>*/}
        </>
      )}
 
      {/* ── Dot indicators ───────────────────────────────────────── */}
      {/*{total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 h-2 bg-white"               // active — pill
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            /> 
          ))}
        </div>
      )}*/}
 
    </section>
  );
}
 