import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductCategories } from "@/services/product";

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert category name to URL slug
 * Maps: "Clothing" → "clothing", "Bath & Body" → "bath-body", etc.
 */
const getCategorySlug = (categoryName) => {
  if (!categoryName) return 'products';

  const categoryMap = {
    'clothing': 'clothing',
    'makeup': 'makeup',
    'fragrance': 'fragrance',
    'bath & body': 'bath-body',
    'bath body': 'bath-body',
    'skincare': 'skincare',
    'skincare products': 'skincare',
  };

  const slug = categoryMap[categoryName.toLowerCase().trim()];
  return slug || categoryName.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Construct full image URL from relative path
 */
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `${apiUrl}/storage/${cleanPath}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const TRENDS = [];

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP TREND CARD
// ─────────────────────────────────────────────────────────────────────────────

function TrendCard({ icon, label, href, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  const isActive = active || hovered;

  return (
    <Link
      to={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex items-center justify-center rounded-xl border bg-white
                 transition-all duration-300 ease-out p-10"
      style={{
        borderColor:  isActive ? "#1a1a1a"                              : "#e5e7eb",
        boxShadow:    isActive ? "0 4px 20px rgba(0,0,0,0.10)"         : "none",
        transform:    isActive ? "translateY(-1px)"                     : "translateY(0)",
      }}
    >
      <img
        src={icon}
        alt={label}
        draggable={false}
        className="object-contain select-none w-10 h-10"
        style={{
          transform:  isActive ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.3s ease",
        }}
      />
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE TREND CELL
// ─────────────────────────────────────────────────────────────────────────────

function MobileTrendCell({ icon, label, href, borderRight, borderBottom }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Link
      to={href}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={()   => setTimeout(() => setPressed(false), 300)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={()   => setTimeout(() => setPressed(false), 300)}
      className="flex items-center justify-center bg-white transition-colors duration-200"
      style={{
        // Rectangle shape — wider than tall feel
        paddingTop:    "28px",
        paddingBottom: "28px",
        borderRight:  borderRight  ? "1px solid #e5e7eb" : "none",
        borderBottom: borderBottom ? "1px solid #e5e7eb" : "none",
        backgroundColor: pressed ? "#f9fafb" : "#ffffff",
      }}
    >
      <img
        src={icon}
        alt={label}
        draggable={false}
        className="object-contain select-none w-10 h-10"
        style={{
          transform:  pressed ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.25s ease",
          filter:     pressed ? "drop-shadow(0 2px 6px rgba(0,0,0,0.18))" : "none",
        }}
      />
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function TopTrends() {
  const [active, setActive] = useState(null);
  const [trends, setTrends] = useState(TRENDS);
  const [loading, setLoading] = useState(true);

  // Fetch product categories and format as trends
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getProductCategories();

        // Extract categories from response - the API returns paginated data under response.data.data
        const categoriesData = response.data?.data || response.data || response.categories || [];

        // Format categories as trends
        const formattedTrends = categoriesData.slice(0, 10).map((category) => {
          const categorySlug = getCategorySlug(category.name);
          // Use the icon from backend
          const categoryIcon = category.icon || '';

          return {
            id: category.id,
            icon: getFullImageUrl(categoryIcon) || null,
            label: category.name,
            href: `/${categorySlug}`,
          };
        });

        // Use fetched data if available, otherwise fallback to empty array
        if (formattedTrends.length > 0) {
          setTrends(formattedTrends);
        } else {
          setTrends([]);
        }
      } catch (error) {
        console.error('Failed to fetch categories for trends:', error);
        // Use empty fallback
        setTrends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">

        {/* ── Title ──────────────────────────────────────────────────── */}
        <h2 className="text-2xl font-light text-[#1a1a1a] mb-8 tracking-wide
                       text-left md:text-center">
          Top Trends
        </h2>

        {/* ── Desktop: 5 cols × 2 rows ────────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-5 gap-3">
          {trends.map((trend) => (
            <TrendCard
              key={trend.id}
              icon={trend.icon}
              label={trend.label}
              href={trend.href}
              active={active === trend.id}
              onClick={() => setActive(trend.id)}
            />
          ))}
        </div>

        {/* ── Mobile: 3 cols × 2 rows ──────────────────────────────── */}
        {/* Outer border gives the rectangular card look from the design */}
        <div
          className="md:hidden overflow-hidden"
          style={{
            border:       "1px solid #e5e7eb",
            borderRadius: "10px",
          }}
        >
          <div className="grid grid-cols-3">
            {trends.slice(0, 6).map((trend, i) => (
              <MobileTrendCell
                key={trend.id}
                icon={trend.icon}
                label={trend.label}
                href={trend.href}
                borderRight={i % 3 !== 2}        // not last in row
                borderBottom={i < 3}              // first row only
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
