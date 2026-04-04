import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA — replace with real user data from API/context
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_ADDRESSES = [
  { id: 1, isDefault: true,  name: 'Daniel Rodriguez', address: '34/B, Wanatha road, Maharagama. Western - Colombo - Greater - Maharagama', phone: '(+94) 713531297' },
  { id: 2, isDefault: false, name: 'Olivia Johnson',   address: '12/A, Temple Lane, Nugegoda Western – Colombo – Greater – Nugegoda',        phone: '(+94) 712345678' },
  { id: 3, isDefault: false, name: 'Olivia Johnson',   address: '78/D, Rose Garden Street, Dehiwala – Western – Colombo – Greater – Dehiwala', phone: '(+94) 712345678' },
]

const SAMPLE_CARDS = [
  { id: 1, isDefault: true,  name: 'Daniel Rodriguez', number: '•••• •••• •••• 1234', expiry: '12/03', brand: 'VISA' },
  { id: 2, isDefault: false, name: 'Daniel Rodriguez', number: '•••• •••• •••• 5678', expiry: '08/26', brand: 'VISA' },
]

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE BITS  (same style as ProfilePage)
// ─────────────────────────────────────────────────────────────────────────────

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-4 mb-5">
    <h2 className="text-[17px] font-light text-[#1a1a1a] tracking-wide whitespace-nowrap">{title}</h2>
    <div className="flex-1 h-px bg-gray-300" />
  </div>
)

const Card = ({ children, className = '' }) => (
  <div className={`border border-gray-200 rounded-sm p-5 ${className}`}>{children}</div>
)

const CardTitle = ({ title }) => (
  <p className="text-[13px] font-semibold text-[#1a1a1a] tracking-wide mb-4">{title}</p>
)

const Field = ({ label, placeholder, type = 'text', value, onChange, half }) => (
  <div className={half ? 'flex-1' : 'w-full'}>
    {label && <p className="text-[11px] text-gray-500 font-light mb-1 tracking-wide">{label}</p>}
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      className="w-full border border-gray-300 rounded px-4 py-2.5 text-[13px]
                 text-[#1a1a1a] placeholder-gray-400 font-light outline-none
                 focus:border-gray-500 transition-colors"
    />
  </div>
)

const BtnOutline = ({ label, onClick, small }) => (
  <button onClick={onClick}
    className={`border border-gray-300 text-[#1a1a1a] font-light
               hover:border-[#1a1a1a] hover:bg-gray-50 active:bg-gray-100
               transition-colors rounded-sm
               ${small ? 'text-[11px] px-3 py-1.5' : 'text-[12px] px-5 py-2'}`}>
    {label}
  </button>
)

// ─────────────────────────────────────────────────────────────────────────────
// ADD ADDRESS MINI FORM (inline, no modal)
// ─────────────────────────────────────────────────────────────────────────────

function AddAddressForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ fullName:'', phone:'', street:'', city:'', state:'', country:'', postal:'' })
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.phone.trim())    e.phone    = 'Required'
    if (!form.street.trim())   e.street   = 'Required'
    if (!form.city.trim())     e.city     = 'Required'
    if (!form.country.trim())  e.country  = 'Required'
    return e
  }

  const handleSave = () => {
    const e = validate(); setErrors(e)
    if (Object.keys(e).length) return
    onSave({ id: Date.now(), isDefault: false, name: form.fullName, address: `${form.street}, ${form.city}, ${form.state}, ${form.country} ${form.postal}`, phone: form.phone })
  }

  return (
    <div className="border border-gray-200 rounded-sm p-5 mt-3 bg-gray-50">
      <p className="text-[13px] font-semibold text-[#1a1a1a] mb-4">Add New Address</p>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <Field placeholder="Full Name"    value={form.fullName} onChange={set('fullName')} half />
            {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
          </div>
          <div className="flex-1">
            <Field placeholder="Phone Number" value={form.phone}    onChange={set('phone')}    half />
            {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <Field placeholder="Street Address" value={form.street}  onChange={set('street')} />
          {errors.street && <p className="text-[10px] text-red-500 mt-1">{errors.street}</p>}
        </div>
        <div className="flex gap-3">
          <Field placeholder="City"           value={form.city}    onChange={set('city')}    half />
          <Field placeholder="State/Province" value={form.state}   onChange={set('state')}   half />
        </div>
        <div className="flex gap-3">
          <Field placeholder="Country"        value={form.country} onChange={set('country')} half />
          <Field placeholder="Postal Code"    value={form.postal}  onChange={set('postal')}  half />
        </div>
        <div className="flex gap-2 mt-1">
          <BtnOutline label="Cancel" onClick={onCancel} />
          <button onClick={handleSave}
            className="px-5 py-2 bg-[#1a1a1a] hover:bg-gray-800 text-white text-[12px]
                       font-medium tracking-wide transition-colors rounded-sm">
            Save Address
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, closeCart } = useCart()

  const [addresses,        setAddresses]        = useState(SAMPLE_ADDRESSES)
  const [selectedAddressId, setSelectedAddressId] = useState(SAMPLE_ADDRESSES.find(a => a.isDefault)?.id || 1)
  const [showAddAddress,   setShowAddAddress]   = useState(false)

  // Payment: 'cod' | 'card'
  const [paymentMethod,    setPaymentMethod]    = useState('cod')
  const [cards,            setCards]            = useState(SAMPLE_CARDS)
  const [selectedCardId,   setSelectedCardId]   = useState(SAMPLE_CARDS.find(c => c.isDefault)?.id || 1)

  const selectedAddress = addresses.find(a => a.id === selectedAddressId)
  const selectedCard    = cards.find(c => c.id === selectedCardId)

  const shippingFee = 350
  const orderTotal  = total + shippingFee

  const handleAddAddress = (newAddr) => {
    setAddresses(prev => [...prev, newAddr])
    setSelectedAddressId(newAddr.id)
    setShowAddAddress(false)
  }

  const handlePlaceOrder = () => {
    // Pass order details to confirmation page via state
    navigate('/order-confirmation', {
      state: {
        items,
        address:       selectedAddress,
        paymentMethod,
        card:          paymentMethod === 'card' ? selectedCard : null,
        subtotal:      total,
        shippingFee,
        orderTotal,
        orderId:       `ORD-${Date.now()}`,
      }
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-[15px] text-gray-400 font-light">Your cart is empty</p>
        <button onClick={() => navigate('/clothing')}
          className="px-8 py-3 bg-[#1a1a1a] text-white text-[13px] font-medium hover:bg-gray-800 transition-colors">
          Shop Now
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">

        {/* Page title */}
        <SectionTitle title="Checkout" />

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT — Address + Payment ─────────────────────────── */}
          <div className="flex-1 flex flex-col gap-6">

            {/* ── DELIVERY ADDRESS ─────────────────────────────────── */}
            <Card>
              <CardTitle title="Delivery Address" />

              {/* Address options */}
              <div className="flex flex-col gap-2">
                {addresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId
                  return (
                    <label key={addr.id}
                      className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors
                        ${isSelected ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                      {/* Radio */}
                      <div className="mt-0.5 flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                          ${isSelected ? 'border-[#1a1a1a]' : 'border-gray-300'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />}
                        </div>
                      </div>
                      <input type="radio" name="address" value={addr.id}
                        checked={isSelected} onChange={() => setSelectedAddressId(addr.id)}
                        className="sr-only" />
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-medium text-[#1a1a1a]">{addr.name}</p>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-light">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-gray-500 font-light mt-0.5 leading-relaxed">{addr.address}</p>
                        <p className="text-[12px] text-gray-500 font-light">{addr.phone}</p>
                      </div>
                    </label>
                  )
                })}
              </div>

              {/* Add address */}
              {!showAddAddress ? (
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="mt-4 border border-gray-300 text-[#1a1a1a] text-[12px] font-light
                             px-4 py-2 hover:border-[#1a1a1a] hover:bg-gray-50 transition-colors rounded-sm">
                  + Add New Address
                </button>
              ) : (
                <AddAddressForm
                  onSave={handleAddAddress}
                  onCancel={() => setShowAddAddress(false)}
                />
              )}
            </Card>

            {/* ── PAYMENT METHOD ────────────────────────────────────── */}
            <Card>
              <CardTitle title="Payment Method" />

              {/* COD */}
              <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer mb-3 transition-colors
                ${paymentMethod === 'cod' ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
                  ${paymentMethod === 'cod' ? 'border-[#1a1a1a]' : 'border-gray-300'}`}>
                  {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />}
                </div>
                <input type="radio" name="payment" value="cod"
                  checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')}
                  className="sr-only" />
                <div>
                  <p className="text-[13px] font-medium text-[#1a1a1a]">Cash on Delivery</p>
                  <p className="text-[12px] text-gray-500 font-light">Pay when your order arrives</p>
                </div>
              </label>

              {/* Card */}
              <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-colors
                ${paymentMethod === 'card' ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
                  ${paymentMethod === 'card' ? 'border-[#1a1a1a]' : 'border-gray-300'}`}>
                  {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />}
                </div>
                <input type="radio" name="payment" value="card"
                  checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')}
                  className="sr-only" />
                <div>
                  <p className="text-[13px] font-medium text-[#1a1a1a]">Pay by Card</p>
                  <p className="text-[12px] text-gray-500 font-light">Credit or Debit card</p>
                </div>
              </label>

              {/* Card selector — shows only when card is selected */}
              {paymentMethod === 'card' && (
                <div className="mt-4 flex flex-col gap-2 pl-1">
                  <p className="text-[11px] text-gray-500 font-light tracking-wide uppercase mb-1">Select Card</p>
                  {cards.map((card) => {
                    const isSelected = card.id === selectedCardId
                    return (
                      <label key={card.id}
                        className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-colors
                          ${isSelected ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                          ${isSelected ? 'border-[#1a1a1a]' : 'border-gray-300'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />}
                        </div>
                        <input type="radio" name="card" value={card.id}
                          checked={isSelected} onChange={() => setSelectedCardId(card.id)}
                          className="sr-only" />
                        <span className="text-[11px] font-bold text-blue-700 border border-blue-300 px-1.5 py-0.5 flex-shrink-0">
                          {card.brand}
                        </span>
                        <span className="text-[12px] text-gray-700 font-light">
                          {card.name} &nbsp;|&nbsp; {card.number} &nbsp;|&nbsp; Expire {card.expiry}
                        </span>
                      </label>
                    )
                  })}
                  <button
                    onClick={() => alert('Add card — payment gateway integration pending')}
                    className="mt-1 border border-gray-300 text-[#1a1a1a] text-[11px] font-light
                               px-4 py-1.5 hover:border-[#1a1a1a] hover:bg-gray-50 transition-colors
                               rounded-sm self-start">
                    + Add New Card
                  </button>
                </div>
              )}
            </Card>
          </div>

          {/* ── RIGHT — Order Summary ─────────────────────────────── */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-[130px]">
              <Card>
                <CardTitle title="Order Summary" />

                {/* Items list */}
                <div className="flex flex-col gap-0 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 flex-shrink-0 bg-gray-100 overflow-hidden rounded-sm">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                          : <div className="w-full h-full bg-gray-200" />
                        }
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[#1a1a1a] leading-tight">{item.name}</p>
                        {item.variant && (
                          <p className="text-[11px] text-gray-400 font-light mt-0.5">{item.variant}</p>
                        )}
                        <p className="text-[11px] text-gray-500 font-light">Qty: {item.qty}</p>
                      </div>
                      {/* Price */}
                      <p className="text-[12px] font-medium text-[#1a1a1a] flex-shrink-0">
                        Rs.{(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[12px] font-light text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs.{total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] font-light text-gray-600">
                    <span>Shipping</span>
                    <span>Rs.{shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[14px] font-semibold text-[#1a1a1a] pt-2 border-t border-gray-100 mt-1">
                    <span>Total</span>
                    <span>Rs.{orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Selected address summary */}
                {selectedAddress && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1.5">
                      Delivering To
                    </p>
                    <p className="text-[12px] font-medium text-[#1a1a1a]">{selectedAddress.name}</p>
                    <p className="text-[11px] text-gray-500 font-light leading-relaxed">{selectedAddress.address}</p>
                    <p className="text-[11px] text-gray-500 font-light">{selectedAddress.phone}</p>
                  </div>
                )}

                {/* Payment summary */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1.5">
                    Payment
                  </p>
                  <p className="text-[12px] text-[#1a1a1a] font-light">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : `Card — ${selectedCard?.number || ''}`}
                  </p>
                </div>

                {/* Place Order button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-5 py-4 bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700
                             text-white text-[14px] font-medium tracking-wide transition-colors">
                  Place Order — Rs.{orderTotal.toFixed(2)}
                </button>

                <p className="text-[10px] text-gray-400 font-light text-center mt-2">
                  By placing your order you agree to our{' '}
                  <span className="underline underline-offset-2 cursor-pointer hover:text-[#1a1a1a]">Terms & Conditions</span>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}