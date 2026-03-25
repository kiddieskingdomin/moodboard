'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e6e3db]">
      <nav className="relative">
        <div className="max-w-[1200px] mx-auto h-16 lg:h-16 flex items-center px-4 md:px-7">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex-shrink-0"
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mr-7 flex-shrink-0"
          >
            <img
              alt="Kiddies Kingdom"
              width="140"
              height="50"
              className="h-[45px] w-auto object-contain"
              src="/main-logo.png"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 ml-6">
            <Link
              href="/"
              className="text-sm font-semibold text-[#1a1a1a] hover:text-[#D97B5A] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-[#1a1a1a] hover:text-[#D97B5A] transition-colors"
            >
              About Us
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-[#1a1a1a] hover:text-[#D97B5A] transition-colors">
                Shop
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-[#1a1a1a] hover:text-[#D97B5A] transition-colors">
                Collections
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-[#1a1a1a] hover:text-[#D97B5A] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[#1a1a1a] hover:text-[#D97B5A] transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            {/* Search */}
            <button
              className="p-2 text-[#1a1a1a] hover:bg-[#f0ede6] rounded-full transition-colors"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>

            {/* Wishlist (Desktop only) */}
            <Link
              href="/wishlist"
              className="hidden lg:flex p-2 text-[#1a1a1a] hover:bg-[#f0ede6] rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </Link>

            {/* Account (Desktop only) */}
            <Link
              href="/dashboard"
              className="hidden lg:flex p-2 text-[#1a1a1a] hover:bg-[#f0ede6] rounded-full transition-colors"
              aria-label="Account"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>

            {/* Cart */}
            <button
              className="relative p-2 text-[#1a1a1a] hover:bg-[#f0ede6] rounded-full transition-colors"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-[#D97B5A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                1
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
