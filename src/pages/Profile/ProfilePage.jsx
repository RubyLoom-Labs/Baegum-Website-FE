import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ui/ProductCard";
import { getUserAddresses, createUserAddress, setDefaultAddress, deleteUserAddress, updateUserProfile, getUserProfile, getCurrentOrders } from "@/services/user";
import { getProductDetail, getProductVariantDetail } from "@/services/product";

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────────────────────────────────────




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
// ADD ADDRESS INLINE FORM (same style as CheckoutPage)
// ─────────────────────────────────────────────────────────────────────────────

function AddAddressForm({ onSave, onCancel, isSaving = false }) {
  const [form, setForm] = useState({
    label: '',
    street1: '',
    street2: '',
    city: '',
    district: '',
    province: '',
    postal_code: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.label.trim())     e.label = 'Address label required'
    if (!form.street1.trim())   e.street1 = 'Street address required'
    if (!form.city.trim())      e.city = 'City required'
    if (!form.district.trim())  e.district = 'District required'
    if (!form.province.trim())  e.province = 'Province required'
    return e
  }

  const handleSave = async () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setIsLoading(true)
    try {
      // Create address_detail object
      const addressData = {
        address_detail: {
          label: form.label,
          street1: form.street1,
          street2: form.street2,
          city: form.city,
          district: form.district,
          province: form.province,
          postal_code: form.postal_code,
          status: 'active'
        },
        status: 'active'
      }

      // Call API to create address
      const result = await createUserAddress(addressData)

      // Format response for display
      const formattedAddress = {
        id: result.id,
        name: form.label,
        address: `${form.street1}${form.street2 ? ', ' + form.street2 : ''}, ${form.city}, ${form.district}, ${form.province}`,
        phone: 'N/A',
        isDefault: false,
        province: form.province,
        district: form.district,
        city: form.city,
        street1: form.street1,
        street2: form.street2,
        postal_code: form.postal_code,
        label: form.label
      }

      onSave(formattedAddress)
    } catch (error) {
      console.error('Failed to save address:', error)
      setErrors({ submit: error.message || 'Failed to save address' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border border-gray-200 rounded-sm p-5 mt-3 bg-gray-50">
      <p className="text-[13px] font-semibold text-[#1a1a1a] mb-4">Add New Address</p>
      {errors.submit && <p className="text-[11px] text-red-500 mb-3">{errors.submit}</p>}
      <div className="flex flex-col gap-3">
        {/* Address Label */}
        <div>
          <Field placeholder="Address Label (e.g., Home, Office)" value={form.label} onChange={set('label')} />
          {errors.label && <p className="text-[10px] text-red-500 mt-1">{errors.label}</p>}
        </div>

        {/* Street Addresses */}
        <div>
          <Field placeholder="Street Address 1" value={form.street1} onChange={set('street1')} />
          {errors.street1 && <p className="text-[10px] text-red-500 mt-1">{errors.street1}</p>}
        </div>
        <div>
          <Field placeholder="Street Address 2 (Optional)" value={form.street2} onChange={set('street2')} />
        </div>

        {/* City and District */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Field placeholder="City" value={form.city} onChange={set('city')} half />
            {errors.city && <p className="text-[10px] text-red-500 mt-1">{errors.city}</p>}
          </div>
          <div className="flex-1">
            <Field placeholder="District" value={form.district} onChange={set('district')} half />
            {errors.district && <p className="text-[10px] text-red-500 mt-1">{errors.district}</p>}
          </div>
        </div>

        {/* Province and Postal Code */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Field placeholder="Province" value={form.province} onChange={set('province')} half />
            {errors.province && <p className="text-[10px] text-red-500 mt-1">{errors.province}</p>}
          </div>
          <div className="flex-1">
            <Field placeholder="Postal Code" value={form.postal_code} onChange={set('postal_code')} half />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-1">
          <BtnOutline label="Cancel" onClick={onCancel} />
          <button onClick={handleSave} disabled={isLoading}
            className="px-5 py-2 bg-[#1a1a1a] hover:bg-gray-800 text-white text-[12px]
                       font-medium tracking-wide transition-colors rounded-sm
                       disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EDIT PROFILE MODAL
// ─────────────────────────────────────────────────────────────────────────────

function EditProfileModal({ user, onClose, onSave, showToast }) {
  const [form, setForm] = useState({
    firstName: user.firstName, lastName: user.lastName,
    email: user.email, phone: user.phone || "",
    dob: user.dob || "", gender: user.gender || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Prepare profile data for API
      const profileData = {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
      };

      // Call API to update profile
      const response = await updateUserProfile(profileData);

      // Format response for local state
      const updatedUser = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
      };

      onSave(updatedUser);
      showToast("Profile updated successfully");
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile');
      showToast('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

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
            {error && <p className="text-[11px] text-red-500 bg-red-50 p-3 rounded">{error}</p>}
            <div className="flex gap-3">
              <Field label="First Name" placeholder="First Name" value={form.firstName} onChange={set("firstName")} half />
              <Field label="Last Name"  placeholder="Last Name"  value={form.lastName}  onChange={set("lastName")}  half />
            </div>
            <Field label="Email Address" type="email" placeholder="Email" value={form.email} onChange={set("email")} />
            <Field label="Phone Number"  type="tel"   placeholder="Phone" value={form.phone} onChange={set("phone")} />
            <Field label="Date of Birth" type="date"  placeholder=""      value={form.dob}   onChange={set("dob")}   />
            <div>
              <p className="text-[11px] text-gray-500 font-light mb-1 tracking-wide">Gender</p>
              <select value={form.gender} onChange={set("gender")} disabled={isLoading}
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-[13px]
                           text-[#1a1a1a] font-light outline-none focus:border-gray-500
                           disabled:bg-gray-100 disabled:cursor-not-allowed">
                <option value="">Select gender</option>
                <option>Female</option><option>Male</option>
              </select>
            </div>
            <div className="flex gap-3 mt-1">
              <BtnOutline label="Cancel" onClick={onClose} />
              <button onClick={handleSave} disabled={isLoading}
                className="flex-1 bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700
                           text-white text-[13px] font-medium py-3.5 tracking-wide
                           transition-colors disabled:opacity-50 rounded-sm">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
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

function OrderRow({ item, type, onViewOrder }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-12 h-12 flex-shrink-0 bg-gray-200 overflow-hidden rounded-sm flex items-center justify-center text-[13px] font-medium text-gray-600">
        {item.orderId}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1a1a1a]">{item.name}</p>
        <p className="text-[11px] text-gray-500 font-light mt-0.5 leading-relaxed">
          {item.price}
          {item.orderDate && <> &nbsp;|&nbsp; {item.orderDate}</>}
          {(type === "current" || type === "completed") && item.status && <> &nbsp;|&nbsp; Status: <span className="text-[#1a1a1a]">{item.status}</span></>}
          {(type === "current" || type === "completed") && item.itemCount && <> &nbsp;|&nbsp; Items: <span className="text-[#1a1a1a]">{item.itemCount}</span></>}
          {item.arrivedDate && <> &nbsp;|&nbsp; Arrived: {item.arrivedDate}</>}
          {item.reason && <> &nbsp;|&nbsp; {item.reason}</>}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {type === "current" && (
          <>
            <BtnSmall label="View Order" onClick={() => onViewOrder && onViewOrder(item)} />
            <BtnSmall label="Track Order" onClick={() => {}} />
            <BtnSmallPink label="# Cancel" onClick={() => {}} />
          </>
        )}
        {type === "completed" && (
          <>
            <BtnSmall label="View Order" onClick={() => onViewOrder && onViewOrder(item)} />
            <BtnSmall label="Review" onClick={() => {}} />
          </>
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
  "current-orders", "completed-orders", "my-returns", "my-cancellations",
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

  const [user,              setUser]              = useState(initialUser);
  const [addresses,         setAddresses]         = useState([]);
  const [cards,             setCards]             = useState(INIT_CARDS);
  const [showAddAddr,       setShowAddAddr]       = useState(false);
  const [showEditProf,      setShowEditProf]      = useState(false);
  const [toast,             setToast]             = useState(null);
  const [activeId,          setActiveId]          = useState("my-profile");
  const [loadingAddresses,  setLoadingAddresses]  = useState(true);
  const [addressError,      setAddressError]      = useState(null);
  const [loadingProfile,    setLoadingProfile]    = useState(true);
  const [currentOrders,     setCurrentOrders]     = useState([]);
  const [completedOrders,   setCompletedOrders]   = useState([]);
  const [cancelledOrders,   setCancelledOrders]   = useState([]);
  const [returnedOrders,    setReturnedOrders]    = useState([]);
  const [rawOrders,         setRawOrders]         = useState({});
  const [loadingOrders,     setLoadingOrders]     = useState(true);

  const refs = Object.fromEntries(ALL_SECTIONS.map((id) => [id, useRef(null)]));

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Fetch user addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        setAddressError(null);
        const response = await getUserAddresses();

        // Handle paginated response
        let addressList = [];
        if (response.data && Array.isArray(response.data.data)) {
          addressList = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          addressList = response.data;
        } else if (Array.isArray(response)) {
          addressList = response;
        }

        // Format addresses from API response
        const formattedAddresses = addressList.map(addr => {
          const detail = addr.address_detail || {};
          return {
            id: addr.id,
            name: detail.label || 'My Address',
            address: `${detail.street1}${detail.street2 ? ', ' + detail.street2 : ''}, ${detail.city}, ${detail.district}, ${detail.province}`,
            phone: addr.phone || 'N/A',
            isDefault: !!addr.is_default || !!addr.isDefault || !!addr.default,
            province: detail.province,
            district: detail.district,
            city: detail.city,
            street1: detail.street1,
            street2: detail.street2,
            postal_code: detail.postal_code,
            label: detail.label
          };
        });

        setAddresses(formattedAddresses);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        setAddressError(error.message || 'Failed to load addresses');
        setAddresses([]);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await getUserProfile();

        // Handle API response
        let profileData = null;
        if (response.data) {
          profileData = response.data;
        } else {
          profileData = response;
        }

        // Format and set user profile
        if (profileData) {
          const updatedUser = {
            firstName: profileData.first_name || profileData.firstName || '',
            lastName: profileData.last_name || profileData.lastName || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            dob: profileData.dob || '',
            gender: profileData.gender || ''
          };

          setUser(updatedUser);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Keep initial user data if fetch fails
      } finally {
        setLoadingProfile(false);
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  // Fetch current orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await getCurrentOrders();

        // Handle API response
        let ordersList = [];
        if (response.data && Array.isArray(response.data.data)) {
          ordersList = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          ordersList = response.data;
        } else if (Array.isArray(response)) {
          ordersList = response;
        }

        // Format orders from API response - separate by status
        const formattedCurrentOrders = [];
        const formattedCompletedOrders = [];
        const formattedCancellations = [];
        const formattedReturns = [];
        
        ordersList.forEach(order => {
          // Format date from date_time (format: "2026-04-12 08:38:36")
          const orderDate = order.date_time
            ? order.date_time.split(' ')[0]
            : '';

          // Get total amount
          const totalAmount = parseFloat(order.total_amount || 0);
          const price = `Rs.${totalAmount.toFixed(2)}`;

          // Get item count
          const itemCount = order.order_items ? order.order_items.length : 0;
          
          // Get order status
          const statusName = order.order_status?.name || 'Pending';
          const statusId = order.order_status_id || 1;

          const formattedOrder = {
            id: order.id,
            orderId: `#${order.id}`,
            name: `Order #${order.id}`,
            price: price,
            totalAmount: order.total_amount,
            orderDate: orderDate,
            status: statusName,
            itemCount: itemCount,
            shippingDate: null,
            image: null,
            statusId: statusId
          };

          // Separate by status
          if (statusId === 1 || statusId === 2 || statusId === 3) {
            // Status 1-3: Current orders (Confirmed, Processing, Shipped)
            formattedCurrentOrders.push(formattedOrder);
          } else if (statusId === 4) {
            // Status 4: Completed/Delivered orders
            formattedCompletedOrders.push(formattedOrder);
          } else if (statusId === 5) {
            // Status 5: Cancelled orders
            formattedCancellations.push(formattedOrder);
          } else if (statusId === 6) {
            // Status 6: Returned orders
            formattedReturns.push(formattedOrder);
          }
        });

        setCurrentOrders(formattedCurrentOrders);
        setCompletedOrders(formattedCompletedOrders);
        setCancelledOrders(formattedCancellations);
        setReturnedOrders(formattedReturns);

        // Store raw order data mapped by ID for later use
        const rawOrdersMap = {};
        ordersList.forEach(order => {
          rawOrdersMap[order.id] = order;
        });
        setRawOrders(rawOrdersMap);
      } catch (error) {
        console.error('Failed to fetch current orders:', error);
        setCurrentOrders([]);
        setRawOrders({});
      } finally {
        setLoadingOrders(false);
      }
    };

    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

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

  const handleAddAddress = (newAddr) => {
    setAddresses(prev => [...prev, newAddr]);
    setShowAddAddr(false);
    showToast("Address added successfully");
  };

  const handleMakeDefault = async (addr) => {
    try {
      const response = await setDefaultAddress(addr.id);

      // Get the updated address from API response
      let updatedAddr = null;
      if (response.data) {
        updatedAddr = response.data;
      } else if (response.data && response.data.data) {
        updatedAddr = response.data.data;
      }

      if (updatedAddr) {
        // Immediately update local state with the response
        setAddresses((prevAddresses) =>
          prevAddresses.map((a) => ({
            ...a,
            isDefault: a.id === updatedAddr.id ? (!!updatedAddr.is_default) : false
          }))
        );
      } else {
        // Fallback: refetch if no response data
        const response = await getUserAddresses();

        let addressList = [];
        if (response.data && Array.isArray(response.data.data)) {
          addressList = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          addressList = response.data;
        } else if (Array.isArray(response)) {
          addressList = response;
        }

        const formattedAddresses = addressList.map(a => {
          const detail = a.address_detail || {};
          return {
            id: a.id,
            name: detail.label || 'My Address',
            address: `${detail.street1}${detail.street2 ? ', ' + detail.street2 : ''}, ${detail.city}, ${detail.district}, ${detail.province}`,
            phone: a.phone || 'N/A',
            isDefault: !!a.is_default || !!a.isDefault || !!a.default,
            province: detail.province,
            district: detail.district,
            city: detail.city,
            street1: detail.street1,
            street2: detail.street2,
            postal_code: detail.postal_code,
            label: detail.label
          };
        });

        setAddresses(formattedAddresses);
      }

      showToast("Default address updated");
    } catch (error) {
      console.error('Failed to update default address:', error);
      showToast('Failed to update default address');
    }
  };

  const handleRemoveAddress = async (addr) => {
    try {
      await deleteUserAddress(addr.id);
      setAddresses((p) => p.filter((a) => a.id !== addr.id));
      showToast("Address removed");
    } catch (error) {
      console.error('Failed to remove address:', error);
      showToast('Failed to remove address');
    }
  };

  const handleViewOrder = async (order) => {
    try {
      // Get raw order data from stored map
      const rawOrder = rawOrders[order.id];

      if (!rawOrder) {
        console.error('Raw order data not found');
        showToast('Failed to load order details');
        return;
      }

      // Map all order items with product details
      const items = await Promise.all(
        (rawOrder.order_items || []).map(async (orderItem) => {
          try {
            // Fetch product details
            const productResponse = await getProductDetail(orderItem.product_id);

            // Handle nested response structure
            let productData = productResponse;
            if (productResponse.data) {
              productData = productResponse.data.data || productResponse.data;
            }

            console.log('Product data:', productData);

            // Extract product name with multiple fallbacks
            const productName = productData?.name
              || productData?.product_name
              || productData?.title
              || `Product #${orderItem.product_id}`;

            // Extract variant details from order item's product_variant data
            let variantString = null;
            if (orderItem.product_variant && orderItem.product_variant.criteria) {
              // Build variant string from criteria array
              const variantParts = orderItem.product_variant.criteria
                .map(criterion => {
                  const criteriaType = criterion.criteria_type?.code || criterion.criteria_type?.name;
                  const criteriaValue = criterion.criteria_value?.name;
                  return criteriaValue;
                })
                .filter(Boolean);

              if (variantParts.length > 0) {
                variantString = variantParts.join(', ');
                console.log('Variant string from criteria:', variantString);
              }
            }

            return {
              id: orderItem.id,
              product_id: orderItem.product_id,
              name: productName,
              image: productData?.image || productData?.product_image || productData?.images?.[0] || null,
              qty: orderItem.quantity || 1,
              price: parseFloat(orderItem.unit_price || 0),
              variant: variantString
            };
          } catch (err) {
            console.error('Failed to fetch product details for product', orderItem.product_id, ':', err);
            // Fallback if product fetch fails
            let variantString = null;
            if (orderItem.product_variant && orderItem.product_variant.criteria) {
              const variantParts = orderItem.product_variant.criteria
                .map(criterion => criterion.criteria_value?.name)
                .filter(Boolean);
              variantString = variantParts.length > 0 ? variantParts.join(', ') : null;
            }

            return {
              id: orderItem.id,
              product_id: orderItem.product_id,
              name: `Product #${orderItem.product_id}`,
              image: null,
              qty: orderItem.quantity || 1,
              price: parseFloat(orderItem.unit_price || 0),
              variant: variantString
            };
          }
        })
      );

      // Get address details from raw order
      const addressDetail = rawOrder.address_detail || {};
      const addressStr = addressDetail.street1
        ? `${addressDetail.street1}${addressDetail.street2 ? ', ' + addressDetail.street2 : ''}, ${addressDetail.city}, ${addressDetail.district}, ${addressDetail.province}`
        : 'Address not available';

      // Transform the order data to match OrderConfirmation format
      const transformedOrder = {
        orderId: order.id.toString(),
        orderStatusId: rawOrder.order_status_id || 1,
        items: items,
        address: {
          name: addressDetail.label || "Delivery Address",
          address: addressStr,
          phone: rawOrder.user?.phone || "N/A"
        },
        paymentMethod: 'cod',
        card: null,
        subtotal: parseFloat(rawOrder.total_amount || 0),
        shippingFee: 0,
        orderTotal: parseFloat(rawOrder.total_amount || 0),
        showSuccessMessage: false
      };

      navigate('/order-confirmation', { state: transformedOrder });
    } catch (error) {
      console.error('Error viewing order:', error);
      showToast('Failed to load order details');
    }
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
      || ["current-orders","my-returns","my-cancellations"].includes(activeId) && target === "orders"
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
                  <NavLink label="Current Orders"   target="current-orders"   badge={currentOrders.length} />
                  <NavLink label="Completed Orders" target="completed-orders" badge={completedOrders.length} />
                  <NavLink label="My Returns"       target="my-returns"       badge={returnedOrders.length} />
                  <NavLink label="My Cancellations" target="my-cancellations" badge={cancelledOrders.length} />
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
                    <div className="flex flex-col gap-4 text-[13px] font-light text-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] text-gray-500 font-light mb-1">First Name</p>
                          <p className="text-[13px] text-[#1a1a1a]">{user.firstName || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-500 font-light mb-1">Last Name</p>
                          <p className="text-[13px] text-[#1a1a1a]">{user.lastName || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-500 font-light mb-1">Email Address</p>
                        <p className="text-[13px] text-[#1a1a1a]">{user.email || '-'}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] text-gray-500 font-light mb-1">Phone Number</p>
                          <p className="text-[13px] text-[#1a1a1a]">{user.phone || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-500 font-light mb-1">Date of Birth</p>
                          <p className="text-[13px] text-[#1a1a1a]">{user.dob || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-500 font-light mb-1">Gender</p>
                        <p className="text-[13px] text-[#1a1a1a]">{user.gender || '-'}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-3">
                      <button onClick={() => setShowEditProf(true)}
                        className="px-5 py-2 border border-gray-300 text-[#1a1a1a] text-[12px] font-light
                                 hover:border-[#1a1a1a] hover:bg-gray-50 transition-colors rounded-sm">
                        Edit Profile
                      </button>
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

                    {/* Loading state */}
                    {loadingAddresses && (
                      <p className="text-[13px] text-gray-500 font-light py-8">Loading your addresses...</p>
                    )}

                    {/* Error state */}
                    {addressError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-sm mb-4">
                        <p className="text-[12px] text-red-600 font-light">{addressError}</p>
                      </div>
                    )}

                    {/* Default addresses */}
                    {!loadingAddresses && addresses.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                        {["DEFAULT SHIPPING ADDRESS", "DEFAULT BILLING ADDRESS"].map((label) => {
                          const defaultAddr = addresses.find((a) => a.isDefault);
                          return (
                            <div key={label}>
                              <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">
                                {label}
                              </p>
                              {defaultAddr ? (
                                <>
                                  <p className="text-[13px] font-medium text-[#1a1a1a]">{defaultAddr.name}</p>
                                  <p className="text-[12px] text-gray-500 font-light leading-relaxed">{defaultAddr.address}</p>
                                  {defaultAddr.postal_code && (
                                    <p className="text-[12px] text-gray-500 font-light">Postal Code: {defaultAddr.postal_code}</p>
                                  )}
                                </>
                              ) : (
                                <p className="text-[12px] text-gray-400">No default set</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add address button */}
                    {!loadingAddresses && !showAddAddr && (
                      <BtnOutline label="+ Add New Address" onClick={() => setShowAddAddr(true)} />
                    )}

                    {/* Add address form */}
                    {showAddAddr && (
                      <AddAddressForm
                        onSave={handleAddAddress}
                        onCancel={() => setShowAddAddr(false)}
                      />
                    )}

                    {/* Address list */}
                    {!loadingAddresses && addresses.length > 0 && (
                      <div className="mt-4 flex flex-col gap-0">
                        {addresses.map((addr) => (
                          <div key={addr.id}
                            className="flex items-start justify-between gap-4 py-3
                                       border-b border-gray-100 last:border-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-[#1a1a1a]">{addr.name}</p>
                              <p className="text-[12px] text-gray-500 font-light leading-relaxed mt-0.5">{addr.address}</p>
                              {addr.postal_code && (
                                <p className="text-[12px] text-gray-500 font-light">Postal Code: {addr.postal_code}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className="text-gray-300 text-[11px]">|</span>
                              {addr.isDefault
                                ? <span className="text-[11px] text-gray-400 font-light">Default</span>
                                : <BtnSmall label="Make Default" onClick={() => handleMakeDefault(addr)} />
                              }
                              <BtnSmallPink label="Remove" onClick={() => handleRemoveAddress(addr)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {!loadingAddresses && addresses.length === 0 && !addressError && (
                      <p className="text-[13px] text-gray-500 font-light py-4">No addresses saved yet. Add one below.</p>
                    )}
                  </Card>
                </div>

                {/* My Payment Options — DISABLED (only COD available for now) */}
                {/* Commented out until payment gateway is integrated */}
                {/*
                <div ref={refs["payment-options"]}>
                  <Card>
                    <CardTitle title="My Payment Options" />
                    ... payment options content ...
                  </Card>
                </div>
                */}
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
                    {loadingOrders ? (
                      <p className="text-[13px] text-gray-500 font-light py-8">Loading your orders...</p>
                    ) : currentOrders.length === 0 ? (
                      <p className="text-[13px] text-gray-500 font-light py-4">No current orders</p>
                    ) : (
                      currentOrders.map((o) => <OrderRow key={o.id} item={o} type="current" onViewOrder={handleViewOrder} />)
                    )}
                  </Card>
                </div>

                {/* Completed Orders */}
                <div ref={refs["completed-orders"]}>
                  <Card>
                    <CardTitle title="Completed Orders" />
                    {loadingOrders ? (
                      <p className="text-[13px] text-gray-500 font-light py-8">Loading your orders...</p>
                    ) : completedOrders.length === 0 ? (
                      <p className="text-[13px] text-gray-500 font-light py-4">No completed orders</p>
                    ) : (
                      completedOrders.map((o) => <OrderRow key={o.id} item={o} type="completed" onViewOrder={handleViewOrder} />)
                    )}
                  </Card>
                </div>

                {/* My Cancellations */}
                <div ref={refs["my-cancellations"]}>
                  <Card>
                    <CardTitle title="My Cancellations" />
                    {cancelledOrders.length === 0 ? (
                      <p className="text-[13px] text-gray-400 font-light">No cancelled orders</p>
                    ) : (
                      cancelledOrders.map((o) => <OrderRow key={o.id} item={o} type="cancellations" onViewOrder={handleViewOrder} />)
                    )}
                  </Card>
                </div>

                {/* Returns */}
                <div ref={refs["my-returns"]}>
                  <Card>
                    <CardTitle title="Returns" />
                    {returnedOrders.length === 0 ? (
                      <p className="text-[13px] text-gray-400 font-light">No returned orders</p>
                    ) : (
                      returnedOrders.map((o) => <OrderRow key={o.id} item={o} type="returns" onViewOrder={handleViewOrder} />)
                    )}
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
      {showEditProf && <EditProfileModal onClose={() => setShowEditProf(false)} onSave={(f) => { setUser(f); }} user={user} showToast={showToast} />}

      {toast && <Toast message={toast} />}
    </div>
  );
}
