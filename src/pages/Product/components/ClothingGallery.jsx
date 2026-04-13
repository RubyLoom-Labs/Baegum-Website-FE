// ─────────────────────────────────────────────────────────────────────────────
// CLOTHING GALLERY
// Layout matches your design:
//   [  tall main  ] [ top-right ]
//   [  tall main  ] [ bot-right ]
//   [  wide bottom image       ]
//
// Props:
//   images — array of up to 4 image URLs
// ─────────────────────────────────────────────────────────────────────────────

export default function ClothingGallery({ images = [] }) {
  const [main, top, bot, wide] = [
    images[0] ?? null,
    images[1] ?? null,
    images[2] ?? null,
    images[3] ?? null,
  ];

  const placeholder = (key) => (
    <div key={key} className="w-full h-full bg-gray-200" />
  );

  return (
    <div className="flex flex-col gap-2">

      {/* Top section: tall main + two stacked thumbnails */}
      <div className="flex gap-2">

        {/* Main tall image — takes ~60% width */}
        <div className="flex-[3] overflow-hidden bg-gray-100"
          style={{ aspectRatio: "3/4" }}>
          {main
            ? <img src={main} alt="Main" draggable={false}
                className="w-full h-full object-cover object-top select-none" />
            : placeholder("main")}
        </div>

        {/* Right column — two stacked squares */}
        <div className="flex-[2] flex flex-col gap-2">
          <div className="overflow-hidden bg-gray-100 flex-1">
            {top
              ? <img src={top} alt="View 2" draggable={false}
                  className="w-full h-full object-cover object-top select-none" />
              : placeholder("top")}
          </div>
          <div className="overflow-hidden bg-gray-100 flex-1">
            {bot
              ? <img src={bot} alt="View 3" draggable={false}
                  className="w-full h-full object-cover object-top select-none" />
              : placeholder("bot")}
          </div>
        </div>
      </div>

      {/* Bottom wide image */}
      <div className="overflow-hidden bg-gray-100 w-full"
        style={{ aspectRatio: "16/9" }}>
        {wide
          ? <img src={wide} alt="View 4" draggable={false}
              className="w-full h-full object-cover object-top select-none" />
          : placeholder("wide")}
      </div>
    </div>
  );
}