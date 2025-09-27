// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="relative pt-6 md:pt-4"
    style={{
      background: 'linear-gradient(180deg,#fff2ea,#fff 95%)'
    }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* big rounded card */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#fedcdb] ring-1 ring-[#fedcdb] shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
        >
          {/* blob accents */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-amber-100/60 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-pink-100/60 blur-2xl" />

          <div className="grid items-center gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-10 lg:p-14">
            {/* LEFT: text */}
            <div className="order-2 md:order-1">
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                <span className="block text-[#476c82]">DREAM,</span>
                <span className="block text-[#ef927d]">DISCOVER,</span>
                <span className="block text-[#9ec081]">INVENT!</span>
              </h1>

              <div className="mt-4 h-1 w-10 rounded-full bg-pink-300 md:mt-6" />

              <p className="mt-4 max-w-xl text-2xl font-medium text-slate-700 md:mt-6">
                Toys that spark imagination and turn ideas into adventures.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
                <Link
                  to="/shop-all"
                  className="inline-flex items-center justify-center rounded-full bg-[#ef927d] px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#ef927d]"
                >
                  Shop Now <FiArrowRight className="ml-2" />
                </Link>

                {/* <Link
                  to="/pretend-play"
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#ef927d] bg-white px-6 py-3 text-base font-bold text-[#ef927d] transition hover:bg-pink-50"
                >
                  Pretend Play
                </Link> */}
              </div>
            </div>

            {/* RIGHT: main image */}
            <div className="order-1 md:order-2">
              <div className="relative">
                {/* cute badge/star */}

                <img
                  src="/hero_image.png"
                  alt="Kids playing pretend burger shop"
                  className="mx-auto w-full max-w-[560px] rounded-2xl object-cover"
                />
                {/* optional corner round to match reference frame */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default Hero;
