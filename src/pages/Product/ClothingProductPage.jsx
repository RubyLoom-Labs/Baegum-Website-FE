import { useState } from "react";
import { useParams } from "react-router-dom";
import ClothingGallery from "./components/ClothingGallery";
import AccordionSection from "./components/AccordionSection";
import ReviewSection from "./components/ReviewSection";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

import wishlistIcon from "@/assets/icons/wishlist.svg";

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE PRODUCT DATA
// ─────────────────────────────────────────────────────────────────────────────

import p1 from "@/assets/products/clothing/p1.png";
import p2 from "@/assets/products/makeup/p1.png";
import p3 from "@/assets/products/skincare/p1.png";
import p4 from "@/assets/products/skincare/p1.png";

const SAMPLE_PRODUCT = {
  id: 1,
  name: "Oatmeal V-Neck Dress",
  price: 10000,
  currency: "Rs",
  images: [p1, p2, p3, p4],   // [main, top-right, bottom-right, wide-bottom]
  colors: [
    { name: "Red",   hex: "#E85D5D" },
    { name: "Olive", hex: "#C4B84A" },
    { name: "Navy",  hex: "#3B5BA5" },
    { name: "Teal",  hex: "#2BAA96" },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  details: "A timeless V-neck silhouette in a soft oatmeal-toned modal fabric. Relaxed yet refined, perfect for both casual days and dressed-up evenings.",
  materials: "95% Modal, 5% Elastane. Hand wash cold. Do not tumble dry. Lay flat to dry.",
  delivery: "Free delivery on orders over Rs. 5000. Standard delivery 3–5 working days. Express delivery available at checkout.",
};

// ─────────────────────────────────────────────────────────────────────────────
// CLOTHING PRODUCT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ClothingProductPage() {
  const { id } = useParams();
  const product = SAMPLE_PRODUCT; // replace with API fetch by id

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize,  setSelectedSize]  = useState(null);
  const [added,         setAdded]         = useState(false);
  const [sizeError,     setSizeError]     = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      variant: [selectedSize, selectedColor?.name].filter(Boolean).join(" / "),
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

          {/* Left: clothing masonry gallery */}
          <ClothingGallery images={product.images} />

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
                  price: product.price, image: product.images[0] })}
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

            {/* Color swatches */}
            <div className="mt-6">
              <p className="text-[13px] font-medium text-[#1a1a1a] mb-2.5 tracking-wide">
                Colors
                {selectedColor && (
                  <span className="font-light text-gray-500 ml-1.5">
                    — {selectedColor.name}
                  </span>
                )}
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((color) => {
                  const active = selectedColor?.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      aria-label={color.name}
                      className="transition-all duration-200"
                      style={{
                        width:      32,
                        height:     32,
                        borderRadius: "50%",
                        backgroundColor: color.hex,
                        border:     active ? "2.5px solid #1a1a1a" : "2.5px solid transparent",
                        outline:    active ? "2px solid white"      : "none",
                        outlineOffset: "-4px",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size selector */}
            <div className="mt-5">
              <p className="text-[13px] font-medium text-[#1a1a1a] mb-2.5 tracking-wide">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className="px-4 py-1.5 rounded-full text-[12px] font-light
                                 transition-all duration-200 border"
                      style={{
                        borderColor:     active ? "#1a1a1a" : "#e5e7eb",
                        backgroundColor: active ? "#1a1a1a" : "white",
                        color:           active ? "white"   : "#1a1a1a",
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {sizeError && (
                <p className="text-[11px] text-red-500 mt-1.5">Please select a size</p>
              )}
            </div>

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
              <AccordionSection title="Materials">
                <p>{product.materials}</p>
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