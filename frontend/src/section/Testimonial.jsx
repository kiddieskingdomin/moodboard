// src/components/RealParents.jsx
import React from "react";

const items = [
  {
    img: "/review/1.png",
    quote:
      "The toys keep both my kids engaged without screens. Setup was easy and quality feels premium.",
    author: "Aarohi • Mumbai",
  },
  {
    img: "/review/2.png",
    quote:
      "My daughter looks forward to playtime now. Simple ideas, big impact on her focus.",
    author: "Rahul • Delhi",
  },
  {
    img: "/review/3.png",
    quote:
      "Loved the Montessori approach—she explores independently and learns every day.",
    author: "Maya • Bengaluru",
  },
  {
    img: "/review/4.png",
    quote:
      "Safe materials and thoughtful activities. Perfect for our baby’s routine.",
    author: "Nikhil • Pune",
  },
];

const RealParents = () => {
  return (
    <section className="bg-[#ffe8ce] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <h2 className="text-[28px] md:text-[36px] leading-tight text-slate-800 font-normal flex items-center gap-3">
          <span className="text-[#F2A393] text-4xl md:text-5xl">“</span>
          Real Parents, Real Results
        </h2>

        {/* Cards */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
            >
              {/* Image */}
              <img
                src={it.img}
                alt="Parent with child"
                className="h-72 w-full object-cover md:h-80 transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />

              {/* Slide-up testimonial */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-white/95 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                <div className="p-4">
                  <p className="text-slate-800 text-sm leading-6">
                    {it.quote}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{it.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealParents;
