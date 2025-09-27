// src/components/CustomPlaysetCallout.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { usePopup } from "../components/PopupContext";

const CustomPlaysetCallout = ({
  title = "2 in 1 Rotating BookShelf / Toy Organiser ₹15,953.00",
  blurb = "Have it your way. Create a custom climbing frame within minutes.",
  bullets = [
    "Saves on Floorspace",
    "Multi Functional, ideal storage for books and/or toys etc",
    "Rotates 360-degree",
    "Ample storage: 3 Tier Shelving + 6 smaller compartment boxes",
    "Stylish & Contemporary Design",
  ],
  primaryTo = "/designer",
}) => {
  const { setShowPopup } = usePopup();
  const handleQuickOpen = () => setShowPopup(true);
  return (
    <section className="bg-[#ffe8ce]">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2">
          {/* LEFT: image wrapper with fixed aspect ratio */}
          <div className="relative h-[320px] md:h-auto">
            <img
              src="/about/about3.webp"
              alt="Customisable climbing frame"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* RIGHT: content */}
          <div className="flex items-center bg-[#ffe8ce] px-6 py-10 md:px-10 lg:px-14 lg:py-16">
            <div>
              <h2 className="text-[28px] leading-tight text-slate-800 md:text-[34px]">
                {title}
              </h2>

              <p className="mt-3 max-w-xl text-slate-600">{blurb}</p>

              <ul className="mt-6 space-y-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#D9EDDC]">
                      <FiCheck className="text-[#4F9F5B]" />
                    </span>
                    <span className="text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-5">
                <button
                  onClick={handleQuickOpen}
                  className="rounded-full font-semibold bg-[#ef927d] px-6 py-3 text-white shadow-sm transition-colors hover:bg-[#fedcdb] hover:text-[#ef927d]"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomPlaysetCallout;
