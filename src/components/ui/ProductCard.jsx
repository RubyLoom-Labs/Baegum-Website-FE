import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

import cartIcon from "@/assets/icons/cart.svg";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
//
//  variant="clothing"  → 3:4 portrait, no radius, name+price inline, desc below
//  variant="product"   → 1:1 square, 8px radius, name then price stacked
//
//  Usage:
//    <ProductCard product={p} variant="clothing" />   ← ClothingPage
//    <ProductCard product={p} />                      ← all other pages
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductCard({ product, variant = "product", hideWishlist = false, hideAddToCart = false, onAddToCart }) {
  const [hovered,    setHovered]    = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  
  const { toggleItem, isWishlisted: isWishlistedInContext, loading } = useWishlist();
  const { isLoggedIn, openLogin } = useAuth();
  
  // Once wishlist context is loaded, use it as source of truth
  // Before loading completes, use API response as temporary placeholder
  // This ensures heart updates immediately on click and stays updated
  const wishlisted = loading ? (product.is_wishlisted ?? false) : isWishlistedInContext(product.id);

  const isClothing = variant === "clothing";

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    
    // If not logged in, show login popup
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    
    // If logged in, toggle wishlist
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setBtnHovered(false); }}
    >
        {/* ── Image area ───────────────────────────────────────────── */}
        <div
        className="relative overflow-hidden transition-colors duration-300"
        style={{
            backgroundColor: hovered ? "#ffffff" : "#D3D3D3",
            borderRadius:    isClothing ? "0px" : "0px",
        }}
        >
        {/* Gradient overlay — fades in on hover */}
        <div
            className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-500"
            style={{
            opacity:    hovered ? 1 : 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0) 70%)",
            }}
        />
        {/* Aspect ratio: clothing = 3:4 | others = 1:1 */}
        <Link to={product.href || "#"} draggable={false} className="block">
          <div
            className="relative w-full"
            style={{ paddingBottom: isClothing ? "133%" : "100%" }}
          >
            <img
              src={product.image}
              alt={product.name}
              draggable={false}
              className="absolute inset-0 w-full h-full select-none
                         transition-transform duration-500 ease-out"
              style={{
                objectFit:      "cover",
                objectPosition: isClothing ? "top" : "center",
                transform:      hovered ? "scale(1.03)" : "scale(1)",
              }}
            />
          </div>
        </Link>

        {/* Wishlist — top right bare icon — hidden if hideWishlist prop is true */}
        {!hideWishlist && (
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 z-10 hover:opacity-70 transition-opacity p-1"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={wishlisted ? "#1a1a1a" : "none"}
              stroke="#1a1a1a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}

        {/* Add to Cart — desktop hover overlay */}
        {!hideAddToCart && (
          <div
            className="hidden md:flex absolute bottom-8 left-0 right-0 justify-center z-10"
            style={{
              opacity:    hovered ? 1 : 0,
              transform:  hovered ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <button
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              onClick={(e) => {
                e.preventDefault();
                if (onAddToCart) {
                  onAddToCart(product);
                }
              }}
              className="px-16 py-3 text-[13px] font-normal tracking-wide transition-colors duration-200"
              style={{
                backgroundColor: btnHovered ? "#1a1a1a" : "rgba(255,255,255,0.92)",
                color:           btnHovered ? "#ffffff" : "#1a1a1a",
              }}
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* ── Card info ────────────────────────────────────────────── */}

      {/* CLOTHING variant */}
      {isClothing && (
        <>
          {/* Desktop: name + price inline, description below */}
          <div className="hidden md:block pt-2.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-medium text-[#1a1a1a] leading-tight">
                {product.name}
              </p>
              <p className="text-[13px] font-medium text-[#1a1a1a] whitespace-nowrap flex-shrink-0">
                {product.price}
              </p>
            </div>
            {product.description && (
              <p className="text-[12px] text-gray-500 font-light leading-snug mt-0.5 line-clamp-1">
                {product.description}
              </p>
            )}
          </div>

          {/* Mobile: name → description → price + cart icon */}
          <div className="md:hidden pt-2.5 flex flex-col gap-0.5">
            <p className="text-[13px] font-medium text-[#1a1a1a] leading-tight">
              {product.name}
            </p>
            {product.description && (
              <p className="text-[11px] text-gray-500 font-light leading-snug line-clamp-1">
                {product.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-1.5 gap-2">
              <p className="text-[13px] font-medium text-[#1a1a1a]">{product.price}</p>
              {!hideAddToCart && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (onAddToCart) {
                      onAddToCart(product);
                    }
                  }}
                  className="hover:opacity-60 transition-opacity"
                  aria-label="Add to cart"
                >
                  <img src={cartIcon} alt="Add to cart" width={18} height={18} draggable={false} />
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* OTHER PRODUCTS variant (fragrance, makeup, skincare etc.) */}
      {!isClothing && (
        <div className="pt-2.5 flex flex-col gap-0.5">
          <p className="text-[13px] font-medium text-[#1a1a1a] leading-tight">
            {product.name}
          </p>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-[13px] text-gray-600 font-light">
              {product.price}
            </p>
            {!hideAddToCart && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (onAddToCart) {
                    onAddToCart(product);
                  }
                }}
                className="md:hidden hover:opacity-60 transition-opacity"
                aria-label="Add to cart"
              >
                <img src={cartIcon} alt="Add to cart" width={18} height={18} draggable={false} />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}