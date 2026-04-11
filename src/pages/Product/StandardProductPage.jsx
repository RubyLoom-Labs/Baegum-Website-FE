import { useState } from "react";
import ImageGallery from "./components/ImageGallery";
import AccordionSection from "./components/AccordionSection";
import ReviewSection from "./components/ReviewSection";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

import wishlistIcon from "@/assets/icons/wishlist.svg";

// ─────────────────────────────────────────────────────────────────────────────
// STANDARD PRODUCT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function StandardProductPage({ product }) {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  // Selected variant state
  const [selected, setSelected] = useState(
    Object.fromEntries(Object.keys(product.variants || {}).map((k) => [k, null]))
  );
  const [added, setAdded] = useState(false);

  const handleVariant = (group, value) =>
    setSelected((prev) => ({ ...prev, [group]: value }));

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || null,
      variant: Object.values(selected).filter(Boolean).join(" / "),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">

        {/* ── Main product area ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Left: image gallery */}
          <ImageGallery images={product.images || []} />

          {/* Right: product info */}
          <div className="flex flex-col">

            {/* Name + wishlist */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-[24px] md:text-[28px] font-light text-[#1a1a1a]
                             leading-tight tracking-wide">
                {product.name}
              </h1>
              <button
                onClick={() => toggleItem({ id: product.id, name: product.name,
                  price: product.price, image: product.images?.[0] || null })}
                className="hover:opacity-60 transition-opacity mt-1 flex-shrink-0"
                aria-label="Wishlist"
              >
                <img src={wishlistIcon} width={22} height={22}
                  alt="Wishlist" draggable={false}
                  style={{ opacity: wishlisted ? 1 : 0.5 }} />
              </button>
            </div>

            {/* Price */}
            <p className="text-[16px] text-[#1a1a1a] font-light mt-2">
              {product.currency} {product.price.toLocaleString()}/=
            </p>

            {/* Variant selectors */}
            {product.variants && Object.keys(product.variants).length > 0 && (
              <div className="flex flex-col gap-5 mt-6">
                {Object.entries(product.variants).map(([group, options]) => (
                  <div key={group}>
                    <p className="text-[13px] font-medium text-[#1a1a1a] mb-2.5 tracking-wide">
                      {group}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => {
                        const active = selected[group] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleVariant(group, opt)}
                            className="px-4 py-1.5 rounded-full text-[12px] font-light
                                       transition-all duration-200 border"
                            style={{
                              borderColor:     active ? "#1a1a1a" : "#e5e7eb",
                              backgroundColor: active ? "#1a1a1a" : "white",
                              color:           active ? "white"   : "#1a1a1a",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700
                           text-white text-[14px] font-medium tracking-wide transition-colors"
              >
                {added ? "Added ✓" : "Buy Now"}
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full py-4 border border-gray-300 hover:border-[#1a1a1a]
                           hover:bg-gray-50 active:bg-gray-100 text-[#1a1a1a] text-[14px]
                           font-medium tracking-wide transition-colors"
              >
                Add to Cart
              </button>
            </div>

            {/* Accordions */}
            <div className="mt-8 border-t border-gray-200">
              <AccordionSection title="Details & Features">
                <p>{product.details}</p>
              </AccordionSection>
              <AccordionSection title="Ingredients">
                <p>{product.ingredients}</p>
              </AccordionSection>
              <AccordionSection title="Delivery & Payment">
                <p>{product.delivery}</p>
              </AccordionSection>
            </div>
          </div>
        </div>

        {/* ── Reviews ────────────────────────────────────────────── */}
        <ReviewSection />
      </div>
    </div>
  );
}