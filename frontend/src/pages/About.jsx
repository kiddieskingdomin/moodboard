// src/pages/AboutPage.jsx
import React from "react";
import {
  FiHeart,
  FiAward,
  FiBox,
  FiUsers,
  FiShield,
  FiSmile,
  FiBookOpen,
  FiTruck,
  FiStar,
  FiMessageCircle,
  FiCheckCircle,
  FiGlobe,
  FiPhone,
  FiArrowRight,
  FiActivity,
  FiHome,
  FiRepeat,
  FiCloudLightning,
} from "react-icons/fi";
import { usePopup } from "../components/PopupContext";
import { Link } from "react-router-dom";
const Stat = ({ icon: Icon, label, value, bg = "#F3F4F6" }) => (
  <div
    className="flex items-center gap-3 rounded-2xl p-4 ring-1 ring-slate-200"
    style={{ backgroundColor: bg }}
  >
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
      <Icon className="text-slate-700" />
    </span>
    <div>
      <p className="text-[13px] text-slate-500">{label}</p>
      <p className="text-xl text-slate-900">{value}</p>
    </div>
  </div>
);

const Pill = ({ children, icon: Icon }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200">
    {Icon ? <Icon className="text-slate-600" /> : null}
    {children}
  </span>
);
export default function AboutPage() {
  const { setShowPopup } = usePopup();
  const handleQuickOpen = () => setShowPopup(true);
  return (
    <main className="bg-[#FFF2ea]">
      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-14">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            {/* Badge */}
            <span className="inline-block rounded-full bg-[#d8a298] px-4 py-1 text-sm font-medium text-white ring-1 ring-[#d8a298] mb-3">
              About Kiddies Kingdom
            </span>
            <h1 className="text-[40px] leading-[1.1] text-slate-800 md:text-[48px]">
              Handcrafted wooden toys for{" "}
              <span className="text-[#d8a298]">imagination</span>,{" "}
              <span className="text-[#dcc5b3]">play</span> &{" "}
              <span className="text-[#f2ae7f]">motor skills</span>.
            </h1>
            <p className="mt-3 max-w-xl text-slate-600">
              We create high-quality, sustainable toys that inspire children to
              explore, dream, and grow—while giving families playful moments in
              the comfort & safety of home.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Pill icon={FiShield}>Safety Tested</Pill>
              <Pill icon={FiShield}>Sustainably Made</Pill>
              <Pill icon={FiActivity}>Boosts Motor Skills</Pill>
            </div>
          </div>

          <div className="relative">
            {/* hero collage */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/about/about1.webp"
                alt="Kids playing with toys"
                className="h-64 w-full rounded-3xl object-cover ring-1 ring-slate-200"
              />
              <img
                src="/about/about2.webp"
                alt="Handcrafted wooden toys"
                className="h-64 w-full rounded-3xl object-cover ring-1 ring-slate-200"
              />
              <img
                src="/about/about3.webp"
                alt="Active play indoors"
                className="h-56 w-full rounded-3xl object-cover ring-1 ring-slate-200"
              />
              <img
                src="/about/about4.webp"
                alt="Sustainable toy collection"
                className="h-56 w-full rounded-3xl object-cover ring-1 ring-slate-200"
              />
            </div>
          </div>
        </div>

        {/* hero stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={FiUsers}
            label="Families served"
            value="10,000+"
            bg="#F6EBDD"
          />
          <Stat
            icon={FiAward}
            label="Quality checks"
            value="20+ per product"
            bg="#EAF4F2"
          />
          <Stat
            icon={FiBox}
            label="Curated toys"
            value="160+ products"
            bg="#F5EDF5"
          />
          <Stat
            icon={FiGlobe}
            label="Pan-India delivery"
            value="26,000+ pincodes"
            bg="#F7F6E8"
          />
        </div>
      </section>

      {/* ---------------- Story ---------------- */}
      <section className="bg-[#ffe8ce]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <div className="grid gap-10 md:grid-cols-2 items-start">
            <div>
              <h2 className="text-[32px] text-slate-800">Our Story</h2>
              <p className="mt-3 text-slate-700">
                Kiddies Kingdom began with one promise: create toys that turn
                energy and curiosity into meaningful play. As parents and
                educators, we know toddlers climb furniture and kiddos never
                stop moving—so we designed safe, durable, and joyful toys to
                channel that energy.
              </p>
              <p className="mt-3 text-slate-700">
                From handcrafted wooden sets to STEM-inspired kits, every
                product sparks imagination, builds motor skills, and makes
                playtime something parents feel proud to bring into their home.
              </p>
              <div className="mt-5 flex gap-2 flex-wrap">
                <Pill icon={FiHeart}>Parent-favourite</Pill>
                <Pill icon={FiStar}>Kid-approved</Pill>
                <Pill icon={FiHome}>Indoor active play</Pill>
              </div>
            </div>

            {/* timeline */}
            <ol className="space-y-5">
              {[
                {
                  year: "2023",
                  title: "Nationwide shipping",
                  text: "Better packaging, faster deliveries.",
                },
                {
                  year: "2025",
                  title: "1L+ families",
                  text: "A growing community choosing safe, sustainable play.",
                },
              ].map((t) => (
                <li
                  key={t.year}
                  className="relative rounded-2xl bg-white p-4 ring-1 ring-slate-200"
                >
                  <div className="text-[13px] text-slate-500">{t.year}</div>
                  <div className="text-lg text-slate-900 mt-0.5">{t.title}</div>
                  <p className="text-slate-600 mt-1">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- Values grid ---------------- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <h2 className="text-[28px] text-slate-800">What we care about</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: FiShield,
              title: "Safety first",
              text: "EN-71 & BIS compliant, non-toxic paints, rounded edges.",
              bg: "#EAF1F8",
              img: "/about/about1.webp",
            },
            {
              icon: FiShield,
              title: "Planet kind",
              text: "Sustainably sourced wood, recyclable packaging.",
              bg: "#E6F4F1",
              img: "/about/about2.webp",
            },
            {
              icon: FiBookOpen,
              title: "Learning rich",
              text: "Montessori & STEM ideas for fine motor, focus, creativity.",
              bg: "#F5E8EF",
              img: "/about/about3.webp",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="overflow-hidden rounded-3xl ring-1 ring-slate-200"
              style={{ backgroundColor: v.bg }}
            >
              <img src={v.img} alt="" className="h-44 w-full object-cover" />
              <div className="p-5">
                <v.icon className="text-slate-700" />
                <div className="mt-2 text-lg text-slate-900">{v.title}</div>
                <p className="text-slate-600 mt-1">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ---------------- Innovation, Adaptability & Empathy ---------------- */}
      <section className="bg-[#ffe8ce]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          {/* Top: Mission & Vision */}
          <div className="rounded-3xl bg-white ring-1 ring-slate-200 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[#E0F2E9] px-3 py-1 text-xs font-medium text-[#256C4E] ring-1 ring-[#BFE7D1]">
                INSPIRATION & SOCIAL RESPONSIBLE
              </span>
              <span className="inline-flex items-center rounded-full bg-[#E8F3F3] px-3 py-1 text-xs font-medium text-[#2D6B6A] ring-1 ring-[#CDE6E6]">
                Mission & Vision
              </span>
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-slate-900">
              Play that grows with every child
            </h2>
            <p className="mt-3 text-slate-700 leading-7">
              Our versatile and innovative wooden products promote active and
              creative play. We are proud to inspire families to live play‑full
              lives. Our goal is to be the worldwide market leader in
              sustainable and socially responsible toys and furniture for kids'
              integral development.
            </p>
          </div>

          {/* Values Grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Innovation */}
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECF7F0] ring-1 ring-[#D7ECDC]">
                  <FiCloudLightning className="h-5 w-5 text-[#6FB08B]" />
                </div>
                <h3 className="text-[22px] font-semibold text-slate-800">
                  Innovation
                </h3>
              </div>
              <p className="mt-3 text-slate-700 leading-7">
                At Kiddies Kingdom, we take an innovative approach to how we
                think, produce, and design toys relevant to the current needs of
                children and families. We provide transparency with suppliers,
                customers, and our team, including the origin of raw materials,
                environmental impact, contribution to community development, and
                reasons for delays.
              </p>
            </div>

            {/* Adaptability */}
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF4F5] ring-1 ring-[#D3EAEC]">
                  <FiRepeat className="h-5 w-5 text-[#6CA6A3]" />
                </div>
                <h3 className="text-[22px] font-semibold text-slate-800">
                  Adaptability
                </h3>
              </div>
              <p className="mt-3 text-slate-700 leading-7">
                We adapt to constant changes in the world, the market, ways of
                working, and the evolving needs of all families.
              </p>
            </div>

            {/* Empathy */}
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F4EEF7] ring-1 ring-[#E6DAEE]">
                  <FiHeart className="h-5 w-5 text-[#A277C7]" />
                </div>
                <h3 className="text-[22px] font-semibold text-slate-800">
                  Empathy
                </h3>
              </div>
              <p className="mt-3 text-slate-700 leading-7">
                We are empathetic in our relationships and communication, both
                internal and external.
              </p>
            </div>
          </div>
        </div>

        {/* Tiny footnote line for visual balance on light backgrounds */}
      </section>

      {/* ---------------- Gallery mosaic ---------------- */}
      {/* <section className="bg-[#F5F0FF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <h2 className="text-[28px] text-slate-800">
            A peek into our play-lab
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {[
              "g1",
              "g2",
              "g3",
              "g4",
              "g5",
              "g6",
              "g7",
              "g8",
              "g9",
              "g10",
              "g11",
              "g12",
            ].map((k) => (
              <img
                key={k}
                src={`/about/gallery/${k}.jpg`}
                alt=""
                className="aspect-square w-full rounded-2xl object-cover ring-1 ring-slate-200"
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* ---------------- Press / badges ---------------- */}
      <section className="bg-[#fff2ea]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="grid gap-6 md:grid-cols-3 items-center">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 text-center">
              <FiAward className="mx-auto text-slate-700" />
              <p className="mt-2 text-slate-800">
                BIS & EN-71 compliant partners
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 text-center">
              <FiTruck className="mx-auto text-slate-700" />
              <p className="mt-2 text-slate-800">
                Secure, recyclable packaging
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 text-center">
              <FiSmile className="mx-auto text-slate-700" />
              <p className="mt-2 text-slate-800">
                Hassle-free replacement support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <h2 className="text-[28px] text-slate-800">FAQs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            {
              q: "Are your toys safe for toddlers?",
              a: "Yes. We work with makers who meet EN-71/BIS standards; finishes are water-based and edges are rounded.",
            },
            {
              q: "How do you choose toys by age?",
              a: "We follow child-development milestones and test with educators; listings show recommended age bands.",
            },
            {
              q: "What is your return policy?",
              a: "7-day easy returns for unused products in original packaging; replacements for transit damage are prioritized.",
            },
            {
              q: "Do you ship pan-India?",
              a: "Yes, via trusted partners; most orders arrive in 3–6 working days depending on pincode.",
            },
          ].map((f) => (
            <details
              key={f.q}
              className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none text-slate-900">
                {f.q}
              </summary>
              <p className="mt-2 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------------- Contact strip ---------------- */}
      <section className="bg-[#ffe8ce]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="grid items-center gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="text-[24px] text-slate-900">
                Want personalised toy picks?
              </h3>
              <p className="text-slate-700">
                Tell us your child’s age & interests — our play specialists will
                help.
              </p>
            </div>
            <div className="flex gap-3 md:justify-end">
              <Link
                to="tel:+917542003073"
                className="inline-flex items-center gap-2 rounded-full bg-[#ef927d] px-5 py-3 text-white"
              >
                <FiPhone /> Talk to us
              </Link>
              <button
                onClick={handleQuickOpen}
                className="inline-flex items-center gap-2 rounded-full border border-[#ef927d] bg-white px-5 py-3 text-[#ef927d]"
              >
                Shop now <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Footer spacer (optional) ---------------- */}
      <div className="h-6" />
    </main>
  );
}
