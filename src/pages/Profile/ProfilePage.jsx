import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ui/ProductCard";

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────────────────────────────────────

const INIT_USER = { firstName: "Diunura", lastName: "Honsaje", email: "du.********@gmail.com", phone: "", dob: "", gender: "" };

const INIT_ADDRESSES = [
  { id: 1, isDefault: true,  name: "Daniel Rodriguez", address: "34/B, Wanatha road, Maharagama. Western - Colombo - Greater - Maharagama", phone: "(+94) 713531297" },
  { id: 2, isDefault: false, name: "Olivia Johnson",   address: "12/A, Temple Lane, Nugegoda Western – Colombo – Greater – Nugegoda",        phone: "(+94) 712345678" },
  { id: 3, isDefault: false, name: "Olivia Johnson",   address: "78/D, Rose Garden Street, Dehiwala – Western – Colombo – Greater – Dehiwala", phone: "(+94) 712345678" },
];

const INIT_CARDS = [
  { id: 1, isDefault: true,  name: "Daniel Rodriguez", number: "12*************23", expiry: "12/03", brand: "VISA" },
  { id: 2, isDefault: false, name: "Daniel Rodriguez", number: "12*************23", expiry: "12/03", brand: "VISA" },
];

const CURRENT_ORDERS = [
  { id: 1, name: "Oatmeal V-Neck Dress", price: "Rs.13,000.00", orderDate: "2024/09/09", shippingDate: "2024/09/15 - 2024/09/19", image: null },
  { id: 2, name: "Oatmeal V-Neck Dress", price: "Rs.12,000.00", orderDate: "2024/09/09", shippingDate: "2024/09/15 - 2024/09/20", image: null },
];
const REVIEWS_PENDING = [
  { id: 1, name: "Oatmeal V-Neck Dress", price: "Rs.12,000.00", arrivedDate: "2024/09/16", image: null },
  { id: 2, name: "Oatmeal V-Neck Dress", price: "Rs.17,000.00", arrivedDate: "2024/09/16", image: null },
];
const CANCELLATIONS = [
  { id: 1, name: "Oatmeal V-Neck Dress", price: "Rs.12,000.00", reason: "Cancellation Reasons", image: null },
  { id: 2, name: "Oatmeal V-Neck Dress", price: "Rs.17,000.00", reason: "Cancellation Reasons", image: null },
];
const RETURNS = [
  { id: 1, name: "Oatmeal V-Neck Dress", price: "Rs.12,000.00", reason: "Return Reasons", image: null },
  { id: 2, name: "Oatmeal V-Neck Dress", price: "Rs.17,000.00", reason: "Return Reasons", image: null },
];
const WISHLIST_ITEMS = Array(12).fill(null).map((_, i) => ({
  id: i + 1, name: "Oatmeal V-Neck Dress",
  description: "Sleeveless, fitted beige dress",
  price: "Rs.0000.00", image: null, href: "#",
}));

// Navbar height — adjust if your header height differs
const NAV_OFFSET = 130;

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Main section title with line
const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-4 mb-5">
    <h2 className="text-[17px] font-light text-[#1a1a1a] tracking-wide whitespace-nowrap">{title}</h2>
    <div className="flex-1 h-px bg-gray-300" />
  </div>
);

// Bordered card wrapping a sub-section
const Card = ({ children }) => (
  <div className="border border-gray-200 rounded-sm p-6">{children}</div>
);

// Sub-section heading inside a card
const CardTitle = ({ title }) => (
  <p className="text-[14px] font-semibold text-[#1a1a1a] tracking-wide mb-4">{title}</p>
);

// Input
const Field = ({ label, placeholder, type = "text", value, onChange, half }) => (
  <div className={half ? "flex-1" : "w-full"}>
    {label && <p className="text-[11px] text-gray-500 font-light mb-1 tracking-wide">{label}</p>}
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      className="w-full border border-gray-300 rounded px-4 py-2.5 text-[13px]
                 text-[#1a1a1a] placeholder-gray-400 font-light outline-none
                 focus:border-gray-500 transition-colors"
    />
  </div>
);

// Buttons
const BtnSmall = ({ label, onClick }) => (
  <button onClick={onClick}
    className="border border-gray-300 text-[#1a1a1a] text-[11px] font-light
               px-3 py-1.5 hover:border-[#1a1a1a] hover:bg-gray-50
               active:bg-gray-100 transition-colors whitespace-nowrap rounded-sm">
    {label}
  </button>
);

const BtnSmallPink = ({ label, onClick }) => (
  <button onClick={onClick}
    className="border border-[#FF8989] text-[#FF8989] text-[11px] font-light
               bg-[#fff0f0] px-3 py-1.5 hover:bg-red-100 active:bg-red-200
               transition-colors whitespace-nowrap rounded-sm">
    {label}
  </button>
);

const BtnOutline = ({ label, onClick }) => (
  <button onClick={onClick}
    className="border border-gray-300 text-[#1a1a1a] text-[12px] font-light
               px-5 py-2 hover:border-[#1a1a1a] hover:bg-gray-50
               active:bg-gray-100 transition-colors rounded-sm">
    {label}
  </button>
);

const BtnPrimary = ({ label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className="w-full bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700
               text-white text-[13px] font-medium py-3.5 tracking-wide
               transition-colors disabled:opacity-50 rounded-sm">
    {label}
  </button>
);

const Badge = ({ count }) => (
  <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full
                   bg-[#1a1a1a] text-white text-[10px] font-semibold ml-1.5 flex-shrink-0">
    {count}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────

function Toast({ message }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-6 py-3
                    bg-[#1a1a1a] text-white text-[13px] font-light rounded-sm shadow-xl
                    transition-all duration-300 whitespace-nowrap">
      {message}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD ADDRESS MODAL
// ─────────────────────────────────────────────────────────────────────────────

function AddAddressModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ fullName:"", phone:"", street:"", city:"", state:"", country:"", postal:"", isDefault:false });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phone.trim())    e.phone    = "Required";
    if (!form.street.trim())   e.street   = "Required";
    if (!form.city.trim())     e.city     = "Required";
    if (!form.country.trim())  e.country  = "Required";
    return e;
  };

  const handleAdd = () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    onAdd(form); onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[61] flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-[540px] rounded-sm shadow-xl p-7 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-[18px] font-light text-[#1a1a1a]">Add New Address</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-[#1a1a1a] transition-colors"><CloseIcon /></button>
          </div>
          <div className="flex flex-col gap-3.5">
            <p className="text-[13px] font-medium text-[#1a1a1a]">Full Name &amp; Phone Number</p>
            <div>
              <Field placeholder="Full Name"    value={form.fullName} onChange={set("fullName")} />
              {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <Field placeholder="Phone Number" value={form.phone}    onChange={set("phone")} />
              {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <p className="text-[13px] font-medium text-[#1a1a1a] mt-1">Address</p>
            <div>
              <Field placeholder="Street Address" value={form.street}  onChange={set("street")} />
              {errors.street && <p className="text-[11px] text-red-500 mt-1">{errors.street}</p>}
            </div>
            <div className="flex gap-3">
              <Field placeholder="City"           value={form.city}    onChange={set("city")}   half />
              <Field placeholder="State/Province" value={form.state}   onChange={set("state")}  half />
            </div>
            <div className="flex gap-3">
              <Field placeholder="Country"        value={form.country} onChange={set("country")} half />
              <Field placeholder="Postal Code/Zip" value={form.postal} onChange={set("postal")} half />
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer mt-1">
              <input type="checkbox" checked={form.isDefault}
                onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
                className="w-4 h-4 accent-[#1a1a1a]" />
              <span className="text-[13px] text-gray-600 font-light">Set as Default Address</span>
            </label>
            <div className="mt-1"><BtnPrimary label="Add" onClick={handleAdd} /></div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EDIT PROFILE MODAL
// ─────────────────────────────────────────────────────────────────────────────

function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    firstName: user.firstName, lastName: user.lastName,
    email: user.email, phone: user.phone || "",
    dob: user.dob || "", gender: user.gender || "",
  });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[61] flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-[480px] rounded-sm shadow-xl p-7 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-[18px] font-light text-[#1a1a1a]">Edit Profile</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-[#1a1a1a] transition-colors"><CloseIcon /></button>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="flex gap-3">
              <Field label="First Name" placeholder="First Name" value={form.firstName} onChange={set("firstName")} half />
              <Field label="Last Name"  placeholder="Last Name"  value={form.lastName}  onChange={set("lastName")}  half />
            </div>
            <Field label="Email Address" type="email" placeholder="Email" value={form.email} onChange={set("email")} />
            <Field label="Phone Number"  type="tel"   placeholder="Phone" value={form.phone} onChange={set("phone")} />
            <Field label="Date of Birth" type="date"  placeholder=""      value={form.dob}   onChange={set("dob")}   />
            <div>
              <p className="text-[11px] text-gray-500 font-light mb-1 tracking-wide">Gender</p>
              <select value={form.gender} onChange={set("gender")}
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-[13px]
                           text-[#1a1a1a] font-light outline-none focus:border-gray-500">
                <option value="">Select gender</option>
                <option>Female</option><option>Male</option><option>Prefer not to say</option>
              </select>
            </div>
            <div className="flex gap-3 mt-1">
              <BtnOutline label="Cancel" onClick={onClose} />
              <BtnPrimary label="Save Changes" onClick={() => { onSave(form); onClose(); }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER ROW
// ─────────────────────────────────────────────────────────────────────────────

function OrderRow({ item, type }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-12 h-12 flex-shrink-0 bg-gray-200 overflow-hidden rounded-sm">
        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1a1a1a]">{item.name}</p>
        <p className="text-[11px] text-gray-500 font-light mt-0.5 leading-relaxed">
          {item.price}
          {item.orderDate    && <> &nbsp;|&nbsp; Order Date | {item.orderDate}</>}
          {item.shippingDate && <> &nbsp;|&nbsp; Shipping Date | {item.shippingDate}</>}
          {item.arrivedDate  && <> &nbsp;|&nbsp; Arrived Date | {item.arrivedDate}</>}
          {item.reason       && <> &nbsp;|&nbsp; {item.reason}</>}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {type === "current" && (
          <><BtnSmall label="Track Order" onClick={() => {}} /><BtnSmallPink label="# Cancel" onClick={() => {}} /></>
        )}
        {type === "reviews" && (
          <><BtnSmall label="Completed" onClick={() => {}} /><BtnSmall label="Reviews" onClick={() => {}} /></>
        )}
        {(type === "cancellations" || type === "returns") && (
          <span className="text-[11px] text-gray-400 font-light capitalize">
            {type === "cancellations" ? "Cancelled" : "Returned"}
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────────────────────────────────────

// All scrollable section IDs in order
const ALL_SECTIONS = [
  "my-profile", "address-book", "payment-options",
  "current-orders", "my-returns", "my-cancellations", "my-reviews",
  "my-wishlist",
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, isLoggedIn, logout } = useAuth();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Initialize user from AuthContext with fallback fields
  const initialUser = authUser ? {
    firstName: authUser.full_name?.split(' ')[0] || authUser.name || '',
    lastName: authUser.full_name?.split(' ').slice(1).join(' ') || '',
    email: authUser.email || '',
    phone: '',
    dob: '',
    gender: ''
  } : {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: ''
  };

  const [user,         setUser]         = useState(initialUser);
  const [addresses,    setAddresses]    = useState(INIT_ADDRESSES);
  const [cards,        setCards]        = useState(INIT_CARDS);
  const [showAddAddr,  setShowAddAddr]  = useState(false);
  const [showEditProf, setShowEditProf] = useState(false);
  const [toast,        setToast]        = useState(null);
  const [activeId,     setActiveId]     = useState("my-profile");

  const refs = Object.fromEntries(ALL_SECTIONS.map((id) => [id, useRef(null)]));

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Scroll to section with navbar offset
  const scrollTo = (id) => {
    const el = refs[id]?.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Highlight active nav on scroll
  useEffect(() => {
    const onScroll = () => {
      for (const id of [...ALL_SECTIONS].reverse()) {
        const el = refs[id]?.current;
        if (el && el.getBoundingClientRect().top <= NAV_OFFSET + 20) {
          setActiveId(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddAddress = (form) => {
    if (form.isDefault) setAddresses((p) => p.map((a) => ({ ...a, isDefault: false })));
    setAddresses((p) => [...p, { id: Date.now(), isDefault: form.isDefault, name: form.fullName, address: `${form.street}, ${form.city}, ${form.state}, ${form.country} ${form.postal}`, phone: form.phone }]);
    showToast("Address added");
  };

  const defaultAddr = addresses.find((a) => a.isDefault);

  // Nav item component
  const NavLink = ({ label, target, badge }) => {
    const isActive = activeId === target;
    return (
      <button
        onClick={() => scrollTo(target)}
        className="flex items-center text-left py-1 w-full"
      >
        <span className={`text-[13px] tracking-wide transition-colors
          ${isActive ? "text-[#1a1a1a] font-medium" : "text-gray-500 font-light hover:text-[#1a1a1a]"}`}>
          {label}
        </span>
        {badge !== undefined && <Badge count={badge} />}
      </button>
    );
  };

  const NavGroup = ({ label, target }) => {
    const isActive = ["my-profile","address-book","payment-options"].includes(activeId) && target === "manage"
      || ["current-orders","my-returns","my-cancellations","my-reviews"].includes(activeId) && target === "orders"
      || activeId === "my-wishlist" && target === "wishlist";
    return (
      <p className={`text-[13px] font-semibold tracking-wide mb-1.5
        ${isActive ? "text-[#1a1a1a]" : "text-[#1a1a1a]"}`}>
        {label}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-0">

          {/* ── STICKY SIDEBAR ─────────────────────────────────── */}
          <aside className="hidden md:block w-[200px] flex-shrink-0">
            <div className="sticky flex flex-col gap-4" style={{ top: NAV_OFFSET + 16 }}>

              <div>
                <NavGroup label="Manage My Account" target="manage" />
                <div className="flex flex-col gap-0.5 pl-1">
                  <NavLink label="My Profile"         target="my-profile"      />
                  <NavLink label="Address Book"       target="address-book"    />
                  <NavLink label="My Payment Options" target="payment-options" />
                </div>
              </div>

              <div>
                <NavGroup label="My Orders" target="orders" />
                <div className="flex flex-col gap-0.5 pl-1">
                  <NavLink label="Current Orders"   target="current-orders"   badge={CURRENT_ORDERS.length} />
                  <NavLink label="My Returns"       target="my-returns"       />
                  <NavLink label="My Cancellations" target="my-cancellations" />
                  <NavLink label="My Reviews"       target="my-reviews"       badge={REVIEWS_PENDING.length} />
                </div>
              </div>

              <div>
                <NavGroup label="My Wishlist" target="wishlist" />
                <div className="pl-1">
                  <NavLink label="My Wishlist" target="my-wishlist" />
                </div>
              </div>

            </div>
          </aside>

          {/* Vertical divider */}
          <div className="hidden md:block w-px bg-gray-200 mx-8 self-stretch" />

          {/* ── MAIN CONTENT ────────────────────────────────────── */}
          <main className="flex-1 min-w-0 flex flex-col gap-10">

            {/* ═══ MANAGE MY ACCOUNT ═══════════════════════════════ */}
            <div>
              <SectionTitle title="Manage My Account" />
              <div className="flex flex-col gap-4">

                {/* Personal Profile — own bordered card */}
                <div ref={refs["my-profile"]}>
                  <Card>
                    <CardTitle title="Personal Profile" />
                    <div className="flex flex-wrap gap-x-16 gap-y-2 text-[13px] font-light text-gray-700">
                      <p>
                        <span className="font-semibold text-[#1a1a1a]">Name:</span>{" "}
                        {user.firstName} {user.lastName}{" "}
                        <span className="mx-1 text-gray-300">|</span>
                        <button onClick={() => setShowEditProf(true)}
                          className="text-blue-500 hover:underline underline-offset-2 text-[12px]">
                          Edit
                        </button>
                      </p>
                      <p>
                        <span className="font-semibold text-[#1a1a1a]">Email:</span>{" "}
                        {user.email}
                      </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          logout();
                          navigate('/');
                          showToast('Logged out successfully');
                        }}
                        className="px-5 py-2 border border-red-300 text-red-600 text-[12px] font-light
                                 hover:bg-red-50 active:bg-red-100 transition-colors rounded-sm"
                      >
                        Logout
                      </button>
                    </div>
                  </Card>
                </div>

                {/* Address Book — own bordered card */}
                <div ref={refs["address-book"]}>
                  <Card>
                    <CardTitle title="Address Book" />

                    {/* Default addresses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                      {["DEFAULT SHIPPING ADDRESS", "DEFAULT BILLING ADDRESS"].map((label) => (
                        <div key={label}>
                          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">
                            {label}
                          </p>
                          {defaultAddr ? (
                            <>
                              <p className="text-[13px] font-medium text-[#1a1a1a]">{defaultAddr.name}</p>
                              <p className="text-[12px] text-gray-500 font-light leading-relaxed">{defaultAddr.address}</p>
                              <p className="text-[12px] text-gray-500 font-light">{defaultAddr.phone}</p>
                            </>
                          ) : (
                            <p className="text-[12px] text-gray-400">No default set</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <BtnOutline label="Add New Address" onClick={() => setShowAddAddr(true)} />

                    {/* Address list */}
                    <div className="mt-4 flex flex-col gap-0">
                      {addresses.map((addr) => (
                        <div key={addr.id}
                          className="flex items-start justify-between gap-4 py-3
                                     border-b border-gray-100 last:border-0">
                          <p className="text-[12px] text-gray-700 font-light flex-1 min-w-0 leading-relaxed">
                            {addr.name} ,{addr.address} {addr.phone}
                          </p>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-gray-300 text-[11px]">|</span>
                            {addr.isDefault
                              ? <span className="text-[11px] text-gray-400 font-light">Default</span>
                              : <BtnSmall label="Make Default" onClick={() => {
                                  setAddresses((p) => p.map((a) => ({ ...a, isDefault: a.id === addr.id })));
                                  showToast("Default address updated");
                                }} />
                            }
                            <BtnSmallPink label="Remove" onClick={() => {
                              setAddresses((p) => p.filter((a) => a.id !== addr.id));
                              showToast("Address removed");
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* My Payment Options — own bordered card */}
                <div ref={refs["payment-options"]}>
                  <Card>
                    <CardTitle title="My Payment Options" />

                    <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">
                      DEFAULT CARD
                    </p>
                    {cards.filter((c) => c.isDefault).map((card) => (
                      <div key={card.id} className="mb-4">
                        <p className="text-[13px] font-medium text-[#1a1a1a]">{card.name}</p>
                        <p className="text-[12px] text-gray-500 font-light">34/B, Wanatha road, Maharagama.</p>
                        <p className="text-[12px] text-gray-500 font-light">Western - Colombo - Greater - Maharagama</p>
                        <p className="text-[12px] text-gray-500 font-light">(+94) 713531297</p>
                      </div>
                    ))}

                    <BtnOutline label="Add New Card" onClick={() => showToast("Payment gateway coming soon")} />

                    <div className="mt-4 flex flex-col gap-0">
                      {cards.map((card) => (
                        <div key={card.id}
                          className="flex items-center justify-between gap-4 py-3
                                     border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="inline-block border border-blue-700 text-blue-700
                                             text-[11px] font-bold px-2 py-0.5 tracking-wide">
                              {card.brand}
                            </span>
                            <span className="text-[12px] text-gray-700 font-light">
                              {card.name} &nbsp;|&nbsp; {card.number} &nbsp;|&nbsp; Expire {card.expiry}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-gray-300 text-[11px]">|</span>
                            {card.isDefault
                              ? <span className="text-[11px] text-gray-400 font-light">Default</span>
                              : <BtnSmall label="Make Default" onClick={() => {
                                  setCards((p) => p.map((c) => ({ ...c, isDefault: c.id === card.id })));
                                  showToast("Default card updated");
                                }} />
                            }
                            <BtnSmallPink label="Remove" onClick={() => {
                              setCards((p) => p.filter((c) => c.id !== card.id));
                              showToast("Card removed");
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* ═══ MY ORDERS ══════════════════════════════════════ */}
            <div>
              <SectionTitle title="My Orders" />
              <div className="flex flex-col gap-4">

                {/* Current Orders */}
                <div ref={refs["current-orders"]}>
                  <Card>
                    <CardTitle title="Current Orders" />
                    {CURRENT_ORDERS.map((o) => <OrderRow key={o.id} item={o} type="current" />)}
                  </Card>
                </div>

                {/* My Reviews */}
                <div ref={refs["my-reviews"]}>
                  <Card>
                    <p className="text-[14px] font-semibold text-[#1a1a1a] tracking-wide mb-4">
                      My Reviews
                      <span className="font-light text-gray-500 text-[13px]"> — pending to Reviews</span>
                    </p>
                    {REVIEWS_PENDING.map((o) => <OrderRow key={o.id} item={o} type="reviews" />)}
                  </Card>
                </div>

                {/* My Cancellations */}
                <div ref={refs["my-cancellations"]}>
                  <Card>
                    <CardTitle title="My Cancellations" />
                    {CANCELLATIONS.map((o) => <OrderRow key={o.id} item={o} type="cancellations" />)}
                  </Card>
                </div>

                {/* Returns */}
                <div ref={refs["my-returns"]}>
                  <Card>
                    <CardTitle title="Returns" />
                    {RETURNS.map((o) => <OrderRow key={o.id} item={o} type="returns" />)}
                  </Card>
                </div>
              </div>
            </div>

            {/* ═══ MY WISHLIST ════════════════════════════════════ */}
            <div ref={refs["my-wishlist"]}>
              <SectionTitle title="My Wishlist" />
              {WISHLIST_ITEMS.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16">
                  <p className="text-[14px] text-gray-400 font-light">Your wishlist is empty</p>
                  <Link to="/clothing"
                    className="px-8 py-3 bg-[#1a1a1a] text-white text-[13px] font-medium hover:bg-gray-800 transition-colors">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {WISHLIST_ITEMS.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              )}
            </div>

          </main>
        </div>
      </div>

      {/* Modals */}
      {showAddAddr  && <AddAddressModal  onClose={() => setShowAddAddr(false)}  onAdd={handleAddAddress} />}
      {showEditProf && <EditProfileModal onClose={() => setShowEditProf(false)} onSave={(f) => { setUser(f); showToast("Profile updated"); }} user={user} />}

      {toast && <Toast message={toast} />}
    </div>
  );
}