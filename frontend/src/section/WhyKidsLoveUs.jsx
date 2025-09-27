// src/components/WhyKidsLoveUs.jsx
import React from "react";
import { FiCheck } from "react-icons/fi";

const points = [
  "Loved by 1,00,000+ parents",
  "100% child safe & eco‑friendly",
  "Proven to support brain development",
  "Montessori‑inspired for meaningful growth",
];

const WhyKidsLoveUs = () => {
  return (
    <section className="py-12 md:py-16 bg-[#fff2ea]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left: image */}
          <div>
            <img
              src="/About.png" // put your image in /public
              alt="Parent and child learning together"
              className="w-full rounded-3xl object-cover shadow-sm ring-1 ring-black/5"
            />
          </div>

          {/* Right: text */}
          <div className="relative">
            {/* headline */}
            <h2 className="text-[30px] leading-tight text-slate-800 md:text-[40px] font-normal">
              We are obsessed with
              helping every child reach their potential.
              <br />
             
            </h2>

            {/* pastel underline brush */}
            <svg
              className="mt-2"
              width="260"
              height="12"
              viewBox="0 0 260 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 10c40-8 80-8 120-8s80 0 116 0"
                stroke="#F6B1A2"      /* soft coral */
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>

            {/* checklist */}
            <ul className="mt-6 space-y-4">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#DDF0E8]">
                    <FiCheck className="text-[#3D9A7A]" />
                  </span>
                  <span className="text-[17px] leading-7 text-slate-700">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyKidsLoveUs;
