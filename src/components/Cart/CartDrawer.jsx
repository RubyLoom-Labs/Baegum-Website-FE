import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


// ── Icons ─────────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// CART ITEM ROW
// ─────────────────────────────────────────────────────────────────────────────

function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeItem, updateError } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeItem(item.id);
    } finally {
      setIsRemoving(false);
    }
  };

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
            Rs.{item.price.toFixed(2)}
          </p>
        </div>

        {item.variant && (
          <p className="text-[12px] text-gray-500 font-light mt-0.5">{item.variant}</p>
        )}

        <p className="text-[11px] text-gray-400 font-light mt-1">
          Stock: {item.stock}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded">
            <button
              onClick={() => decreaseQty(item.id)}
              disabled={item.qty <= 1}
              className="w-7 h-7 flex items-center justify-center text-[#1a1a1a]
                         hover:bg-gray-100 active:bg-gray-200 transition-colors text-[16px] font-light
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >−</button>
            <span className="w-8 text-center text-[13px] font-medium text-[#1a1a1a]">
              {item.qty}
            </span>
            <button
              onClick={() => increaseQty(item.id)}
              disabled={item.qty >= item.stock || !item.stock}
              className="w-7 h-7 flex items-center justify-center text-[#1a1a1a]
                         hover:bg-gray-100 active:bg-gray-200 transition-colors text-[16px] font-light
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
              title={item.qty >= item.stock ? "Stock limit reached" : item.stock === 0 ? "Out of stock" : ""}
            >+</button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-gray-400 hover:text-red-400 active:text-red-600 transition-colors p-1
                       disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Remove item"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────────────────────────────────────────

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cartOpen, closeCart, items, total, count, updateError } = useCart();
  const isEmpty = items.length === 0;

  return (
    <>
      {/* ── Backdrop — z-[48] so drawer at z-[49] sits on top ──── */}
      <div
        onClick={closeCart}
        className="hidden md:block fixed inset-0 transition-all duration-300"
        style={{
          zIndex: 51,
          pointerEvents: cartOpen ? "auto" : "none",
          opacity: cartOpen ? 1 : 0,
          backdropFilter: cartOpen ? "blur(3px)" : "none",
          WebkitBackdropFilter: cartOpen ? "blur(3px)" : "none",
          backgroundColor: "rgba(255,255,255,0.40)",
        }}
      />

      {/* ── Drawer panel — z-[49] sits above backdrop ───────────── */}
      <div
        className="fixed top-0 right-0 bottom-0 bg-white flex flex-col
                    transition-transform duration-300 ease-out
                    /* Mobile: full screen */ w-full
                    /* Desktop: right panel */ md:w-[500px]"
        style={{
          zIndex: 52,
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <button
            onClick={closeCart}
            className="text-gray-600 hover:text-[#1a1a1a] transition-colors p-1
                       hover:bg-gray-100 active:bg-gray-200 rounded"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
          <h2 className="text-[15px] font-medium text-[#1a1a1a] tracking-wide">
            {isEmpty ? "Cart" : `Cart (${count})`}
          </h2>
          <div className="w-6" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6">
          {updateError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-[12px] text-red-700">
              {updateError}
            </div>
          )}
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-16">
              <p className="text-[14px] text-gray-400 font-light">No Items</p>
              <Link
                to="/clothing"
                onClick={closeCart}
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
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-semibold text-[#1a1a1a] tracking-widest uppercase">
              Total
            </span>
            <span className="text-[13px] font-medium text-[#1a1a1a]">
              {isEmpty ? "--" : `LKR ${total.toFixed(2)}`}
            </span>
          </div>

          <button onClick={() => { closeCart(); navigate('/checkout') }}
            className="w-full py-4 text-[14px] font-medium tracking-wide transition-colors
                       hover:bg-gray-800 active:bg-gray-700 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isEmpty ? "#d1d5db" : "#1a1a1a",
              color: isEmpty ? "#9ca3af" : "#ffffff",
            }}>
            Checkout LKR {total.toFixed(2)}
          </button>

          <p className="text-[11px] text-gray-400 text-right mt-2 font-light">
            *<Link to="#" className="underline underline-offset-2 hover:text-[#1a1a1a] transition-colors">
              Terms and Condition
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
