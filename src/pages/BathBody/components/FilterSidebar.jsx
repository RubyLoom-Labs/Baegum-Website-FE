import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FILTERS PER CATEGORY
// Replace options with real data from API later
// ─────────────────────────────────────────────────────────────────────────────

export const FILTERS_BY_CATEGORY = {

  clothing: [
    { id: "size", label: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    { id: "color", label: "Color", options: ["Black", "White", "Beige", "Brown", "Navy", "Rust", "Cream"] },
    { id: "fit", label: "Fit", options: ["Slim Fit", "Regular Fit", "Loose Fit", "Oversized"] },
    { id: "occasion", label: "Occasion", options: ["Casual", "Formal", "Party", "Work", "Weekend"] },
    { id: "price", label: "Price", options: ["Under Rs.2000", "Rs.2000–5000", "Rs.5000–10000", "Over Rs.10000"] },
  ],

  fragrance: [
    { id: "type", label: "Type", options: ["Eau de Parfum", "Eau de Toilette", "Body Mist"] },
    { id: "scent", label: "Scent", options: ["Floral", "Woody", "Fresh", "Oriental"] },
    { id: "size", label: "Size (ml)", options: ["30ml", "50ml", "100ml"] },
    { id: "brand", label: "Brand", options: ["BAEGUM", "Velora", "Luxe"] },
    { id: "price", label: "Price", options: ["Under Rs.2000", "Rs.2000–5000", "Over Rs.5000"] },
  ],

  makeup: [
    { id: "type", label: "Type", options: ["Lipstick", "Foundation", "Mascara", "Blush", "Eyeshadow"] },
    { id: "shade", label: "Shade", options: ["Light", "Medium", "Dark"] },
    { id: "brand", label: "Brand", options: ["BAEGUM", "Luxe"] },
    { id: "price", label: "Price", options: ["Under Rs.1000", "Rs.1000–3000", "Over Rs.3000"] },
  ],

  skincare: [
    { id: "type", label: "Type", options: ["Moisturizer", "Serum", "Cleanser", "Toner", "SPF"] },
    { id: "skin", label: "Skin Type", options: ["Dry", "Oily", "Combination", "Sensitive"] },
    { id: "concern", label: "Concern", options: ["Anti-aging", "Brightening", "Hydration", "Acne"] },
    { id: "price", label: "Price", options: ["Under Rs.1500", "Rs.1500–4000", "Over Rs.4000"] },
  ],

  "bath-body": [
    { id: "type", label: "Type", options: ["Body Wash", "Lotion", "Scrub", "Oil", "Bath Soak"] },
    { id: "scent", label: "Scent", options: ["Lavender", "Rose", "Vanilla", "Citrus", "Unscented"] },
    { id: "price", label: "Price", options: ["Under Rs.1000", "Rs.1000–3000", "Over Rs.3000"] },
  ],

  brands: [
    { id: "brand", label: "Brand", options: ["BAEGUM", "Velora", "Luxe", "Classic Modal"] },
    { id: "category", label: "Category", options: ["Clothing", "Fragrance", "Makeup", "Skincare"] },
    { id: "price", label: "Price", options: ["Under Rs.2000", "Rs.2000–5000", "Over Rs.5000"] },
  ],

  "best-sellers": [
    { id: "category", label: "Category", options: ["Clothing", "Fragrance", "Makeup", "Skincare", "Bath & Body"] },
    { id: "price", label: "Price", options: ["Under Rs.2000", "Rs.2000–5000", "Over Rs.5000"] },
  ],
};

// ── Icons ─────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// FILTER GROUP  (accordion item)
// ─────────────────────────────────────────────────────────────────────────────

function FilterGroup({ group, selected, onToggle }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <span className="text-[13px] font-medium text-[#1a1a1a] tracking-wide">
          {group.label}
        </span>
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="pb-3 flex flex-col gap-2">
          {group.options.map((opt) => {
            const key = `${group.id}:${opt}`;
            const checked = selected.includes(key);
            return (
              <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(key)}
                  className="w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer"
                />
                <span className="text-[12px] text-gray-600 group-hover:text-[#1a1a1a]
                                 transition-colors font-light">
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER SIDEBAR
//
//  Props:
//    category  — string matching a key in FILTERS_BY_CATEGORY
//    selected  — array of "groupId:option" strings
//    onToggle  — fn(key) toggles a filter on/off
//    onClear   — fn() clears all filters
//    onClose   — fn() closes the sidebar
//    isMobile  — bool (optional)
// ─────────────────────────────────────────────────────────────────────────────

export default function FilterSidebar({ category, selected, onToggle, onClear, onClose, isMobile }) {

  // Pick the right filter groups for this category
  const groups = FILTERS_BY_CATEGORY[category] || [];

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <span className="text-[14px] font-semibold text-[#1a1a1a] tracking-wide">
          Filters
        </span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600"
          aria-label="Close filters"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Active filter chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3 pb-2">
          {selected.map((key) => {
            const label = key.split(":")[1];
            return (
              <button
                key={key}
                onClick={() => onToggle(key)}
                className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full
                           text-[11px] text-gray-700 hover:bg-gray-200 transition-colors font-light"
              >
                ✕ {label}
              </button>
            );
          })}
          <button
            onClick={onClear}
            className="text-[11px] text-gray-400 hover:text-[#1a1a1a] underline
                       underline-offset-2 transition-colors self-center ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter groups — scrollable */}
      <div className="flex-1 overflow-y-auto mt-1">
        {groups.length > 0 ? (
          groups.map((group) => (
            <FilterGroup
              key={group.id}
              group={group}
              selected={selected}
              onToggle={onToggle}
            />
          ))
        ) : (
          <p className="text-[12px] text-gray-400 font-light pt-4">
            No filters available.
          </p>
        )}
      </div>

    </div>
  );
}