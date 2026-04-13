// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

import bannerImage from "@/assets/banners/video-banner.png";
// import bannerVideo from "@/assets/banners/video-banner.mp4";  // ← uncomment when ready

const USE_VIDEO = false;  // ← switch to true when video is ready

// ─────────────────────────────────────────────────────────────────────────────

export default function VideoBanner() {
  return (
    <section
      className="w-full mx-auto overflow-hidden"
      style={{ maxWidth: "1920px" }}
    >
      {USE_VIDEO ? (
        // ── VIDEO ─────────────────────────────────────────────────────────────
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full object-cover h-[80vh]"
          style={{
            display:   "block",
            maxHeight: "800px",
            // Mobile: no max height — fills naturally
          }}
        >
          {/* <source src={bannerVideo} type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>
      ) : (
        // ── IMAGE FALLBACK ────────────────────────────────────────────────────
        <img
          src={bannerImage}
          alt="Video Banner"
          draggable={false}
          className="w-full object-cover select-none h-[80vh]"
          style={{
            display:   "block",
            maxHeight: "800px",
          }}
        />
      )}
    </section>
  );
}