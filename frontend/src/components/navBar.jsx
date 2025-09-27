import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { usePopup } from "./PopupContext";

const TopNavBar = ({ cartCount = 0 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setShowPopup } = usePopup();

  // Fetch categories from data.json
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
        
        // Get unique categories from products
        const uniqueCategories = [...new Set(data
          .map(product => product.category)
          .filter(category => category && category.trim() !== '')
        )].sort();

        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleQuickOpen = () => setShowPopup(true);

  // Static navigation items
  const navItems = [
    {
      label: "Shop All",
      to: "/shop-all",
    },
    {
      label: "About Us",
      to: "/about-us",
    },
    {
      label: "Blog",
      to: "/Blogs",
    },
    {
      label: "Contact Us",
      to: "/contact-us",
    },
  ];

  if (loading) {
    return (
      <>
        <header className="fixed top-0 z-50 w-full bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid h-16 grid-cols-3 items-center gap-3">
              <div className="flex items-center">
                <button className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-700">
                  <FiMenu className="text-xl" />
                </button>
                <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 w-80">
                  <FiSearch className="text-violet-800" />
                  <div className="w-full bg-gray-200 h-4 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="justify-self-center">
                <Link to="/">
                  <img src="/kk_logo.webp" alt="Kiddies Kingdom" className="block h-10 w-auto md:h-14" />
                </Link>
              </div>
              <div className="flex items-center justify-end">
                <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-violet-200 px-4 py-2">
                  <div className="w-20 bg-gray-200 h-4 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Loading categories */}
          <nav className="border-t border-amber-100 bg-[#fff2ea]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <ul className="hidden h-12 items-center justify-center gap-6 md:flex">
                {[...Array(5)].map((_, i) => (
                  <li key={i} className="flex items-stretch">
                    <div className="w-20 bg-gray-200 h-4 rounded animate-pulse"></div>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>
        <div className="h-16 md:h-[112px]" />
      </>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all ${scrolled ? "bg-white backdrop-blur" : "bg-white"
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid h-16 grid-cols-3 items-center gap-3">
            {/* LEFT: search (md+) or menu (mobile) */}
            <div className="flex items-center">
              <button
                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <FiMenu className="text-xl" />
              </button>

              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 w-80 focus-within:ring-2 focus-within:ring-violet-300"
                role="search"
              >
                <FiSearch className="text-violet-800" aria-hidden />
                <input
                  name="q"
                  type="search"
                  placeholder="Search our store"
                  className="w-full bg-transparent text-sm placeholder-slate-400 focus:outline-none"
                />
              </form>
            </div>

            {/* CENTER: logo */}
            <div className="justify-self-center">
              <Link to="/" aria-label="Kiddies Kingdom home">
                <img
                  src="/kk_logo.webp"
                  alt="Kiddies Kingdom"
                  className="block h-10 w-auto md:h-14"
                />
              </Link>
            </div>

            {/* RIGHT: quick shop btn */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleQuickOpen}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-violet-200 px-4 py-2 text-sm font-medium text-[#d8a298] hover:bg-violet-50"
                title="Quick Shop"
              >
                <FiSearch />
                Quick Shop
              </button>
            </div>
          </div>
        </div>
        
        {/* Category strip */}
        <nav
          aria-label="Categories"
          className="border-t border-amber-100 bg-[#fff2ea]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ul className="hidden h-12 items-center justify-center gap-6 md:flex">
              <li className="flex items-stretch">
                <Link
                  to="/"
                  className="flex items-center text-base font-medium text-[#d8a298]"
                >
                  Home
                </Link>
              </li>

              {/* CATEGORIES DROPDOWN */}
              <li className="group relative flex items-stretch">
                <button
                  className="flex items-center gap-1 text-base font-medium text-[#d8a298]"
                >
                  Categories
                  <FiChevronDown className="mt-px text-[18px]" />
                </button>

                {/* underline on active/hover */}
                <span className="pointer-events-none absolute -bottom-[10px] h-[3px] w-0 bg-[#d8a298] transition-all duration-300 group-hover:w-10" />

                {/* Mega dropdown for all categories */}
                <div className="invisible absolute left-0 top-full z-40 w-64 translate-y-2 rounded-lg border border-amber-100 bg-amber-50 p-3 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="space-y-1">
                    {categories.map((category) => (
                      <li key={category}>
                        <Link
                          to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block rounded-md px-3 py-2 text-sm text-violet-800 hover:bg-white hover:text-[#d8a298]"
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* Other static navigation items */}
              {navItems.map((item) => (
                <li key={item.label} className="flex items-stretch">
                  <Link
                    to={item.to}
                    className="flex items-center text-base font-medium text-[#d8a298]"
                  >
                    {item.label}
                  </Link>
                  <span className="pointer-events-none absolute -bottom-[10px] h-[3px] w-0 bg-[#d8a298] transition-all duration-300 group-hover:w-10" />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[85%] max-w-sm transform bg-white shadow-xl transition-transform md:hidden ${open ? "translate-x-0" : "-translate-x-full"
          }`}
        role="dialog"
        aria-label="Mobile Menu"
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <img src="/kk_logo.webp" alt="Kiddies Kingdom" className="h-7" />
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="mb-3 flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
            <FiSearch className="text-violet-800" />
            <input
              name="q"
              type="search"
              placeholder="Search our store"
              className="w-full bg-transparent text-sm placeholder-slate-400 focus:outline-none"
            />
          </form>

          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 font-medium text-[#d8a298] hover:bg-violet-50"
            >
              Home
            </Link>

            {/* Categories dropdown for mobile */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 font-medium text-[#d8a298] hover:bg-violet-50">
                Categories
                <FiChevronDown className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pl-3">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-violet-800 hover:bg-amber-50"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </details>

            {/* Other static links */}
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 font-medium text-[#d8a298] hover:bg-violet-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* spacer */}
      <div className="h-16 md:h-[112px]" />
    </>
  );
};

export default TopNavBar;