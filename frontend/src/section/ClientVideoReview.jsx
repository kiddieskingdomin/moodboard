import React, { useState, useRef, useEffect } from "react";
import { FiPlay } from "react-icons/fi";

const DEFAULT_ITEMS = [
  { id: 1, video: "/review/blog1.MOV" },
  { id: 2, video: "/review/blog2.MOV" },
  { id: 3, video: "/review/blog3.mp4" },
  { id: 4, video: "/review/blog4.mp4" },
];

const PlayOverlay = () => (
  <span className="pointer-events-none absolute inset-0 grid place-items-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/65 text-white">
      <FiPlay className="ml-0.5 text-2xl" />
    </span>
  </span>
);

function VideoCard({ src, onOpen }) {
  const vidRef = useRef(null);

  const handleEnter = () => {
    const v = vidRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.play().catch(() => {});
  };

  const handleLeave = () => {
    const v = vidRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <button
      type="button"
      className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition-shadow hover:shadow-md focus:outline-none"
      onClick={onOpen}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="relative" style={{ aspectRatio: "9 / 16" }}>
        {/* Inline silent preview. No poster or title, as requested. */}
        <video
          ref={vidRef}
          src={src}
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <PlayOverlay />
      </div>
    </button>
  );
}

const ParentsTrustSection = ({ items = DEFAULT_ITEMS }) => {
  const [open, setOpen] = useState(null); // string | null (video src)

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <section className="bg-[#fff2ea] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <h2 className="text-[28px] md:text-[40px] leading-tight text-slate-800 font-normal">
          Why over <span className="text-[#F2A393]">1,00,000</span> parents have trusted us
          <span className="text-[#76B2A8]">.</span>
        </h2>

        {/* Video grid (videos only) */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <VideoCard key={it.id} src={it.video} onOpen={() => setOpen(it.video)} />
          ))}
        </div>
      </div>

      {/* Modal for focused playback with sound & controls */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fit video within viewport without cropping */}
            <video
              src={open}
              controls
              autoPlay
              playsInline
              className="h-auto w-auto max-h-[85vh] max-w-[85vw] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ParentsTrustSection;
