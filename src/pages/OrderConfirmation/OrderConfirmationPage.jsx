import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE BITS  (same style as Profile + Checkout)
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

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
    <p className="text-[12px] text-gray-500 font-light flex-shrink-0">{label}</p>
    <p className="text-[12px] text-[#1a1a1a] font-medium text-right">{value}</p>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// ORDER CONFIRMATION PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()

  const order = location.state

  // Clear cart after confirmation mounts
  useEffect(() => {
    if (order) {
      // clearCart()   // ← uncomment when cart context has clearCart
    }
  }, [])

  // If page is accessed directly without order state, redirect
  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-[15px] text-gray-400 font-light">No order found.</p>
        <Link to="/" className="text-[13px] text-[#1a1a1a] underline underline-offset-2">
          Go Home
        </Link>
      </div>
    )
  }

  const { items, address, paymentMethod, card, subtotal, shippingFee, orderTotal, orderId, orderStatusId = 1, showSuccessMessage = true } = order

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">

        {/* ── Success header ────────────────────────────────────── */}
        {showSuccessMessage && (
          <div className="flex flex-col items-center text-center mb-10">
            {/* Success icon */}
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200
                            flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 className="text-[22px] font-light text-[#1a1a1a] tracking-wide mb-1">
              Order Placed Successfully
            </h1>
            <p className="text-[13px] text-gray-500 font-light">
              Thank you for your order! We'll send you a confirmation email shortly.
            </p>
            <p className="text-[12px] text-gray-400 font-light mt-2 tracking-widest uppercase">
              Order ID: {orderId}
            </p>
          </div>
        )}

        {/* ── Order Details Header (when viewing from profile) ────── */}
        {!showSuccessMessage && (
          <div className="flex flex-col items-center text-center mb-10">
            <h1 className="text-[22px] font-light text-[#1a1a1a] tracking-wide mb-1">
              Order Details
            </h1>
            <p className="text-[12px] text-gray-400 font-light mt-2 tracking-widest uppercase">
              Order ID: {orderId}
            </p>
          </div>
        )}

        {/* ── Main content ──────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT — Items + Details ───────────────────────────── */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Order items */}
            <Card>
              <CardTitle title="Items Ordered" />
              <div className="flex flex-col gap-0">
                {items.map((item) => (
                  <div key={item.id}
                    className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-0">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 overflow-hidden rounded-sm">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                        : <div className="w-full h-full bg-gray-200" />
                      }
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1a1a1a] leading-tight">{item.name}</p>
                      {item.variant && (
                        <p className="text-[11px] text-gray-400 font-light mt-0.5">{item.variant}</p>
                      )}
                      <p className="text-[12px] text-gray-500 font-light mt-0.5">
                        Qty: {item.qty} &nbsp;×&nbsp; Rs.{item.price.toFixed(2)}
                      </p>
                    </div>
                    {/* Line total */}
                    <p className="text-[13px] font-semibold text-[#1a1a1a] flex-shrink-0">
                      Rs.{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery address */}
            <Card>
              <CardTitle title="Delivery Address" />
              {address ? (
                <div className="text-[13px] text-[#1a1a1a] font-medium">
                  <p>{address.name}</p>
                  <p className="text-[12px] text-gray-500 font-light mt-1 leading-relaxed">{address.address}</p>
                  <p className="text-[12px] text-gray-500 font-light">{address.phone}</p>
                </div>
              ) : (
                <p className="text-[12px] text-gray-400 font-light">No address selected</p>
              )}
            </Card>

            {/* Payment method */}
            <Card>
              <CardTitle title="Payment Method" />
              {paymentMethod === 'cod' ? (
                <div>
                  <p className="text-[13px] font-medium text-[#1a1a1a]">Cash on Delivery</p>
                  <p className="text-[12px] text-gray-500 font-light mt-0.5">
                    Pay when your order arrives at your doorstep
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-blue-700 border border-blue-300 px-2 py-0.5">
                    {card?.brand}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-[#1a1a1a]">{card?.name}</p>
                    <p className="text-[12px] text-gray-500 font-light">
                      {card?.number} &nbsp;|&nbsp; Expire {card?.expiry}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* ── RIGHT — Price Summary + Actions ──────────────────── */}
          <div className="lg:w-[360px] flex-shrink-0">
            <div className="sticky top-[130px] flex flex-col gap-4">

              {/* Price breakdown */}
              <Card>
                <CardTitle title="Order Total" />
                <div className="flex flex-col">
                  <InfoRow label="Subtotal"  value={`Rs.${subtotal.toFixed(2)}`} />
                  <InfoRow label="Shipping"  value={`Rs.${shippingFee.toFixed(2)}`} />
                  <div className="flex items-center justify-between pt-3 mt-1">
                    <p className="text-[14px] font-semibold text-[#1a1a1a]">Total</p>
                    <p className="text-[16px] font-semibold text-[#1a1a1a]">Rs.{orderTotal.toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              {/* Estimated delivery */}
              <Card>
                <CardTitle title="Estimated Delivery" />
                <div className="flex flex-col gap-1.5">
                  {/* Status 1: Order Confirmed */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${orderStatusId >= 1 ? 'bg-green-400' : 'bg-gray-200'}`} />
                    <p className={`text-[12px] font-light ${orderStatusId >= 1 ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>Order Confirmed</p>
                  </div>
                  
                  {/* Status 2: Processing */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${orderStatusId >= 2 ? 'bg-green-400' : 'bg-gray-200'}`} />
                    <p className={`text-[12px] font-light ${orderStatusId >= 2 ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>Processing (1–2 days)</p>
                  </div>
                  
                  {/* Status 3: Shipped */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${orderStatusId >= 3 ? 'bg-green-400' : 'bg-gray-200'}`} />
                    <p className={`text-[12px] font-light ${orderStatusId >= 3 ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>Shipped (2–4 days)</p>
                  </div>
                  
                  {/* Status 4: Delivered */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${orderStatusId >= 4 ? 'bg-green-400' : 'bg-gray-200'}`} />
                    <p className={`text-[12px] font-light ${orderStatusId >= 4 ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>Delivered (3–5 days)</p>
                  </div>
                </div>
              </Card>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                {orderStatusId !== 4 && (
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full py-3.5 bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700
                               text-white text-[13px] font-medium tracking-wide transition-colors">
                    Track My Order
                  </button>
                )}
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3.5 border border-gray-300 hover:border-[#1a1a1a]
                             hover:bg-gray-50 text-[#1a1a1a] text-[13px] font-light
                             tracking-wide transition-colors">
                  Continue Shopping
                </button>
              </div>

              <p className="text-[11px] text-gray-400 font-light text-center">
                Need help?{' '}
                <Link to="#" className="text-[#1a1a1a] underline underline-offset-2 hover:text-gray-600">
                  Contact Us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
