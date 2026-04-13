import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE GALLERY
// ─────────────────────────────────────────────────────────────────────────────

export default function ImageGallery({ images = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Pad to 4 slots with nulls for placeholders
  const slots = [...images, null, null, null, null].slice(0, 4);
  const mainImage = images[activeIdx] ?? null;

  return (
    <div className="flex gap-4">

      {/* ── Main large image ────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden  bg-gray-100"
        style={{ aspectRatio: "1/1" }}>
        {mainImage ? (
          <img
            src={mainImage}
            alt="Product"
            draggable={false}
            className="w-full h-full object-cover select-none transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 " />
        )}
      </div>

      {/* ── Thumbnails column ───────────────────────────────────── */}
      <div className="flex flex-col gap-3 w-[100px] flex-shrink-0">
        {slots.map((img, i) => (
          <button
            key={i}
            onClick={() => img && setActiveIdx(i)}
            className="relative overflow-hidden transition-all duration-200"
            style={{
              aspectRatio: "1/1",
              border:      i === activeIdx && img ? "1px solid #1a1a1a" : "2px solid transparent",
              opacity:     img ? 1 : 0.4,
              cursor:      img ? "pointer" : "default",
            }}
          >
            {img ? (
              <img src={img} alt={`View ${i + 1}`} draggable={false}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}