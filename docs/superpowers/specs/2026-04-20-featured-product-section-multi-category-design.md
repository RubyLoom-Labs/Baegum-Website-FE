# FeaturedProductSection — Multi-Category with Scroll-Driven Background

**Date:** 2026-04-20  
**File:** `src/pages/Home/sections/FeaturedProductSection.jsx`

---

## Overview

Update the existing `FeaturedProductSection` to show 5 categories inside the single existing scroll container (right white card). As the user scrolls through the product rows, the background image on the left (desktop) / above (mobile) crossfades to match the active category. Section height, layout, and structure stay exactly as they are today.

---

## Product Data

Replace the single `PRODUCTS` array with a `CATEGORIES` array. Each category has 2 products and a background image:

```js
const CATEGORIES = [
  { id: "clothing",  bg: bg1, variant: "clothing", href: "/clothing",  products: [/*2*/] },
  { id: "makeup",    bg: bg2, variant: "product",  href: "/makeup",    products: [/*2*/] },
  { id: "fragrance", bg: bg3, variant: "product",  href: "/fragrance", products: [/*2*/] },
  { id: "bath-body", bg: bg4, variant: "product",  href: "/bath-body", products: [/*2*/] },
  { id: "skincare",  bg: bg4, variant: "product",  href: "/skincare",  products: [/*2*/] },
];
```

Products are flat-mapped into a single list for rendering. Total: 10 cards in the grid.

**Asset mapping:**

| Category    | Background image                              | Product image                              |
|-------------|-----------------------------------------------|--------------------------------------------|
| Clothing    | `timeless-modal-bg-1.png`                     | `products/clothing/p1.png`                 |
| Makeup      | `timeless-modal-bg-2.png`                     | `products/makeup/p1.png`                   |
| Fragrance   | `timeless-modal-bg-3.png`                     | `products/fragrance/p1.png`                |
| Bath & Body | `timeless-modal-bg-4.png`                     | `products/bath-body/p1.png`                |
| Skincare    | `timeless-modal-bg-4.png` (fallback, no bg-5) | `products/skincare/p1.png`                 |

---

## Desktop Layout (unchanged structure)

Section stays `height: 90vh`. Background image and white card layout are identical to today.

**Background layer:**
Two absolutely-positioned `<div>`s stacked at `z-index: 0` behind the content. Active image: `opacity: 1`. Previous: `opacity: 0`. Transition: `opacity 600ms ease`.

```
<section style="position: relative">
  <div class="bg-layer" style="opacity: 1; backgroundImage: url(activeBg)" />
  <div class="bg-layer" style="opacity: 0; backgroundImage: url(prevBg)" />
  <div class="content" style="position: relative; z-index: 1">
    ...left spacer + right white card...
  </div>
</section>
```

**Right white card scroll container (unchanged):**
Same `overflow-y-auto` 2-col grid. 10 `ProductCard`s flow naturally. No dividers, no headers between categories.

The **first card of each category** receives a `ref` from `categoryRefs` array — used as the IntersectionObserver target.

---

## Scroll Detection (Desktop)

```js
const [activeBg, setActiveBg] = useState(bg1);
const [prevBg, setPrevBg]     = useState(bg1);
const scrollContainerRef      = useRef(null);  // the overflow-y-auto div
const categoryRefs            = useRef([]);     // 5 refs, one per category first card
```

One `IntersectionObserver` in `useEffect`:
- `root`: `scrollContainerRef.current` (the scroll container, not the page viewport)
- `threshold: 0.5`
- On entry: find lowest index of all currently intersecting entries → call `setActiveBg`

```js
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .map(e => Number(e.target.dataset.categoryIndex))
      .sort((a, b) => a - b);
    if (visible.length) {
      const idx = visible[0];
      setPrevBg(activeBg);
      setActiveBg(CATEGORIES[idx].bg);
    }
  }, { root: scrollContainerRef.current, threshold: 0.5 });

  categoryRefs.current.forEach(el => el && observer.observe(el));
  return () => observer.disconnect();
}, []);
```

Each first-card wrapper gets `ref={el => categoryRefs.current[i] = el}` and `data-category-index={i}`.

---

## Mobile Layout (unchanged structure)

Background image stays above the horizontal scroll row, same `height: 260px`. Same crossfade technique (two stacked divs, `opacity` transition).

The horizontal scroll container (`overflow-x: auto`) becomes the IntersectionObserver `root`. The first card of each category is observed. When it enters the horizontal viewport, `setActiveBg` fires.

No dot indicators or scroll-snap — mobile stays free-scrolling exactly as today.

---

## State

```js
const [activeBg, setActiveBg] = useState(CATEGORIES[0].bg);
const [prevBg, setPrevBg]     = useState(CATEGORIES[0].bg);
```

One shared state drives both desktop and mobile backgrounds. Two separate observers (one per layout, each with its own `root`).

---

## Out of Scope

- Real product data from API (placeholder data only)
- Category labels / dividers in the scroll area
- Dot indicators
- Keyboard navigation
- `timeless-modal-bg-5.png` (not yet available — Skincare uses bg-4 until added)
