// src/components/CategoriesShowcase.jsx
import React from "react";
import { Link } from "react-router-dom";

// छोटा helper function slug बनाने के लिए
const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

const items = [
  {
    title: "Furniture",
    img: "category/furniture.png", // put images in /public
    bg: "#F5E8EF", // pastel pink
  },
  {
    title: "Jungle Gym",
    img: "category/jungle gym.png",
    bg: "#F7EDCC", // pastel sand
  },
  {
    title: "Pretend Play",
    img: "category/pretend n play.png",
    bg: "#EAF1F8", // pastel blue
  },
];

const CategoriesShowcase = () => {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] leading-tight text-[#f2ae7f] md:text-[34px] font-extrabold">
            Inspire Creativity,{" "}
            <span className="text-[#d8a298]">Spark Innovation</span>
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600 font-bold">
            Encourage innovation and artistic expression with our range of
            creative play essentials
          </p>
        </div>

        {/* Cards */}
        <div className="mt-2 grid gap-5 sm:grid-cols-1 md:grid-cols-3">
          {items.map((it) => (
            <Link
              key={it.title}
              to={`/category/${slugify(it.title)}`}
              className="group block font-bold"
              aria-label={it.title}
            >
              <div
                className="relative overflow-hidden rounded-3xl p-4 md:p-1 ring-1 ring-black/5 transition-transform duration-200 group-hover:-translate-y-0.5"
                style={{ backgroundColor: it.bg }}
              >
                <img
                  src={it.img}
                  alt={it.title}
                  className="mx-auto h-56 w-full object-cover md:h-64 rounded-3xl"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 text-center">
                <span className="text-base md:text-lg text-[#d8a298]">
                  {it.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesShowcase;
