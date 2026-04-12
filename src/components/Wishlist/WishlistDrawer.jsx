import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24"
    fill={filled ? "#1a1a1a" : "none"}
    stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST ITEM ROW
// ─────────────────────────────────────────────────────────────────────────────

function WishlistItem({ item }) {
  const { removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleMoveToCart = () => {
    addToCart({ ...item, qty: 1 });
    removeItem(item.id);
  };

  // Parse price to number, handling both string and number formats
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const numStr = price.replace(/[^0-9.-]/g, '');
      return parseFloat(numStr) || 0;
    }
    return 0;
  };

  const numericPrice = parsePrice(item.price);

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name}
            className="w-full h-full object-cover object-top" draggable={false} />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-medium text-[#1a1a1a] leading-tight">
            {item.name}
          </p>
          <p className="text-[13px] font-medium text-[#1a1a1a] whitespace-nowrap flex-shrink-0">
            Rs.{numericPrice.toFixed(2)}
          </p>
        </div>

        {item.variant && (
          <p className="text-[12px] text-gray-500 font-light mt-0.5">{item.variant}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => removeItem(item.id)}
            className="hover:opacity-60 transition-opacity"
            aria-label="Remove from wishlist"
          >
            <HeartIcon filled={true} />
          </button>

          <button
            onClick={handleMoveToCart}
            className="text-[12px] text-gray-500 hover:text-[#1a1a1a] active:text-black
                       px-2 py-1 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors font-light"
          >
            Move to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST DRAWER
// ─────────────────────────────────────────────────────────────────────────────

export default function WishlistDrawer() {
  const { wishlistOpen, closeWishlist, items } = useWishlist();
  const { addItem: addToCart } = useCart();
  const isEmpty = items.length === 0;

  const handleAddAllToCart = () => {
    items.forEach((item) => addToCart({ ...item, qty: 1 }));
  };

  return (
    <>
      {/* ── Backdrop — z-[48] ────────────────────────────────────── */}
      <div
        onClick={closeWishlist}
        className="hidden md:block fixed inset-0 transition-all duration-300"
        style={{
          zIndex:               51,
          pointerEvents:        wishlistOpen ? "auto" : "none",
          opacity:              wishlistOpen ? 1 : 0,
          backdropFilter:       wishlistOpen ? "blur(3px)" : "none",
          WebkitBackdropFilter: wishlistOpen ? "blur(3px)" : "none",
          backgroundColor:      "rgba(255,255,255,0.40)",
        }}
      />

      {/* ── Drawer panel — z-[49] ───────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white flex flex-col
                    transition-transform duration-300 ease-out
                    w-full md:w-[500px]
                    ${wishlistOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ zIndex: 52 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <button
            onClick={closeWishlist}
            className="text-gray-600 hover:text-[#1a1a1a] transition-colors p-1
                       hover:bg-gray-100 active:bg-gray-200 rounded"
            aria-label="Close wishlist"
          >
            <CloseIcon />
          </button>
          <h2 className="text-[15px] font-medium text-[#1a1a1a] tracking-wide">
            Favorite
          </h2>
          <div className="w-6" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-16">
              <p className="text-[14px] text-gray-400 font-light">No Items</p>
              <Link
                to="/clothing"
                onClick={closeWishlist}
                className="w-full max-w-xs py-4 bg-[#1a1a1a] hover:bg-gray-800
                           active:bg-gray-700 text-white text-[14px] font-medium
                           text-center tracking-wide transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <WishlistItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer — only when items exist */}
        {!isEmpty && (
          <div className="px-6 py-5 border-t border-gray-100">
            <button
              onClick={handleAddAllToCart}
              className="w-full py-4 bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700
                         text-white text-[14px] font-medium tracking-wide transition-colors"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
