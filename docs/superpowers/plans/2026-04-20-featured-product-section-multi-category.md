# FeaturedProductSection Multi-Category Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `FeaturedProductSection` so the single scroll container shows 2 products per category (Clothing → Makeup → Fragrance → Bath & Body → Skincare), and the background image crossfades to match the active category as the user scrolls — on both desktop (vertical) and mobile (horizontal).

**Architecture:** All changes are in one file. A `CATEGORIES` data array replaces the single `PRODUCTS` array. Background crossfade uses 5 absolutely-positioned `<div>`s (one per category) with `opacity` driven by `activeIndex` state. An `IntersectionObserver` rooted inside the scroll container watches the first card of each category; when it enters view, `activeIndex` updates and the correct bg fades in. Same approach for mobile horizontal scroll.

**Tech Stack:** React 18, Tailwind CSS, native IntersectionObserver API, Vite

> **Note:** No test framework is configured in this project (`package.json` has no Jest/Vitest). TDD steps are omitted — verify visually in the browser using `npm run dev`.

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/pages/Home/sections/FeaturedProductSection.jsx` |

No other files change.

---

### Task 1: Restructure imports and data

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Replace asset imports**

Replace the existing import block at the top of the file with:

```jsx
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";

// Background images
import bg1 from "@/assets/sections/timeless-modal-bg-1.png";
import bg2 from "@/assets/sections/timeless-modal-bg-2.png";
import bg3 from "@/assets/sections/timeless-modal-bg-3.png";
import bg4 from "@/assets/sections/timeless-modal-bg-4.png";

// Product images
import clothingImg from "@/assets/products/clothing/p1.png";
import makeupImg   from "@/assets/products/makeup/p1.png";
import fragranceImg from "@/assets/products/fragrance/p1.png";
import bathBodyImg  from "@/assets/products/bath-body/p1.png";
import skincareImg  from "@/assets/products/skincare/p1.png";
```

- [ ] **Step 2: Replace data constants**

Remove `SECTION_TITLE`, remove `PRODUCTS`, and add `CATEGORIES` in their place:

```jsx
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
    bg: bg4,
    variant: "product",
    href: "/skincare",
    subtitle: "Gentle routines for glowing skin.",
    products: [
      { id: 9,  image: skincareImg, name: "Hydrating Serum", description: "Light, fast-absorbing serum.", price: "LKR 0000.00", href: "/products/skincare/1" },
      { id: 10, image: skincareImg, name: "Hydrating Serum", description: "Light, fast-absorbing serum.", price: "LKR 0000.00", href: "/products/skincare/2" },
    ],
  },
];
```

- [ ] **Step 3: Verify the app compiles**

```bash
npm run dev
```

Expected: dev server starts with no errors in the terminal. **The section background and mobile title will be visually broken** — `bgImage` and `SECTION_TITLE` are still referenced in JSX but no longer imported. This is expected and fixed in Tasks 2 and 5. No hard compile errors with Vite — just a broken visual.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "refactor: replace PRODUCTS with CATEGORIES data structure"
```

---

### Task 2: Add background crossfade state and layers

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Add state inside the component**

Inside `FeaturedProductSection()`, before the `return`, add:

```jsx
const [activeIndex, setActiveIndex] = useState(0);
```

- [ ] **Step 2: Replace the desktop background with crossfading layers**

The current desktop section opens like this:

```jsx
<div
  className="hidden md:flex w-full items-stretch"
  style={{
    height:             "90vh",
    backgroundImage:    `url(${bgImage})`,
    backgroundSize:     "cover",
    backgroundPosition: "center",
  }}
>
```

Replace it with a `position: relative` wrapper that holds the bg layers plus the existing content:

```jsx
<div
  className="hidden md:flex w-full items-stretch"
  style={{ height: "90vh", position: "relative" }}
>
  {/* Crossfading background layers */}
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

  {/* Content sits above the bg layers */}
  <div className="relative flex w-full items-stretch" style={{ zIndex: 1 }}>
```

Close this new `<div className="relative ...">` before the closing `</div>` of the desktop section (just before `{/* MOBILE */}`).

- [ ] **Step 3: Update the vertical subtitle to use the active category**

The left spacer currently shows a hardcoded subtitle. Replace the subtitle text with:

```jsx
{CATEGORIES[activeIndex].subtitle}
```

- [ ] **Step 4: Check in browser**

```bash
npm run dev
```

Expected: section shows the first background image (bg1). Subtitle updates when you manually change `useState(0)` to another index. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: add crossfade background layers to desktop section"
```

---

### Task 3: Render all 10 products in the desktop scroll grid

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Add refs for the scroll container and category sentinels**

Below `useState`, add:

```jsx
const desktopScrollRef  = useRef(null);
const desktopCategoryRefs = useRef([]);
```

- [ ] **Step 2: Replace the desktop product grid**

Find this block inside the white card:

```jsx
<div className="grid grid-cols-2 gap-4">
  {PRODUCTS.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      variant="clothing"
    />
  ))}
</div>
```

Replace with:

```jsx
<div className="grid grid-cols-2 gap-4">
  {CATEGORIES.flatMap((cat, catIdx) =>
    cat.products.map((product, prodIdx) => {
      const isFirstInCategory = prodIdx === 0;
      return (
        <div
          key={product.id}
          ref={isFirstInCategory ? (el) => { desktopCategoryRefs.current[catIdx] = el; } : undefined}
          data-category-index={isFirstInCategory ? catIdx : undefined}
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
```

- [ ] **Step 3: Attach ref to the scroll container**

Find the `overflow-y-auto` div (the one with `scrollbarWidth: "thin"`) and add `ref={desktopScrollRef}`:

```jsx
<div
  ref={desktopScrollRef}
  className="h-full overflow-y-auto"
  style={{
    scrollbarWidth: "thin",
    scrollbarColor: "#e5e7eb transparent",
    padding:        "16px",
  }}
>
```

- [ ] **Step 4: Check in browser**

```bash
npm run dev
```

Expected: the white card now shows 10 product cards across 5 category groups. All use the correct variant (clothing cards are portrait, others are square). Background is still static at index 0.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: render 10 products across 5 categories in desktop grid"
```

---

### Task 4: Wire up desktop IntersectionObserver

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Add the desktop useEffect**

After the refs, add:

```jsx
useEffect(() => {
  const root = desktopScrollRef.current;
  if (!root) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .map((e) => Number(e.target.dataset.categoryIndex))
        .sort((a, b) => a - b);
      if (visible.length > 0) {
        setActiveIndex(visible[0]);
      }
    },
    { root, threshold: 0.5 }
  );

  desktopCategoryRefs.current.forEach((el) => el && observer.observe(el));
  return () => observer.disconnect();
}, []);
```

- [ ] **Step 2: Test in browser**

```bash
npm run dev
```

Expected: 
- Page loads with the Clothing background (bg1).
- Scroll down inside the white card — when the Makeup first card is 50% visible, the background crossfades to bg2.
- Continue scrolling — Fragrance triggers bg3, Bath & Body triggers bg4, Skincare stays on bg4.
- Scroll back up — background returns to the appropriate category.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: add desktop IntersectionObserver for scroll-driven bg crossfade"
```

---

### Task 5: Update mobile layout with crossfading background

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Add mobile refs**

Add below the desktop refs:

```jsx
const mobileScrollRef     = useRef(null);
const mobileCategoryRefs  = useRef([]);
```

- [ ] **Step 2: Replace the mobile background image div**

Find this block in the mobile section:

```jsx
<div
  className="w-full relative overflow-hidden"
  style={{
    height:             "260px",
    backgroundImage:    `url(${bgImage})`,
    backgroundSize:     "cover",
    backgroundPosition: "right right",
  }}
/>
```

Replace it with:

```jsx
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
```

- [ ] **Step 3: Replace the mobile title**

Find:

```jsx
<h2 className="text-[19px] font-light text-[#1a1a1a] tracking-wide">
  {SECTION_TITLE}
</h2>
```

Replace with:

```jsx
<h2 className="text-[19px] font-light text-[#1a1a1a] tracking-wide capitalize">
  {CATEGORIES[activeIndex].id.replace("-", " & ")}
</h2>
```

- [ ] **Step 4: Replace the mobile product cards**

Find the existing `PRODUCTS.map(...)` block in the mobile section and replace the entire horizontal scroll container with:

```jsx
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
      const isFirstInCategory = prodIdx === 0;
      return (
        <div
          key={product.id}
          ref={isFirstInCategory ? (el) => { mobileCategoryRefs.current[catIdx] = el; } : undefined}
          data-category-index={isFirstInCategory ? catIdx : undefined}
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
```

- [ ] **Step 5: Check mobile in browser**

Open DevTools → toggle mobile view (e.g. iPhone 12 Pro).

Expected: 10 cards in the horizontal row. Background image is visible above. Title shows "clothing". Swiping through cards changes nothing yet (observer not wired).

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: update mobile layout with crossfade bg and all 10 products"
```

---

### Task 6: Wire up mobile IntersectionObserver

**Files:**
- Modify: `src/pages/Home/sections/FeaturedProductSection.jsx`

- [ ] **Step 1: Add the mobile useEffect**

Add a second `useEffect` directly after the desktop one:

```jsx
useEffect(() => {
  const root = mobileScrollRef.current;
  if (!root) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .map((e) => Number(e.target.dataset.categoryIndex))
        .sort((a, b) => a - b);
      if (visible.length > 0) {
        setActiveIndex(visible[0]);
      }
    },
    { root, threshold: 0.5 }
  );

  mobileCategoryRefs.current.forEach((el) => el && observer.observe(el));
  return () => observer.disconnect();
}, []);
```

- [ ] **Step 2: Final browser test — desktop**

```bash
npm run dev
```

Desktop checklist:
- [ ] Loads with bg1 (Clothing background)
- [ ] Scroll down in white card → bg crossfades at each category boundary
- [ ] Scrolling back up reverses the bg correctly
- [ ] Vertical subtitle updates to match active category
- [ ] No console errors

- [ ] **Step 3: Final browser test — mobile**

Open DevTools → iPhone 12 Pro (390px wide).

Mobile checklist:
- [ ] Background image visible above cards
- [ ] Swipe right through cards → bg crossfades when Makeup first card enters view
- [ ] Title below bg updates to match category
- [ ] "View All" arrow links to active category page
- [ ] No console errors

- [ ] **Step 4: Final commit**

```bash
git add src/pages/Home/sections/FeaturedProductSection.jsx
git commit -m "feat: add mobile IntersectionObserver for horizontal scroll bg crossfade"
```

---

## Done

The `FeaturedProductSection` now shows 10 products across 5 categories in a single continuous scroll. Background images crossfade on both desktop (vertical scroll) and mobile (horizontal scroll) as each category comes into view.

When `timeless-modal-bg-5.png` is added to `src/assets/sections/`, update the Skincare entry in `CATEGORIES` to import and use it.
