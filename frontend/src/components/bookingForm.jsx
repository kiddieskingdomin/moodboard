import React, { useState } from "react";

export const PopupForm = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    city: "",
    childAge: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!show) return null;

  const handleInputChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: replace with your real API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose?.();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white text-slate-800 shadow-xl ring-1 ring-slate-200 relative">
        {/* Top bar (pastel) */}
        <div className="h-2 w-full bg-[#F6C9C3]" />

        {/* Close */}
   <button
    onClick={onClose}
    className="absolute right-5 top-5 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
    aria-label="Close"
  >
    ×
  </button>

        <div className="p-6 md:p-8">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6EBDD] ring-1 ring-[#EFD9BE]">
                  {/* tiny toy icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-[#E59C2B]">
                    <path
                      fill="currentColor"
                      d="M7 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2h1a2 2 0 0 1 2 2v2h-2v10a2 2 0 0 1-2 2h-2v-7H9v7H7a2 2 0 0 1-2-2V9H3V7a2 2 0 0 1 2-2h2Zm2 0h6v2H9V5Z"
                    />
                  </svg>
                </div>
                <h2 className="text-[22px] leading-tight text-slate-800">
                  Tell us about your little one
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  We’ll suggest the right toys and get back within a few minutes.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-600">Parent / Guardian name</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      placeholder="e.g., Aarti Sharma"
                      required
                      className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#A4D0C9] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-600">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#A4D0C9] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-600">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98xxxxxxx"
                      required
                      className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#A4D0C9] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-600">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Delhi, India"
                      className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#A4D0C9] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-600">Child’s age</label>
                    <select
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      required
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#A4D0C9] focus:bg-white"
                    >
                      <option value="">Select age</option>
                      <option value="0-12m">0–12 months</option>
                      <option value="1-3y">1–3 years</option>
                      <option value="4-7y">4–7 years</option>
                      <option value="8y+">8+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-600">Interest</label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#A4D0C9] focus:bg-white"
                    >
                      <option value="">Choose interest</option>
                      <option value="pretend">Pretend Play</option>
                      <option value="learning">Learning & STEM</option>
                      <option value="vehicles">Trains & Vehicles</option>
                      <option value="furniture">Gross motor & furniture</option>
                      <option value="crafts">Crafts & Puzzles</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-600">Message (optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Tell us anything we should know…"
                    className="w-full resize-none rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#A4D0C9] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#6B63C8] px-4 py-3 text-white transition-transform hover:scale-[1.01] disabled:opacity-70"
                >
                  {isSubmitting ? "Sending…" : "Get toy suggestions & a callback"}
                </button>
              </form>

              {/* trust row */}
              <div className="mt-5 border-t border-slate-200 pt-4">
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#6FB08B]" />
                    Quick response
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#6CA6A3]" />
                    Secure & private
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#EFA8A8]" />
                    Curated by age & skills
                  </span>
                </div>
              </div>
            </>
          ) : (
            // success
            <div className="py-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF0E8]">
                <svg width="28" height="28" viewBox="0 0 24 24" className="text-[#3D9A7A]">
                  <path
                    fill="currentColor"
                    d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"
                  />
                </svg>
              </div>
              <h3 className="text-[20px] text-[#3D9A7A]">Thanks! We’ve got your request.</h3>
              <p className="mt-1 text-sm text-slate-600">
                A toy specialist will contact you shortly with age‑appropriate picks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
