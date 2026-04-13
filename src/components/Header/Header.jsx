import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from "react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

import { useAuth } from "@/context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// ASSET CONFIG — update paths to match your actual files
// ─────────────────────────────────────────────────────────────────────────────

import logoSrc from "@/assets/logo/logo-nav.svg";

import searchDefault from "@/assets/icons/search.svg";
import searchHover from "@/assets/icons/search.svg";

import wishlistDefault from "@/assets/icons/wishlist.svg";
import wishlistHover from "@/assets/icons/wishlist.svg";

import cartDefault from "@/assets/icons/cart.svg";
import cartHover from "@/assets/icons/cart.svg";

import userDefault from "@/assets/icons/user.svg";
import userHover from "@/assets/icons/user.svg";

import menuDefault from "@/assets/icons/menu.svg";
import menuHover from "@/assets/icons/menu.svg";

import closeDefault from "@/assets/icons/close.svg";
import closeHover from "@/assets/icons/close.svg";

// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Clothing", href: "/clothing" },
  { label: "Makeup", href: "/makeup" },
  { label: "Fragrance", href: "/fragrance" },
  { label: "Bath & Body", href: "/bath-body" },
  { label: "Skincare", href: "/skincare" },
  { label: "Brands", href: "/brands" },
  { label: "Best Sellers", href: "/best-sellers" },
];

// ── IconButton ────────────────────────────────────────────────────────────────

function IconButton({ defaultSrc, hoverSrc, size = 20, className = "", badge, onClick, ariaLabel }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`relative flex items-center justify-center p-1 ${className}`}
      aria-label={ariaLabel}
    >
      <span className="relative block flex-shrink-0" style={{ width: size, height: size }}>
        <img
          src={defaultSrc}
          width={size} height={size}
          alt="" draggable={false}
          style={{ position: "absolute", inset: 0, opacity: hovered ? 0 : 1, transition: "opacity 0.15s ease" }}
        />
        <img
          src={hoverSrc}
          width={size} height={size}
          alt="" draggable={false}
          style={{ position: "absolute", inset: 0, opacity: hovered ? 1 : 0, transition: "opacity 0.15s ease" }}
        />
      </span>

      {badge !== undefined && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#1a1a1a] text-white text-[9px] rounded-full flex items-center justify-center font-semibold px-0.5 pointer-events-none">
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ height = 22, className = "", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-none border-none p-0 cursor-pointer hover:opacity-80 transition-opacity select-none ${className}`}
      aria-label="Home"
    >
      <img
        src={logoSrc}
        alt="BAEGUM"
        height={height}
        style={{ height, width: "auto", display: "block" }}
        className="select-none"
        draggable={false}
      />
    </button>
  );
}

// ── Shared Mobile Top Bar ─────────────────────────────────────────────────────
// Used by default bar, menu panel, and search panel — keeps layout consistent.
//
//  leftSlot   — what to render on the left  (icons or just spacing)
//  rightSlot  — what to render on the right (icons or just spacing)

function MobileTopBar({ leftSlot, rightSlot, headerShadow, onLogoClick }) {
  return (
    <div className={`flex items-center justify-between px-4 py-8 h-14 bg-white ${headerShadow}`}>
      {/* Left slot — fixed width so logo always centres */}
      <div className="flex items-center gap-3 w-16">
        {leftSlot}
      </div>

      {/* Logo — always centred */}
      <Logo height={19} onClick={onLogoClick} />

      {/* Right slot — fixed width, right-aligned */}
      <div className="flex items-center justify-end gap-3 w-16">
        {rightSlot}
      </div>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const mobileSearchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { openCart, count: cartCount } = useCart();
  const { openWishlist } = useWishlist();
  const { openLogin, isLoggedIn } = useAuth();

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      openLogin();
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => mobileSearchRef.current?.focus(), 80);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  const closeAll = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const headerShadow = scrolled
    ? "shadow-[0_1px_12px_rgba(0,0,0,0.08)]"
    : "border-b border-gray-100";

  return (
    <>
      {/* ════════════════════════════════════════
          DESKTOP HEADER
      ════════════════════════════════════════ */}
      <header className={`hidden md:block sticky top-0 z-50 bg-white transition-shadow duration-300 ${headerShadow}`}>

        {/* Top row */}
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-14 relative">

          {/* Search bar */}
          <div className="flex items-center gap-2 border border-gray-100 bg-gray-100 rounded-md px-3 py-1.5 w-52 hover:border-gray-400 transition-colors cursor-text">
            <img src={searchDefault} width={15} height={15} alt="" />
            <input
              type="text"
              placeholder="Search....."
              className="text-xs text-gray-500 bg-transparent outline-none w-full placeholder-gray-400 font-light"
            />
          </div>

          {/* Logo — centred */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Logo height={22} onClick={() => navigate('/')} />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <IconButton defaultSrc={userDefault} hoverSrc={userHover} size={19} ariaLabel="Account" onClick={handleProfileClick} />
            {/* <IconButton defaultSrc={wishlistDefault} hoverSrc={wishlistHover} size={19} ariaLabel="Wishlist" onClick={openWishlist} /> */}
            <IconButton defaultSrc={cartDefault} hoverSrc={cartHover} size={19} ariaLabel="Cart" badge={cartCount} onClick={openCart} />
          </div>
        </div>

        {/* Nav row */}
        <nav className="border-y border-gray-200">
          <ul className="max-w-screen-xl mx-auto px-6 flex items-center justify-center gap-8 h-14">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[13px] tracking-wide font-normal relative group whitespace-nowrap transition-colors"
                    style={{ color: isActive ? "#FF8989" : "#374151" }}
                  >
                    {link.label}
                    {/* Underline — always visible when active, animates on hover */}
                    <span
                      className="absolute -bottom-0.5 left-0 h-px transition-all duration-300"
                      style={{
                        width: isActive ? "100%" : "0%",
                        backgroundColor: "#FF8989",
                      }}
                    />
                    {/* Hover underline — only shows when not active */}
                    {!isActive && (
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* ════════════════════════════════════════
          MOBILE — DEFAULT BAR
          Hidden when menu or search is open
      ════════════════════════════════════════ */}
      <header
        className={`md:hidden sticky top-0 z-50 transition-shadow duration-300 ${headerShadow} ${menuOpen || searchOpen ? "invisible" : "visible"
          }`}
      >
        <MobileTopBar
          headerShadow=""
          onLogoClick={() => navigate('/')}
          leftSlot={
            <>
              <IconButton
                defaultSrc={menuDefault} hoverSrc={menuHover}
                size={22} ariaLabel="Open menu"
                onClick={() => { setSearchOpen(false); setMenuOpen(true); }}
              />
              <IconButton
                defaultSrc={searchDefault} hoverSrc={searchHover}
                size={19} ariaLabel="Search"
                onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
              />
            </>
          }
          rightSlot={
            <>
              {/* <IconButton defaultSrc={wishlistDefault} hoverSrc={wishlistHover} size={20} ariaLabel="Wishlist" onClick={openWishlist} /> */}
              <IconButton defaultSrc={cartDefault} hoverSrc={cartHover} size={20} ariaLabel="Cart" badge={cartCount} onClick={openCart} />
            </>
          }
        />
      </header>

      {/* ════════════════════════════════════════
          MOBILE — MENU FULL SCREEN OVERLAY
      ════════════════════════════════════════ */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ zIndex: 53 }}
      >
        {/* Same top bar layout — nothing left, close button right */}
        <MobileTopBar
          headerShadow="border-b border-gray-100"
          onLogoClick={() => { navigate('/'); closeAll(); }}
          leftSlot={null}
          rightSlot={
            <IconButton
              defaultSrc={closeDefault} hoverSrc={closeHover}
              size={20} ariaLabel="Close menu"
              onClick={closeAll}
            />
          }
        />

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    onClick={closeAll}
                    className="block px-6 py-2 text-[14px] transition-colors font-light tracking-wide border-b border-gray-50"
                    style={{ color: isActive ? "#FF8989" : "#1f2937" }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile button */}
        <div className="p-5 border-t border-gray-100">
          <button
            onClick={handleProfileClick}
            className="w-full py-3 border border-gray-200 bg-gray-100 rounded-md
               hover:bg-gray-200 transition-colors text-sm text-gray-700
               font-medium tracking-wide"
          >
            Your Profile
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MOBILE — SEARCH FULL SCREEN OVERLAY
      ════════════════════════════════════════ */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-white flex flex-col transition-opacity duration-200 ${searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        style={{ zIndex: 53 }}
      >
        {/* Same top bar — close button right, nothing left */}
        <MobileTopBar
          headerShadow="border-b border-gray-100"
          onLogoClick={() => { navigate('/'); closeAll(); }}
          leftSlot={null}
          rightSlot={
            <IconButton
              defaultSrc={closeDefault} hoverSrc={closeHover}
              size={20} ariaLabel="Close search"
              onClick={closeAll}
            />
          }
        />

        {/* Search input */}
        <div className="px-4 pt-4">
          <div className="flex items-center border border-gray-100 bg-gray-100 rounded px-3 py-2.5 gap-2">
            <img src={searchDefault} width={16} height={16} alt="" />
            <input
              ref={mobileSearchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type here"
              className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400 font-light"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} aria-label="Clear">
                <img src={closeDefault} width={14} height={14} alt="" />
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex items-start justify-center pt-12 text-gray-300 text-sm">
          {!searchQuery && <span>Start typing to search...</span>}
        </div>
      </div>
    </>
  );
}
