# FeaturedProductSection — Multi-Category Scroll with Crossfading Backgrounds

**Date:** 2026-04-20  
**File:** `src/pages/Home/sections/FeaturedProductSection.jsx`

---

## Overview

Extend the existing `FeaturedProductSection` to display 5 product categories (Clothing, Makeup, Fragrance, Bath & Body, Skincare), each with its own background image. On desktop, categories are stacked vertically and the background crossfades as the user scrolls. On mobile, categories are a horizontal swipe carousel with the background image crossfading at the top as the user swipes.

---

## Data Structure

Replace the single `PRODUCTS` array with a `CATEGORIES` array:

```js
const CATEGORIES = [
  {
    id: "clothing",
    title: "Timeless Modal",
    bgImage: timelessModalBg,       // timeless-modal-bg.png (existing)
    href: "/clothing",
    products: [ /* 6 clothing products */ ],
  },
  {
    id: "makeup",
    title: "Makeup",
    bgImage: bg1,                   // timeless-modal-bg-1.png
    href: "/makeup",
    products: [ /* 6 makeup products */ ],
  },
  {
    id: "fragrance",
    title: "Fragrance",
    bgImage: bg2,                   // timeless-modal-bg-2.png
    href: "/fragrance",
    products: [ /* 6 fragrance products */ ],
  },
  {
    id: "bath-body",
    title: "Bath & Body",
    bgImage: bg3,                   // timeless-modal-bg-3.png
    href: "/bath-body",
    products: [ /* 6 bath-body products */ ],
  },
  {
    id: "skincare",
    title: "Skincare",
    bgImage: bg4,                   // timeless-modal-bg-4.png
    href: "/skincare",
    products: [ /* 6 skincare products */ ],
  },
];
```

Each product object keeps the same shape: `{ id, image, name, description, price, href }`.

---

## Desktop Layout

### Approach: Sticky background layer + scrolling content layer

**Outer wrapper**
- `position: relative`
- Total height: `5 × 90vh = 450vh`

**Layer 1 — Sticky background** (renders first, sits behind)
- `position: sticky; top: 0; height: 100vh; z-index: 0`
- Contains 5 `<div>` elements, each `position: absolute; inset: 0; background-image: url(...); background-size: cover; background-position: center`
- Active category: `opacity: 1`, all others: `opacity: 0`
- Transition: `opacity 0.8s ease` on all

**Layer 2 — Scrolling content** (renders on top)
- `position: relative; z-index: 1; margin-top: -100vh` — negative margin pulls this layer up to overlap the sticky bg
- 5 category sections stacked vertically, each `height: 90vh; background: transparent`
- Each section has the same internal layout as today:
  - Left side: transparent spacer with rotated vertical subtitle text (category description)
  - Right side: white card box (`width: 48%; margin: 60px 60px 60px 0`)
    - Category title at the top of the card (`h2`, light font)
    - Scrollable 2-column `ProductCard` grid below (`variant="clothing"` for clothing, `variant="product"` for others)

**IntersectionObserver** (in `useEffect`)
- Observes each of the 5 section `<div>` refs
- `threshold: 0.5` — fires when section is ≥50% visible
- On intersection: `setActiveIndex(i)` → drives background opacity

---

## Mobile Layout

### Approach: Fixed-height background + horizontal scroll-snap carousel

**Background image area**
- `height: 260px; position: relative; overflow: hidden`
- Contains 5 absolutely-positioned background divs, same crossfade technique as desktop
- `activeIndex` drives which image is visible

**Dot indicators**
- Row of 5 small dots directly below the background image area
- Active dot: filled (`bg-[#1a1a1a]`), inactive: outlined (`border border-gray-300`)
- `width: 6px; height: 6px; border-radius: 50%`

**Horizontal carousel**
- `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none`
- 5 slides side by side, each `width: 100vw; flex-shrink: 0; scroll-snap-align: start`
- Each slide contains:
  - Category title (`px-4 pt-5 pb-3; text-[19px] font-light`)
  - Horizontal scrollable product cards (`overflow-x: auto; pb-5 px-4; gap-3`), each card `width: 155px; flex-shrink: 0`
  - "View All" pill at the end of cards (arrow icon + "View All" label, links to `category.href`)

**IntersectionObserver** (same `useEffect`, reuses slide refs)
- Observes each slide with `threshold: 0.5`
- On intersection: `setActiveIndex(i)` → updates background + dots

---

## State

```js
const [activeIndex, setActiveIndex] = useState(0);
const desktopRefs = useRef([]);   // refs for the 5 desktop category sections
const mobileRefs  = useRef([]);   // refs for the 5 mobile carousel slides
const carouselRef = useRef(null); // ref for the mobile scroll container (IntersectionObserver root)
```

Two separate `IntersectionObserver` instances in `useEffect`:
- **Desktop observer** — observes `desktopRefs`, default root (viewport), `threshold: 0.5`
- **Mobile observer** — observes `mobileRefs`, `root: carouselRef.current`, `threshold: 0.5`

Both call `setActiveIndex(i)` on intersection, so the same state drives both backgrounds.

---

## Component Structure

```
FeaturedProductSection
├── <section> (outer, overflow-hidden, maxWidth 1920px)
│   │
│   ├── Desktop wrapper (hidden md:block → relative, height 450vh)
│   │   ├── StickyBackground (sticky, 5 bg divs, opacity-driven)
│   │   └── ContentLayer (absolute, 5 × CategorySection)
│   │       └── CategorySection (90vh, transparent bg, left spacer + right card)
│   │
│   └── Mobile wrapper (md:hidden → flex flex-col)
│       ├── BackgroundArea (260px, 5 bg divs, opacity-driven)
│       ├── DotIndicators (row of 5 dots)
│       └── Carousel (flex, overflow-x scroll-snap, 5 slides)
│           └── CategorySlide (100vw, title + cards + view-all)
```

---

## Assets

| Category   | Background image                          | Product image (placeholder)               |
|------------|-------------------------------------------|-------------------------------------------|
| Clothing   | `src/assets/sections/timeless-modal-bg.png`   | `src/assets/products/clothing/p1.png`     |
| Makeup     | `src/assets/sections/timeless-modal-bg-1.png` | `src/assets/products/makeup/p1.png`       |
| Fragrance  | `src/assets/sections/timeless-modal-bg-2.png` | `src/assets/products/fragrance/p1.png`    |
| Bath & Body| `src/assets/sections/timeless-modal-bg-3.png` | `src/assets/products/bath-body/p1.png`    |
| Skincare   | `src/assets/sections/timeless-modal-bg-4.png` | `src/assets/products/skincare/p1.png`     |

---

## Out of Scope

- Fetching real product data from an API (placeholder data only)
- Animated dot transition beyond opacity
- Keyboard navigation for the carousel
