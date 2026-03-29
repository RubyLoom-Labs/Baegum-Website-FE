import { useState } from "react";

const ChevronDown = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left
                   hover:opacity-70 transition-opacity"
      >
        <span className="text-[14px] font-medium text-[#1a1a1a] tracking-wide">
          {title}
        </span>
        <ChevronDown open={open} />
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "500px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="pb-5 text-[13px] text-gray-600 font-light leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}