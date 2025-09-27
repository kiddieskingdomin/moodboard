// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook, FiYoutube } from "react-icons/fi";

const collections = [
  { label: "Shop All", to: "/shop-all" },
  { label: "About Us", to: "/about-us" },
  { label: "Blog", to: "/blogs" },
  // { label: "Catelog", to: "/pretend-play" },
  { label: "Contact Us", to: "/contact-us" },
];

const quickLinks = [
  { label: "Refund Policy", to: "/refund-Policy" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Shipping Policy", to: "/shipping-policy" },
  { label: "Terms of Service", to: "/t&c" },
];

const Footer = () => {
  return (
    <footer className="bg-[#3E4173] text-[#D7DAF5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand + blurb */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/kk_logo.webp"
                alt="Kiddies Kingdom"
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-md leading-7">
              Embracing honesty and quality in design, production, and service,
              we invite you to join us in crafting joy‑filled learning
              adventures through meticulously crafted toys.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-[22px] underline underline-offset-4 decoration-[#D7DAF5]/60">
              Collections
            </h3>
            <ul className="mt-5 space-y-3">
              {collections.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick*/}
          <div className="">
            <div>
              <h3 className="text-[22px] underline underline-offset-4 decoration-[#D7DAF5]/60">
                Quick Link
              </h3>
              <ul className="mt-5 space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
                    {/* social link */}
          <div>
            <h3 className="text-[22px] underline underline-offset-4 decoration-[#D7DAF5]/60">
              Social Links
            </h3>

            <div className="mt-5 flex items-center gap-4 text-2xl">
              <Link
                to="https://www.instagram.com/official_kiddieskingdom/?igsh=MXJjd2FrMjc0czlrbQ%3D%3D&utm_source=qr#"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-white"
              >
                <FiInstagram />
              </Link>
              <Link
                href="https://www.facebook.com/profile.php?id=100091802261335&mibextid=wwXIfr&rdid=LkB7SvAqL3fa8dQS&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1RibokccBk%2F%3Fmibextid%3DwwXIfr#"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-white"
              >
                <FiFacebook />
              </Link>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="hover:text-white"
              >
                <FiYoutube />
              </a>
            </div>
           
          </div>
        </div>
      </div>

      {/* copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <p className="text-center text-sm text-[#C7CBF2]">
            Copyright © {new Date().getFullYear()} Kiddies Kingdom.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
