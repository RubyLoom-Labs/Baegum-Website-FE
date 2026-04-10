import { useState, useEffect } from "react";
import { getItems } from "@/services/filterItems";

// ─────────────────────────────────────────────────────────────────────────────
// FILTERS PER CATEGORY
// ─────────────────────────────────────────────────────────────────────────────

export const FILTERS_BY_CATEGORY = {

  "bath-body": [
    { id: "type", label: "Type" },
    { id: "brand", label: "Brand" },
    { id: "price", label: "Price", options: ["Under Rs.1000", "Rs.1000–3000", "Over Rs.3000"] },
  ],

};

// Fetch filter options from backend
export const fetchFilterOptions = async (filterIds, category) => {
  const filterMap = {};

  const endpointMap = {
    type: `/api/catalog/types?category=${category}`,
    scent: `/api/catalog/scents?category=${category}`,
    brand: `/api/catalog/brands?category=${category}`,
  };

  for (const filterId of filterIds) {
    const endpoint = endpointMap[filterId];
    if (endpoint) {
      try {
        const response = await getItems(endpoint);
        // Keep full objects with id and name
        filterMap[filterId] = response.data || [];
      } catch (error) {
        console.error(`Error fetching ${filterId}:`, error);
        filterMap[filterId] = [];
      }
    }
  }

  return filterMap;
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
            // Handle both object format (with id and name) and string format (hardcoded options)
            const isObject = typeof opt === 'object' && opt !== null;
            const id = isObject ? opt.id : opt;
            const name = isObject ? opt.name : opt;
            const key = `${group.id}:${id}`;
            const checked = selected.includes(key);
            return (
              <label key={id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(key)}
                  className="w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer"
                />
                <span className="text-[12px] text-gray-600 group-hover:text-[#1a1a1a]
                                 transition-colors font-light">
                  {name}
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

  const [dynamicGroups, setDynamicGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idToNameMap, setIdToNameMap] = useState({});

  // Pick the right filter groups for this category
  const baseGroups = FILTERS_BY_CATEGORY[category] || [];

  // Fetch dynamic filter options when category changes
  useEffect(() => {
    const loadDynamicFilters = async () => {
      try {
        setLoading(true);
        const dynamicFilterIds = baseGroups
          .filter(group => !group.options) // Only fetch for groups without hardcoded options
          .map(group => group.id);

        if (dynamicFilterIds.length === 0) {
          setDynamicGroups(baseGroups);
          setIdToNameMap({});
          setLoading(false);
          return;
        }

        const filterOptions = await fetchFilterOptions(dynamicFilterIds, 4);
        const nameMap = {};

        const groupsWithOptions = baseGroups.map(group => {
          if (group.options) {
            return group; // Return hardcoded options as-is
          } else {
            const options = Array.isArray(filterOptions[group.id]) ? filterOptions[group.id] : [];
            // Build mapping of id -> name for this group
            if (Array.isArray(options)) {
              options.forEach(opt => {
                if (typeof opt === 'object' && opt.id && opt.name) {
                  nameMap[opt.id] = opt.name;
                }
              });
            }
            return {
              ...group,
              options: options,
            };
          }
        });

        setDynamicGroups(groupsWithOptions);
        setIdToNameMap(nameMap);
      } catch (error) {
        console.error('Error loading filters:', error);
        setDynamicGroups(baseGroups);
        setIdToNameMap({});
      } finally {
        setLoading(false);
      }
    };

    loadDynamicFilters();
  }, [category, baseGroups]);

  const groups = dynamicGroups;

  // Function to get display name for a filter value
  const getDisplayName = (key) => {
    const [groupId, value] = key.split(":");
    // Check if value is in our ID to name map (for dynamic filters)
    if (idToNameMap[value]) {
      return idToNameMap[value];
    }
    // For hardcoded filters, the value is already the name
    return value;
  };

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

      {/* Filter groups — scrollable */}
      <div className="flex-1 overflow-y-auto mt-1">
        {loading ? (
          <p className="text-[12px] text-gray-400 font-light pt-4">Loading filters...</p>
        ) : groups.length > 0 ? (
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
