// src/pages/ContactPage.jsx
import React, { useState } from "react";
import {
  FiPhone,
  FiMail,
  FiMessageCircle,
  FiMapPin,
  FiClock,
  FiBookOpen,
  FiUser,
  FiSend,
  FiInstagram,
  FiFacebook,
  FiYoutube,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Label = ({ children }) => (
  <label className="mb-1 block text-xs text-slate-600">{children}</label>
);

const Input = (props) => (
  <input
    {...props}
    className={[
      "w-full rounded-xl border-2 border-slate-200 bg-slate-50",
      "px-4 py-3 text-sm outline-none transition-colors",
      "focus:border-[#A4D0C9] focus:bg-white",
      props.className || "",
    ].join(" ")}
  />
);

const Select = (props) => (
  <select
    {...props}
    className={[
      "w-full rounded-xl border-2 border-slate-200 bg-slate-50",
      "px-4 py-3 text-sm outline-none transition-colors",
      "focus:border-[#A4D0C9] focus:bg-white",
      "appearance-none",
      props.className || "",
    ].join(" ")}
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className={[
      "w-full rounded-xl border-2 border-slate-200 bg-slate-50",
      "px-4 py-3 text-sm outline-none transition-colors",
      "focus:border-[#A4D0C9] focus:bg-white",
      "resize-none",
      props.className || "",
    ].join(" ")}
  />
);

export default function ContactPage() {
  // simple client validation
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    age: "",
    interest: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!data.name || !data.email || !data.phone) {
      setError("Please fill name, email and phone.");
      return;
    }
    setSubmitting(true);
    try {
      // TODO: replace with your real endpoint
      // await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      await new Promise((r) => setTimeout(r, 900));
      setOk(true);
      setData({
        name: "",
        email: "",
        phone: "",
        city: "",
        age: "",
        interest: "",
        message: "",
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FFF2ea]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-10">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-[#F6EBDD] px-4 py-1 text-sm text-slate-700 ring-1 ring-slate-200">
            Contact Kiddies Kingdom
          </span>
          <h1 className="mt-3 text-[36px] md:text-[44px] leading-tight text-slate-800">
            We’re here to help with{" "}
            <span className="text-[#d8a298]">playful picks</span> &{" "}
            <span className="text-[#f2ae7f]">quick support</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Questions about age-wise toys, an order, or something else? Reach
            out any time — our play specialists reply fast.
          </p>
        </div>
      </section>

      {/* Quick contact cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: FiPhone,
              title: "Call us",
              text: "+91 9876543210",
              to: "tel:+919800000000",
              bg: "#EAF4F2",
            },
            {
              icon: FiMail,
              title: "Email",
              text: "hello@kiddieskingdom.in",
              to: "mailto:hello@kiddieskingdom.in",
              bg: "#F6EBDD",
            },
            {
              icon: FiMessageCircle,
              title: "WhatsApp",
              text: "Chat instantly",
              to: "https://wa.me/919800000000",
              bg: "#F5EDF5",
            },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group flex items-center gap-3 rounded-2xl p-4 ring-1 ring-slate-200 hover:shadow-sm"
              style={{ backgroundColor: c.bg }}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                <c.icon className="text-slate-700" />
              </span>
              <div>
                <div className="text-slate-900">{c.title}</div>
                <div className="text-sm text-slate-600 group-hover:underline">
                  {c.text}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Map + Hours + Address + Form */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-14">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: details + map */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <div className="flex items-center gap-2 text-slate-900">
                <FiMapPin /> Store & Office
              </div>
              <p className="mt-1 text-slate-600">
                2nd Floor, Rainbow Plaza, MG Road, Delhi 1100xx, India
              </p>
              <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-slate-200">
                {/* Replace with your map src */}
                <iframe
                  title="Kiddies Kingdom Map"
                  src="https://www.google.com/maps?q=Delhi&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <div className="flex items-center gap-2 text-slate-900">
                <FiClock /> Store Hours
              </div>
              <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <span>Mon – Fri</span>
                <span>10:00 AM – 7:00 PM</span>
                <span>Saturday</span>
                <span>10:00 AM – 6:00 PM</span>
                <span>Sunday</span>
                <span>Closed</span>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Online orders ship Mon–Sat excluding public holidays.
              </p>
            </div>
          </div>

          {/* Right: contact form */}
          <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <h2 className="text-[20px] text-slate-900">Send us Link message</h2>
            <p className="text-sm text-slate-600 mt-1">
              We usually respond within Link few hours.
            </p>

            {ok ? (
              <div className="mt-5 rounded-2xl bg-[#DDF0E8] p-4 text-[#276D55]">
                Thanks! Your message is on its way. We’ll get back shortly.
              </div>
            ) : null}

            {error && !ok ? (
              <div className="mt-5 rounded-2xl bg-rose-50 p-3 text-rose-700 ring-1 ring-rose-200">
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Parent / Guardian name</Label>
                  <Input
                    name="name"
                    value={data.name}
                    onChange={onChange}
                    placeholder="e.g., Aarti Sharma"
                    required
                    aria-label="Parent or guardian name"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    type="tel"
                    value={data.phone}
                    onChange={onChange}
                    placeholder="+91 98xxxxxxx"
                    required
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    name="city"
                    value={data.city}
                    onChange={onChange}
                    placeholder="Delhi, India"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Child’s age</Label>
                  <Select
                    name="age"
                    value={data.age}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select age</option>
                    <option>0–12 months</option>
                    <option>1–3 years</option>
                    <option>4–7 years</option>
                    <option>8+ years</option>
                  </Select>
                </div>
                <div>
                  <Label>Interest</Label>
                  <Select
                    name="interest"
                    value={data.interest}
                    onChange={onChange}
                  >
                    <option value="">Choose interest</option>
                    <option>Pretend Play</option>
                    <option>Learning & STEM</option>
                    <option>Trains & Vehicles</option>
                    <option>Gross motor & furniture</option>
                    <option>Crafts & Puzzles</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  name="message"
                  value={data.message}
                  onChange={onChange}
                  rows={4}
                  placeholder="Tell us anything we should know…"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6B63C8] px-5 py-3 text-white transition-transform hover:scale-[1.01] disabled:opacity-70"
              >
                <FiSend /> {submitting ? "Sending…" : "Send message"}
              </button>

              <div className="pt-2 text-xs text-slate-500">
                By contacting us, you agree to our{" "}
                <Link to="/policies/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#ffe8ce]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <h2 className="text-[22px] text-slate-900">Quick answers</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "How fast do you reply?",
                Link: "Most messages get Link reply within Link few hours, 10 AM–7 PM (Mon–Sat).",
              },
              {
                q: "Where is my order?",
                Link: "Use Track Order in the menu; or share your order ID here and we’ll check.",
              },
              {
                q: "Do you have COD?",
                Link: "Yes, COD is available for eligible pincodes with Link small convenience fee.",
              },
              {
                q: "Is everything safe for toddlers?",
                Link: "Yes — we curate EN-71/BIS compliant toys with non-toxic finishes.",
              },
            ].map((f) => (
              <details
                key={f.q}
                className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none text-slate-900">
                  {f.q}
                </summary>
                <p className="mt-2 text-slate-600">{f.Link}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Social row */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <div className="text-slate-800">Follow us for play ideas</div>
          <div className="flex items-center gap-4 text-[22px]">
            <Link
              aria-label="Instagram"
              to="https://www.instagram.com/official_kiddieskingdom?igsh=MXJjd2FrMjc0czlrbQ%3D%3D&utm_source=qr"
              className="text-slate-700 hover:text-slate-900"
            >
              <FiInstagram />
            </Link>
            <Link
              aria-label="Facebook"
              to="https://www.facebook.com/share/1RibokccBk/?mibextid=wwXIfr"
              className="text-slate-700 hover:text-slate-900"
            >
              <FiFacebook />
            </Link>
            <Link
              aria-label="YouTube"
              to="https://youtube.com"
              className="text-slate-700 hover:text-slate-900"
            >
              <FiYoutube />
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ToyStore",
            name: "Kiddies Kingdom",
            telephone: "+919800000000",
            email: "hello@kiddieskingdom.in",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Rainbow Plaza, MG Road",
              addressLocality: "Delhi",
              addressCountry: "IN",
            },
            url: "https://kiddieskingdom.in",
            openingHours: "Mo-Sa 10:00-19:00",
          }),
        }}
      />
    </main>
  );
}
