import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiHome } from "react-icons/fi";

const ComingSoon = () => {
  return (
    <section className="flex h-screen items-center justify-center bg-[#fff2ea] px-6">
      <div className="text-center max-w-lg">
        {/* Illustration */}
        <img
          src="/coming-soon.png" // Add some cute toy/illustration SVG in public folder
          alt="Coming Soon"
          className="mx-auto mb-6 w-64"
        />

        {/* Title */}
        <h1 className="text-[40px] font-bold text-violet-800 mb-2">
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-lg">
          Oops! This page isn’t ready yet. <br /> We’re busy building something
          fun & magical for you 🎉
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-violet-800 px-6 py-3 text-white font-semibold shadow hover:bg-violet-700 transition"
          >
            <FiHome /> Back to Home
          </Link>

          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 rounded-full border-2 border-violet-800 px-6 py-3 text-violet-800 font-semibold hover:bg-violet-50 transition"
          >
            <FiClock /> Notify Me
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;
