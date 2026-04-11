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
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          filled={i <= display}
          onClick={interactive ? () => onChange(i) : undefined}
          onHover={interactive ? () => setHovered(i) : undefined}
        />
      ))}
      {interactive && (
        <span
          className="ml-1"
          onMouseLeave={() => setHovered(0)}
          style={{ position: "absolute", width: `${size * 5 + 8}px`, height: size }}
        />
      )}
    </div>
  );
}

// ── Sample reviews — replace with API data ────────────────────────────────────
const SAMPLE_REVIEWS = [
  {
    id: 1,
    user: "test01@gamil.com",
    date: "09/09/2025",
    rating: 5,
    comment: "Stylish, Comfortable, and Perfect for Everyday Wear!",
    images: [null, null, null],
    avatar: null,
  },
  {
    id: 2,
    user: "test02@gamil.com",
    date: "09/09/2025",
    rating: 5,
    comment: "Stylish, Comfortable, and Perfect for Everyday Wear!",
    images: [null, null],
    avatar: null,
  },
];

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

// ── Single review card ────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="py-6 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <Avatar src={review.avatar} name={review.user} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <p className="text-[13px] font-medium text-[#1a1a1a]">{review.user}</p>
            <StarRow rating={review.rating} size={14} />
          </div>
          <p className="text-[11px] text-gray-400 font-light mb-2">
            Date - {review.date}
          </p>
          <p className="text-[13px] text-gray-700 font-light leading-relaxed">
            {review.comment}
          </p>
          {review.images?.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.images.map((img, i) => (
                <div key={i}
                  className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Comment / Review form ─────────────────────────────────────────────────────
function ReviewForm({ onSubmit, isLoggedIn, openLogin }) {
  const [rating,  setRating]  = useState(0);
  const [comment, setComment] = useState("");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!rating)  e.rating  = "Please select a rating";
    if (!comment.trim()) e.comment = "Please write a comment";
    if (!name.trim())    e.name    = "Name is required";
    if (!email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
    // TODO: call API
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-[14px] font-medium text-[#1a1a1a]">Thank you for your review!</p>
        <p className="text-[12px] text-gray-400 font-light">Your review has been submitted for approval.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      {/* Star rating picker */}
      <div>
        <p className="text-[13px] font-medium text-[#1a1a1a] mb-2">Your Rating</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={24} filled={i <= rating}
              onClick={() => setRating(i)} onHover={() => {}} />
          ))}
        </div>
        {errors.rating && <p className="text-[11px] text-red-500 mt-1">{errors.rating}</p>}
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded px-4 py-3 text-[13px]
                       text-[#1a1a1a] placeholder-gray-400 font-light outline-none
                       focus:border-gray-400 transition-colors"
            style={{ borderColor: errors.name ? "#ef4444" : undefined }}
          />
          {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded px-4 py-3 text-[13px]
                       text-[#1a1a1a] placeholder-gray-400 font-light outline-none
                       focus:border-gray-400 transition-colors"
            style={{ borderColor: errors.email ? "#ef4444" : undefined }}
          />
          {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Comment */}
      <div>
        <textarea
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border border-gray-200 rounded px-4 py-3 text-[13px]
                     text-[#1a1a1a] placeholder-gray-400 font-light outline-none
                     focus:border-gray-400 transition-colors resize-none"
          style={{ borderColor: errors.comment ? "#ef4444" : undefined }}
        />
        {errors.comment && <p className="text-[11px] text-red-500 mt-1">{errors.comment}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full md:w-auto md:px-12 py-3.5 bg-[#1a1a1a] hover:bg-gray-800
                   active:bg-gray-700 text-white text-[13px] font-medium tracking-wide
                   transition-colors disabled:opacity-60 disabled:cursor-not-allowed rounded"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW SECTION — main export
// ─────────────────────────────────────────────────────────────────────────────

export default function ReviewSection({ reviews = SAMPLE_REVIEWS, avgRating = 4.9, isLoggedIn = false, openLogin }) {
  return (
    <section className="mt-12 pt-8 border-t border-gray-200">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-[20px] font-light text-[#1a1a1a] tracking-wide">Reviews</h2>
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-light text-[#1a1a1a]">
            {avgRating}
            <span className="text-[14px] text-gray-400 font-light"> / 5</span>
          </span>
          <StarRow rating={Math.round(avgRating)} size={18} />
        </div>
      </div>

      {/* Review list */}
      <div>
        {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
      </div>

      {/* Write a review */}
      <div className="mt-8">
        <h3 className="text-[16px] font-medium text-[#1a1a1a] mb-4 tracking-wide">
          Write a Review
        </h3>
        <ReviewForm isLoggedIn={isLoggedIn} openLogin={openLogin} />
      </div>
    </section>
  );
}