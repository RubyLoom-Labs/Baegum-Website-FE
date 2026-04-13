import { useState } from "react";

// ── Star component ────────────────────────────────────────────────────────────
function Star({ filled, half, size = 16, onClick, onHover }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={filled || half ? "#1a1a1a" : "none"}
      stroke="#1a1a1a" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
      onClick={onClick}
      onMouseEnter={onHover}
      style={{ cursor: onClick ? "pointer" : "default", flexShrink: 0 }}
    >
      {half ? (
        <>
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon fill="url(#half)" stroke="#1a1a1a"
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </>
      ) : (
        <polygon fill={filled ? "#1a1a1a" : "none"} stroke="#1a1a1a"
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      )}
    </svg>
  );
}

function StarRow({ rating, size = 16, interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || rating) : rating;

  return (
    <div
      className="flex items-center gap-0.5 relative"
      onMouseLeave={interactive ? () => setHovered(0) : undefined}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          filled={i <= display}
          onClick={interactive ? () => onChange(i) : undefined}
          onHover={interactive ? () => setHovered(i) : undefined}
        />
      ))}
    </div>
  );
}

// ── Sample reviews — replace with API data ────────────────────────────────────
const SAMPLE_REVIEWS = [];

// ── Avatar placeholder ────────────────────────────────────────────────────────
function Avatar({ src, name, size = 44 }) {
  return src ? (
    <img src={src} alt={name} width={size} height={size}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }} />
  ) : (
    <div
      className="rounded-full bg-gray-200 flex items-center justify-center
                 flex-shrink-0 text-gray-500 font-medium text-[13px]"
      style={{ width: size, height: size }}
    >
      {name?.[0]?.toUpperCase() || "U"}
    </div>
  );
}

// ── Image Lightbox ────────────────────────────────────────────────────────────
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

// ── Single review card ────────────────────────────────────────────────────────
function ReviewCard({ review, onImageClick }) {
  const userName = review.user?.first_name && review.user?.last_name
    ? `${review.user.first_name} ${review.user.last_name}`
    : review.user;

  const userEmail = review.user?.email || review.email || '';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return `${apiUrl}/storage/${photo}`;
  };

  return (
    <div className="py-6 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <Avatar src={review.avatar} name={userName} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <div>
              <p className="text-[13px] font-medium text-[#1a1a1a]">{userName}</p>
              {userEmail && <p className="text-[11px] text-gray-400 font-light">{userEmail}</p>}
            </div>
            <StarRow rating={review.rating} size={14} />
          </div>
          <p className="text-[11px] text-gray-400 font-light mb-2">
            {formatDate(review.created_at || review.date)}
          </p>
          <p className="text-[13px] text-gray-700 font-light leading-relaxed">
            {review.comment}
          </p>
          {review.photos?.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {review.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => onImageClick(getPhotoUrl(photo))}
                  className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0 border border-gray-200 hover:border-gray-400 hover:scale-110 transition-all cursor-pointer"
                >
                  <img
                    src={getPhotoUrl(photo)}
                    alt={`Review photo ${i}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Review Modal for writing reviews ──────────────────────────────────────────
export function ReviewModal({ productId, onClose, onSubmit, onError, isSubmitting = false }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [error, setError] = useState(null);

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewPhotos(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    const reviewData = {
      rating,
      review: reviewText,
      photos
    };

    await onSubmit(reviewData);
    setRating(0);
    setReviewText('');
    setPhotos([]);
    setPreviewPhotos([]);
    setError(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[61] flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-[500px] rounded-sm shadow-xl p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          <h3 className="text-[18px] font-light text-[#1a1a1a] mb-6">Write a Review</h3>

          {error && <p className="text-[11px] text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>}

          {/* Star rating */}
          <div className="mb-5">
            <p className="text-[12px] font-medium text-[#1a1a1a] mb-3">Rating</p>
            <StarRow rating={rating} size={28} interactive onChange={setRating} />
          </div>

          {/* Review text */}
          <div className="mb-5">
            <p className="text-[12px] font-medium text-[#1a1a1a] mb-2">Your Review</p>
            <textarea
              placeholder="Share your thoughts about this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-4 py-3 text-[13px]
                         text-[#1a1a1a] placeholder-gray-400 font-light outline-none
                         focus:border-gray-500 transition-colors resize-none"
            />
          </div>

          {/* Photo upload */}
          <div className="mb-6">
            <p className="text-[12px] font-medium text-[#1a1a1a] mb-3">Add Photos (Optional)</p>

            {/* Photo previews */}
            {previewPhotos.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {previewPhotos.map((preview, idx) => (
                  <div key={idx} className="relative w-20 h-20 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                    <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute top-0.5 right-0.5 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded text-[12px] font-light text-[#1a1a1a] hover:bg-gray-50 cursor-pointer transition-colors">
              <span>+ Add Photo</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-300 text-[#1a1a1a] text-[13px] font-light
                         px-4 py-3 hover:border-[#1a1a1a] hover:bg-gray-50
                         active:bg-gray-100 transition-colors rounded-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700
                         text-white text-[13px] font-light px-4 py-3 transition-colors
                         rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Comment / Review form ─────────────────────────────────────────────────────
function ReviewForm({ isLoggedIn, openLogin, onWriteReview }) {
  return (
    <button
      onClick={() => {
        if (!isLoggedIn) {
          openLogin();
          return;
        }
        onWriteReview();
      }}
      className="px-6 py-3.5 bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700
                 text-white text-[13px] font-medium tracking-wide
                 transition-colors rounded"
    >
      Write a Review
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW SECTION — main export
// ─────────────────────────────────────────────────────────────────────────────

export default function ReviewSection({ productId, reviews = SAMPLE_REVIEWS, avgRating, isLoggedIn = false, openLogin, onWriteReview }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // Calculate average rating from reviews if not provided
  const calculatedAvgRating = avgRating || (
    reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0
  );

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-[20px] font-light text-[#1a1a1a] tracking-wide">Reviews</h2>
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-light text-[#1a1a1a]">
            {calculatedAvgRating}
            <span className="text-[14px] text-gray-400 font-light"> / 5</span>
          </span>
          <StarRow rating={Math.round(calculatedAvgRating)} size={18} />
        </div>
      </div>

      {/* Review list */}
      <div>
        {reviews && reviews.length > 0 ? (
          reviews.map((r) => <ReviewCard key={r.id} review={r} onImageClick={setSelectedImage} />)
        ) : (
          <p className="text-[13px] text-gray-500 py-4">No reviews yet. Be the first to review this product!</p>
        )}
      </div>

      {/* Write a review */}
      <div className="mt-8">
        <h3 className="text-[16px] font-medium text-[#1a1a1a] mb-4 tracking-wide">
          Write a Review
        </h3>
        <ReviewForm isLoggedIn={isLoggedIn} openLogin={openLogin} onWriteReview={onWriteReview} />
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
}
