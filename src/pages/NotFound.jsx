import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import logoSrc from "@/assets/logo/logo-nav.svg";

// ─────────────────────────────────────────────────────────────────────────────
// BAEGUM 404 — Editorial fashion aesthetic
// Minimal, refined, on-brand
// ─────────────────────────────────────────────────────────────────────────────

export default function NotFound() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen md:min-h-[calc(100vh-130px)] bg-white flex flex-col items-center justify-center
                 relative overflow-hidden px-6"
    >
      {/* ── Decorative background text ───────────────────────────── */}
      <span
        className="absolute select-none pointer-events-none font-black text-gray-100
                   leading-none tracking-tighter"
        style={{
          fontSize:   "clamp(160px, 30vw, 380px)",
          top:        "50%",
          left:       "50%",
          transform:  "translate(-50%, -50%)",
          fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
          zIndex:     0,
          opacity:    visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.1s",
        }}
      >
        404
      </span>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col items-center text-center gap-6"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
        }}
      >
        {/* Logo 

        <img
          src={logoSrc}
          alt="BAEGUM"
          height={40}
          style={{ height: 28, width: "auto" }}
          draggable={false}
          className="select-none mb-2 opacity-60"
        />*/}

        {/* Thin divider 
        <div
          className="h-px bg-gray-200"
          style={{
            width:      visible ? "80px" : "0px",
            transition: "width 0.6s ease 0.4s",
          }}
        />*/}

        {/* Message */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <h1
            className="text-[28px] md:text-[52px] font-light text-[#1a1a1a] leading-tight tracking-wide"
            style={{ fontFamily: "'Futura', 'Trebuchet MS', sans-serif" }}
          >
            Page Not Found
          </h1>
          <p className="text-[14px] text-gray-400 font-light max-w-xs leading-relaxed">
            The page you're looking for has moved, or never existed.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
          <Link
            to="/"
            className="px-10 py-3.5 bg-[#1a1a1a] text-white text-[13px] font-medium
                       tracking-widest uppercase hover:bg-gray-800 active:bg-gray-700
                       transition-colors duration-200"
          >
            Go Home
          </Link>
          <Link
            to="/clothing"
            className="px-10 py-3.5 border border-gray-300 text-[#1a1a1a] text-[13px]
                       font-medium tracking-widest uppercase hover:border-[#1a1a1a]
                       hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
          >
            Shop Now
          </Link>
        </div>

        {/* Quick nav links */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6"
          style={{
            opacity:    visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.6s",
          }}
        >
          {[
            { label: "Clothing",    href: "/clothing"      },
            { label: "Fragrance",   href: "/fragrance"     },
            { label: "Skincare",    href: "/skincare"      },
            { label: "Best Sellers",href: "/best-sellers"  },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[12px] text-gray-400 hover:text-[#1a1a1a] transition-colors
                         font-light tracking-wide underline underline-offset-4
                         decoration-gray-200 hover:decoration-gray-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}