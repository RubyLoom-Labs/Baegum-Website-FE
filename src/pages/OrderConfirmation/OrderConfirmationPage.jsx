import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { submitProductReview, getOrderReviews } from '@/services/product'

// ─────────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────────────────────────────────────

function Toast({ message, type = 'success' }) {
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-6 py-3
                    ${bgColor} text-white text-[13px] font-light rounded-sm shadow-xl
                    transition-all duration-300 whitespace-nowrap`}>
      {message}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE LIGHTBOX COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function ImageLightbox({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center"
        onClick={onClose}
      />
      <div 
        className="fixed inset-0 z-[71] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="relative max-w-2xl max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            src={imageUrl}
            alt="Review photo"
            className="max-w-full max-h-[90vh] object-contain rounded"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

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
// REVIEW MODAL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function ReviewModal({ item, orderId, onClose, onSubmit, onError }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos([...photos, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the review submission API
      const reviewData = {
        product_id: item.product_id || item.id, // Use product_id, fallback to id if not available
        order_id: orderId,
        rating: rating,
        review: reviewText,
        photos: photos
      };

      await submitProductReview(reviewData);

      // Call the success callback
      onSubmit({ rating, reviewText, photos });

      setTimeout(() => {
        onClose();
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      console.error('Error submitting review:', error);
      setIsSubmitting(false);
      // Call the error callback if provided
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">Write a Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-[#1a1a1a] text-[20px]">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Product Info */}
          <div className="flex gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[#1a1a1a] line-clamp-2">{item.name}</p>
              {item.variant && <p className="text-[11px] text-gray-400 mt-0.5">{item.variant}</p>}
            </div>
          </div>

          {/* Rating */}
          <div>
            <p className="text-[12px] font-semibold text-[#1a1a1a] mb-2">Your Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-[24px] transition-colors"
                >
                  {star <= (hoveredRating || rating) ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <p className="text-[12px] font-semibold text-[#1a1a1a] mb-2">Your Review</p>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full border border-gray-300 rounded-sm p-3 text-[12px] font-light
                         resize-none focus:outline-none focus:border-gray-500 h-24"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <p className="text-[12px] font-semibold text-[#1a1a1a] mb-2">Add Photos</p>
            <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-sm p-4 cursor-pointer hover:border-gray-400 transition-colors">
              <div className="flex flex-col items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                </svg>
                <span className="text-[11px] text-gray-500 font-light">Click to upload photos</span>
              </div>
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>

            {/* Photo Preview */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative w-full aspect-square bg-gray-100 rounded-sm overflow-hidden">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[12px] hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 text-[#1a1a1a] text-[12px] font-light
                       hover:border-[#1a1a1a] hover:bg-gray-50 transition-colors rounded-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700 disabled:opacity-50
                       text-white text-[12px] font-medium transition-colors rounded-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

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

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [reviews, setReviews] = useState({}); // Map of product_id -> review
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch existing reviews for this order
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await getOrderReviews(orderId);

        // Handle nested response structure
        let reviewsData = response;
        if (response.data) {
          reviewsData = response.data.data || response.data;
        }

        // Create a map of product_id -> review
        const reviewsMap = {};
        if (Array.isArray(reviewsData)) {
          reviewsData.forEach(review => {
            reviewsMap[review.product_id] = review;
          });
        }
        setReviews(reviewsMap);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        // Don't show error toast, reviews are optional
      } finally {
        setLoadingReviews(false);
      }
    };

    if (orderId) {
      fetchReviews();
    }
  }, [orderId]);

  const handleOpenReview = (item) => {
    setSelectedItemForReview(item);
    setShowReviewModal(true);
  };

  const handleCloseReview = () => {
    setShowReviewModal(false);
    setSelectedItemForReview(null);
  };

  const handleSubmitReview = async (reviewData) => {
    // Success callback from ReviewModal
    showToast('Thank you! Your review has been submitted successfully.', 'success');

    // Refetch reviews to display the newly submitted review with full details from API
    try {
      setLoadingReviews(true);
      const response = await getOrderReviews(orderId);

      // Handle nested response structure
      let reviewsData = response;
      if (response.data) {
        reviewsData = response.data.data || response.data;
      }

      // Create a map of product_id -> review
      const reviewsMap = {};
      if (Array.isArray(reviewsData)) {
        reviewsData.forEach(review => {
          reviewsMap[review.product_id] = review;
        });
      }
      setReviews(reviewsMap);
    } catch (error) {
      console.error('Failed to refetch reviews:', error);
      // Fallback: show review data locally even if refetch fails
      if (selectedItemForReview) {
        setReviews(prev => ({
          ...prev,
          [selectedItemForReview.product_id || selectedItemForReview.id]: {
            product_id: selectedItemForReview.product_id || selectedItemForReview.id,
            rating: reviewData.rating,
            comment: reviewData.review,
            photos: reviewData.photos,
            user: {
              first_name: 'You',
              last_name: ''
            },
            created_at: new Date().toISOString()
          }
        }));
      }
    } finally {
      setLoadingReviews(false);
    }

    handleCloseReview();
  };

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

                      {/* Check if review exists for this product */}
                      {reviews[item.product_id || item.id] ? (
                        // Show existing review
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {/* Reviewer info */}
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-[11px] font-semibold text-[#1a1a1a]">
                                {reviews[item.product_id || item.id].user?.first_name} {reviews[item.product_id || item.id].user?.last_name}
                              </p>
                              {reviews[item.product_id || item.id].created_at && (
                                <p className="text-[10px] text-gray-400 font-light">
                                  {new Date(reviews[item.product_id || item.id].created_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {/* Rating */}
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-[12px] ${i < reviews[item.product_id || item.id].rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Review comment */}
                          <p className="text-[11px] text-gray-700 font-light leading-relaxed">{reviews[item.product_id || item.id].comment}</p>

                          {/* Review photos */}
                          {reviews[item.product_id || item.id].photos && reviews[item.product_id || item.id].photos.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {reviews[item.product_id || item.id].photos.map((photo, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedImage(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/storage/${photo}`)}
                                  className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden border border-gray-200 hover:border-gray-400 hover:scale-110 transition-all cursor-pointer flex-shrink-0"
                                >
                                  <img
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/storage/${photo}`}
                                    alt={`Review photo ${idx}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Show review button for delivered orders
                        orderStatusId === 4 && (
                          <button
                            onClick={() => handleOpenReview(item)}
                            className="text-[11px] text-[#FF8989] font-light mt-2 hover:underline"
                          >
                            Write a Review
                          </button>
                        )
                      )}
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

      {/* Review Modal */}
      {showReviewModal && selectedItemForReview && (
        <ReviewModal
          item={selectedItemForReview}
          orderId={orderId}
          onClose={handleCloseReview}
          onSubmit={handleSubmitReview}
          onError={(error) => showToast('Failed to submit review. Please try again.', 'error')}
        />
      )}

      {/* Image Lightbox */}
      <ImageLightbox 
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Toast Notification */}
      {toast && <Toast message={toast} type={toastType} />}
    </div>
  )
}
