import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// ASSET CONFIG — swap these paths with your actual files
// ─────────────────────────────────────────────────────────────────────────────

import logoSrc from "@/assets/logo/logo-nav.svg";       // or .png

// Service strip icons
import shippingIcon from "@/assets/icons/footer/shipping.svg";
import contactIcon from "@/assets/icons/footer/contact.svg";
import giftIcon from "@/assets/icons/footer/gift.svg";

// Social media icons
import linkedinIcon from "@/assets/icons/social/linkedin.svg";
import facebookIcon from "@/assets/icons/social/facebook.svg";
import pinterestIcon from "@/assets/icons/social/pinterest.svg";
import instagramIcon from "@/assets/icons/social/instagram.svg";
import tiktokIcon from "@/assets/icons/social/tiktok.svg";
import xIcon from "@/assets/icons/social/x.svg";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const CUSTOMER_CARE = [
  { label: "My Account", href: "#" },
  { label: "Create Account", href: "#" },
  { label: "Influencers", href: "#" },
  { label: "Contact Us", href: "#" },
];

const POLICIES = [
  { label: "Shipping & Delivery", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Package Protection", href: "#" },
  { label: "Refunds Policy", href: "#" },
];

const ABOUT_TEXT =
  "BAEGUM The Label is a contemporary modestwear brand inspired by elegance, strength, and thoughtful design. We craft timeless essentials and distinctive pieces that honor women on their journey to becoming poised, confident, and deeply connected to their identity.";

const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "#", icon: linkedinIcon },
  { name: "Facebook", href: "#", icon: facebookIcon },
  { name: "Pinterest", href: "#", icon: pinterestIcon },
  { name: "Instagram", href: "#", icon: instagramIcon },
  { name: "TikTok", href: "#", icon: tiktokIcon },
  { name: "X", href: "#", icon: xIcon },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Service card — icon image + title + subtitle
function ServiceCard({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-6 md:py-10 px-4">
      <img src={icon} alt={title} width={48} height={48} draggable={false} />
      <div>
        <p className="text-[15px] font-semibold tracking-widest uppercase text-[#1a1a1a]">
          {title}
        </p>
        <p className="text-[12px] text-gray-600 mt-1 font-light">{subtitle}</p>
      </div>
    </div>
  );
}

// Link list with bullet dots
function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h4 className="text-[13px] font-semibold text-[#1a1a1a] mb-4 tracking-wide">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label} className="flex items-start gap-1">
            <span className="text-[#1a1a1a] text-[12px] leading-5 flex-shrink-0">•</span>
            <Link
              to={link.href}
              className="text-[12px] text-[#1a1a1a] hover:text-gray-500 transition-colors font-normal leading-5"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">

      {/* ── Service Strip ───────────────────────────────────────────── */}
      <div className="border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white ">
            <ServiceCard
              icon={shippingIcon}
              title="Worldwide Shipping"
              subtitle="Cheap, Fast Shipping Available to your Destination."
            />
            <ServiceCard
              icon={contactIcon}
              title="Contact Us"
              subtitle="We're happy to help, send us an email."
            />
            <ServiceCard
              icon={giftIcon}
              title="Gift Cards"
              subtitle="The gift that always fits."
            />
          </div>
        </div>
      </div>

      {/* ── Main Footer Body ─────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 py-10">

        {/* ── DESKTOP layout ── */}
        <div className="hidden md:grid md:grid-cols-[1.8fr_1fr_1fr_1.6fr] gap-10">

          {/* Col 1 — Logo + copyright */}
          <div className="flex flex-col gap-4 items-center text-center">
            <img
              src={logoSrc}
              alt="BAEGUM"
              height={28}
              style={{ height: 28, width: "fit-content" }}
              draggable={false}
              className="select-none mt-4"
            />
            <div className="text-[12px] text-gray-700 font-light leading-relaxed space-y-1">
              <p>© 2026 BAEGUM USA, Inc. All rights reserved.</p>
              <p>
                <Link to="#" className="hover:text-[#1a1a1a] transition-colors underline underline-offset-2">
                  Privacy Policy
                </Link>{" "}
                <Link to="#" className="hover:text-[#1a1a1a] transition-colors underline underline-offset-2">
                  Terms of Use
                </Link>
              </p>
              <p className="mt-1">834-787-4601</p>
            </div>
          </div>

          {/* Col 2 — Customer Care */}
          <FooterLinkGroup title="Customer Care" links={CUSTOMER_CARE} />

          {/* Col 3 — Policies */}
          <FooterLinkGroup title="Policies" links={POLICIES} />

          {/* Col 4 — About Us */}
          <div className="flex-col ">
            <div>
              <h4 className="text-[13px] font-semibold text-[#1a1a1a] mb-4 tracking-wide">
                About Us
              </h4>
              <p className="text-[12px] text-gray-600 font-light leading-relaxed">
                {ABOUT_TEXT}
              </p>
            </div>

            {/* Social icons — desktop only in bottom bar */}
            <div className="hidden md:flex items-center gap-3 mt-8 justify-end">
              {SOCIAL_LINKS.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="hover:opacity-60 transition-opacity"
                >
                  <img src={icon} alt={name} width={18} height={18} draggable={false} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE layout ── */}
        <div className="md:hidden flex flex-col gap-8">

          {/* Row 1 — Two link columns side by side */}
          <div className="grid grid-cols-2 gap-6">
            <FooterLinkGroup title="Customer Care" links={CUSTOMER_CARE} />
            <FooterLinkGroup title="Policies" links={POLICIES} />
          </div>

          {/* Row 2 — Logo + copyright centred */}
          <div className="flex flex-col items-center text-center gap-3 pt-4 border-t border-gray-100">
            <img
              src={logoSrc}
              alt="BAEGUM"
              height={28}
              style={{ height: 28, width: "auto" }}
              draggable={false}
              className="select-none mt-4"
            />
            <div className="text-[12px] text-gray-500 font-light leading-relaxed space-y-1">
              <p> © {new Date().getFullYear()} BAEGUM USA, Inc. All rights reserved.</p>
              <p>
                <Link to="#" className="hover:text-[#1a1a1a] transition-colors underline underline-offset-2">
                  Privacy Policy
                </Link>{" "}
                <Link to="#" className="hover:text-[#1a1a1a] transition-colors underline underline-offset-2">
                  Terms of Use
                </Link>
              </p>
              <p>834-787-4601</p>
            </div>
          </div>

          {/* Row 3 — About Us + social icons */}
          <div className="flex flex-col items-center text-center gap-4 pt-4 ">
            <h4 className="text-[13px] font-semibold text-[#1a1a1a] tracking-wide">
              About Us
            </h4>
            <p className="text-[13px] text-gray-500 font-light leading-relaxed">
              {ABOUT_TEXT}
            </p>

            {/* Social icons — right after about text on mobile */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {SOCIAL_LINKS.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="hover:opacity-60 transition-opacity"
                >
                  <img src={icon} alt={name} width={20} height={20} draggable={false} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────────────── */}
      <div className="border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-center gap-3">

          <p className="text-[11px] text-gray-400 font-light">
            Developed & maintain by <a href="https://ooralabs.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a1a] transition-colors underline underline-offset-2">OORA Labs</a>
          </p>

        </div>
      </div>

    </footer>
  );
}