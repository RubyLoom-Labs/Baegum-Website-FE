# FeaturedProductSection Multi-Category Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-category `FeaturedProductSection` with a 5-category scroll experience where each category has its own background image that crossfades as the user scrolls (desktop) or swipes (mobile).

**Architecture:** A single sticky background layer crossfades between 5 background images driven by `activeIndex` state. On desktop, 5 full-height sections stack vertically over the sticky bg; an `IntersectionObserver` updates `activeIndex` as each section enters the viewport. On mobile, a horizontal scroll-snap carousel drives `activeIndex` via a second `IntersectionObserver` scoped to the carousel container.

**Tech Stack:** React 18, Tailwind CSS, vanilla `IntersectionObserver` API, React Router `Link`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/pages/Home/sections/FeaturedProductSection.jsx` | Modify | Full rewrite — data, state, desktop layout, mobile layout |

No new files are needed.

---

### Task 1: Replace imports and add CATEGORIES data

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Replace the top of the file** with the new imports and CATEGORIES array.

Replace everything from line 1 through the closing `];` of the `PRODUCTS` array (lines 1–31) with:

```jsx
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";

import bg0 from "@/assets/sections/timeless-modal-bg.png";
import bg1 from "@/assets/sections/timeless-modal-bg-1.png";
import bg2 from "@/assets/sections/timeless-modal-bg-2.png";
import bg3 from "@/assets/sections/timeless-modal-bg-3.png";
import bg4 from "@/assets/sections/timeless-modal-bg-4.png";

import clothingImg   from "@/assets/products/clothing/p1.png";
import makeupImg     from "@/assets/products/makeup/p1.png";
import fragranceImg  from "@/assets/products/fragrance/p1.png";
import bathBodyImg   from "@/assets/products/bath-body/p1.png";
import skincareImg   from "@/assets/products/skincare/p1.png";

const CATEGORIES = [
  {
    id: "clothing",
    title: "Timeless Modal",
    subtitle: "Sleeveless, fitted beige dress with a V-neck.",
    bgImage: bg0,
    href: "/clothing",
    variant: "clothing",
    products: [
      { id: 1, image: clothingImg, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/1" },
      { id: 2, image: clothingImg, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/2" },
      { id: 3, image: clothingImg, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/3" },
      { id: 4, image: clothingImg, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/4" },
      { id: 5, image: clothingImg, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/5" },
      { id: 6, image: clothingImg, name: "Oatmeal V-Neck Dress", description: "Sleeveless, fitted beige dress with a V-neck.", price: "LKR 0000.00", href: "/products/clothing/6" },
    ],
  },
  {
    id: "makeup",
    title: "Makeup",
    subtitle: "Bold looks for every occasion.",
    bgImage: bg1,
    href: "/makeup",
    variant: "product",
    products: [
      { id: 1, image: makeupImg, name: "Velvet Lip Cream", description: "Long-lasting matte finish.", price: "LKR 0000.00", href: "/products/makeup/1" },
      { id: 2, image: makeupImg, name: "Velvet Lip Cream", description: "Long-lasting matte finish.", price: "LKR 0000.00", href: "/products/makeup/2" },
      { id: 3, image: makeupImg, name: "Velvet Lip Cream", description: "Long-lasting matte finish.", price: "LKR 0000.00", href: "/products/makeup/3" },
      { id: 4, image: makeupImg, name: "Velvet Lip Cream", description: "Long-lasting matte finish.", price: "LKR 0000.00", href: "/products/makeup/4" },
      { id: 5, image: makeupImg, name: "Velvet Lip Cream", description: "Long-lasting matte finish.", price: "LKR 0000.00", href: "/products/makeup/5" },
      { id: 6, image: makeupImg, name: "Velvet Lip Cream", description: "Long-lasting matte finish.", price: "LKR 0000.00", href: "/products/makeup/6" },
    ],
  },
  {
    id: "fragrance",
    title: "Fragrance",
    subtitle: "Scents that linger all day long.",
    bgImage: bg2,
    href: "/fragrance",
    variant: "product",
    products: [
      { id: 1, image: fragranceImg, name: "Oud Noir Parfum", description: "Woody, warm, oriental notes.", price: "LKR 0000.00", href: "/products/fragrance/1" },
      { id: 2, image: fragranceImg, name: "Oud Noir Parfum", description: "Woody, warm, oriental notes.", price: "LKR 0000.00", href: "/products/fragrance/2" },
      { id: 3, image: fragranceImg, name: "Oud Noir Parfum", description: "Woody, warm, oriental notes.", price: "LKR 0000.00", href: "/products/fragrance/3" },
      { id: 4, image: fragranceImg, name: "Oud Noir Parfum", description: "Woody, warm, oriental notes.", price: "LKR 0000.00", href: "/products/fragrance/4" },
      { id: 5, image: fragranceImg, name: "Oud Noir Parfum", description: "Woody, warm, oriental notes.", price: "LKR 0000.00", href: "/products/fragrance/5" },
      { id: 6, image: fragranceImg, name: "Oud Noir Parfum", description: "Woody, warm, oriental notes.", price: "LKR 0000.00", href: "/products/fragrance/6" },
    ],
  },
  {
    id: "bath-body",
    title: "Bath & Body",
    subtitle: "Nourish and refresh your skin.",
    bgImage: bg3,
    href: "/bath-body",
    variant: "product",
    products: [
      { id: 1, image: bathBodyImg, name: "Shea Body Lotion", description: "Deep moisture for soft skin.", price: "LKR 0000.00", href: "/products/bath-body/1" },
      { id: 2, image: bathBodyImg, name: "Shea Body Lotion", description: "Deep moisture for soft skin.", price: "LKR 0000.00", href: "/products/bath-body/2" },
      { id: 3, image: bathBodyImg, name: "Shea Body Lotion", description: "Deep moisture for soft skin.", price: "LKR 0000.00", href: "/products/bath-body/3" },
      { id: 4, image: bathBodyImg, name: "Shea Body Lotion", description: "Deep moisture for soft skin.", price: "LKR 0000.00", href: "/products/bath-body/4" },
      { id: 5, image: bathBodyImg, name: "Shea Body Lotion", description: "Deep moisture for soft skin.", price: "LKR 0000.00", href: "/products/bath-body/5" },
      { id: 6, image: bathBodyImg, name: "Shea Body Lotion", description: "Deep moisture for soft skin.", price: "LKR 0000.00", href: "/products/bath-body/6" },
    ],
  },
  {
    id: "skincare",
    title: "Skincare",
    subtitle: "Gentle care for a radiant glow.",
    bgImage: bg4,
    href: "/skincare",
    variant: "product",
    products: [
      { id: 1, image: skincareImg, name: "Hydra-Glow Serum", description: "24hr hydration with hyaluronic acid.", price: "LKR 0000.00", href: "/products/skincare/1" },
      { id: 2, image: skincareImg, name: "Hydra-Glow Serum", description: "24hr hydration with hyaluronic acid.", price: "LKR 0000.00", href: "/products/skincare/2" },
      { id: 3, image: skincareImg, name: "Hydra-Glow Serum", description: "24hr hydration with hyaluronic acid.", price: "LKR 0000.00", href: "/products/skincare/3" },
      { id: 4, image: skincareImg, name: "Hydra-Glow Serum", description: "24hr hydration with hyaluronic acid.", price: "LKR 0000.00", href: "/products/skincare/4" },
      { id: 5, image: skincareImg, name: "Hydra-Glow Serum", description: "24hr hydration with hyaluronic acid.", price: "LKR 0000.00", href: "/products/skincare/5" },
      { id: 6, image: skincareImg, name: "Hydra-Glow Serum", description: "24hr hydration with hyaluronic acid.", price: "LKR 0000.00", href: "/products/skincare/6" },
    ],
  },
];
```

- [ ] **Step 2: Verify the dev server compiles without errors**

Run: `npm run dev`  
Expected: No import errors in the terminal. Open `http://localhost:5173` — page loads (section may be blank, that's fine).

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: add multi-category data structure to FeaturedProductSection"
```

---

### Task 2: Add state, refs, and IntersectionObservers

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Replace the component opening** (currently `export default function FeaturedProductSection() {` with an empty return) with the state, refs, and two `useEffect` hooks:

```jsx
export default function FeaturedProductSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const desktopRefs = useRef([]);
  const mobileRefs  = useRef([]);
  const carouselRef = useRef(null);

  // Desktop observer — uses viewport as root
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = desktopRefs.current.indexOf(entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    desktopRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  // Mobile observer — scoped to the carousel container
  useEffect(() => {
    if (!carouselRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = mobileRefs.current.indexOf(entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: carouselRef.current, threshold: 0.5 }
    );
    mobileRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full overflow-hidden" style={{ maxWidth: "1920px", margin: "0 auto" }}>
      {/* desktop and mobile layouts go here in later tasks */}
    </section>
  );
}
```

- [ ] **Step 2: Verify the dev server still compiles**

Run: `npm run dev`  
Expected: No errors in terminal. The section renders as empty white space on the page — that's expected.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: add activeIndex state and IntersectionObserver hooks"
```

---

### Task 3: Build the desktop layout

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Replace the `{/* desktop and mobile layouts go here in later tasks */}` comment** inside the `<section>` with the full desktop block:

```jsx
      {/* ══ DESKTOP ══════════════════════════════════════════════════ */}
      <div
        className="hidden md:block relative"
        style={{ height: `${CATEGORIES.length * 90}vh` }}
      >
        {/* Sticky background — all 5 images stacked, opacity drives crossfade */}
        <div className="sticky top-0 h-screen" style={{ zIndex: 0 }}>
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className="absolute inset-0"
              style={{
                backgroundImage:    `url(${cat.bgImage})`,
                backgroundSize:     "cover",
                backgroundPosition: "center",
                opacity:            activeIndex === i ? 1 : 0,
                transition:         "opacity 0.8s ease",
              }}
            />
          ))}
        </div>

        {/* Scrolling content — negative margin pulls it up over the sticky bg */}
        <div className="relative" style={{ marginTop: "-100vh", zIndex: 1 }}>
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              ref={(el) => (desktopRefs.current[i] = el)}
              className="flex w-full items-stretch"
              style={{ height: "90vh" }}
            >
              {/* Left spacer with rotated subtitle */}
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
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              {/* Right white card */}
              <div
                className="overflow-hidden border border-gray-200 bg-white rounded-md shadow-lg flex flex-col"
                style={{ width: "48%", margin: "60px 60px 60px 0" }}
              >
                <div
                  className="h-full overflow-y-auto"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#e5e7eb transparent",
                    padding:        "16px",
                  }}
                >
                  <h2 className="text-[19px] font-light text-[#1a1a1a] tracking-wide mb-4">
                    {cat.title}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {cat.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variant={cat.variant}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* mobile placeholder — added in Task 4 */}
```

- [ ] **Step 2: Close the section tag** — make sure the JSX ends with:

```jsx
    </section>
  );
}
```

- [ ] **Step 3: Open the dev server on a desktop viewport and verify**

Run: `npm run dev`  
Expected:
- Section is `5 × 90vh` tall
- First category background (clothing) is visible
- White product card panel floats on the right with 6 clothing product cards
- Scrolling down changes the background image and product cards for each category
- Crossfade is smooth (~0.8s)

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: add desktop sticky-bg + scrolling category sections"
```

---

### Task 4: Build the mobile layout

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Replace the `{/* mobile placeholder — added in Task 4 */}` comment** with the full mobile block (place it directly after the desktop `</div>` closing tag, before `</section>`):

```jsx
      {/* ══ MOBILE ════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col">

        {/* Background image area — all 5 images stacked, opacity crossfade */}
        <div className="w-full relative overflow-hidden" style={{ height: "260px" }}>
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className="absolute inset-0"
              style={{
                backgroundImage:    `url(${cat.bgImage})`,
                backgroundSize:     "cover",
                backgroundPosition: "center",
                opacity:            activeIndex === i ? 1 : 0,
                transition:         "opacity 0.8s ease",
              }}
            />
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 py-3 bg-white">
          {CATEGORIES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-colors duration-300"
              style={{
                width:           "6px",
                height:          "6px",
                backgroundColor: activeIndex === i ? "#1a1a1a" : "transparent",
                border:          activeIndex === i ? "none" : "1px solid #d1d5db",
              }}
            />
          ))}
        </div>

        {/* Horizontal scroll-snap carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto bg-white"
          style={{
            scrollSnapType:          "x mandatory",
            scrollbarWidth:          "none",
            msOverflowStyle:         "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              ref={(el) => (mobileRefs.current[i] = el)}
              className="flex-shrink-0 flex flex-col"
              style={{ width: "100vw", scrollSnapAlign: "start" }}
            >
              {/* Category title */}
              <div className="px-4 pt-5 pb-3">
                <h2 className="text-[19px] font-light text-[#1a1a1a] tracking-wide">
                  {cat.title}
                </h2>
              </div>

              {/* Horizontal product cards */}
              <div
                className="flex gap-3 overflow-x-auto pb-5 px-4"
                style={{
                  scrollbarWidth:          "none",
                  msOverflowStyle:         "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {cat.products.map((product) => (
                  <div key={product.id} className="flex-shrink-0" style={{ width: "155px" }}>
                    <ProductCard product={product} variant={cat.variant} />
                  </div>
                ))}

                {/* View All pill */}
                <div className="flex-shrink-0 flex items-center justify-center px-2">
                  <Link to={cat.href} className="flex flex-col items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-full border border-gray-300
                                 flex items-center justify-center hover:border-[#1a1a1a]
                                 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                      >
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
          ))}
        </div>
      </div>
```

- [ ] **Step 2: Verify on mobile viewport in browser**

Open DevTools → toggle device toolbar → pick a mobile device (e.g. iPhone 12, 390px wide).  
Expected:
- Background image (260px) visible at top
- 5 dots below the image, first dot filled black
- Carousel shows "Timeless Modal" slide with 6 clothing cards + View All pill
- Swiping left moves to "Makeup" slide, background image crossfades, second dot fills
- Swiping through all 5 categories each changes the background image and dot

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: add mobile horizontal carousel with crossfading background"
```

---

### Task 5: Cross-browser polish and final verification

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Add the `::webkit-scrollbar` hide rule for mobile carousel inner scroll**

The inner product card scroll (`overflow-x-auto` inside each slide) needs `scrollbarWidth: "none"` already set. Verify it's present — it was added in Task 4. No code change needed if already there.

- [ ] **Step 2: Desktop scroll verification checklist**

With dev server running, resize to desktop (≥768px):
- [ ] Scroll slowly through all 5 sections — each background crossfades smoothly
- [ ] Each white card shows the correct category title at the top
- [ ] Product cards render correctly (clothing uses portrait ratio, others use square)
- [ ] White card is scrollable when products overflow
- [ ] Vertical subtitle text is readable on the left edge

- [ ] **Step 3: Mobile scroll verification checklist**

With DevTools mobile emulation (390px):
- [ ] Swipe through all 5 category slides
- [ ] Background image changes for each slide with smooth fade
- [ ] Active dot updates as you swipe
- [ ] Inner product card horizontal scroll works independently within each slide
- [ ] "View All" pill is visible at the end of each category's card row
- [ ] No horizontal overflow on the page itself

- [ ] **Step 4: Final commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: complete FeaturedProductSection multi-category with crossfading backgrounds"
```
