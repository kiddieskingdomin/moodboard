import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiStar,
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiBox,
  FiLayers,
  FiCalendar,
  FiMaximize,
  FiDroplet,
  FiPackage,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronDown,
  FiCreditCard,
  FiInfo,
} from "react-icons/fi";
import ProductEnquiryForm from "./ProductEnquiryForm";

/* ---------------- Helpers ---------------- */

const formatINR = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
    : n;

const discountPct = (mrp, price) =>
  mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

const Stars = ({ value = 0 }) => {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className="text-amber-400"
          style={{ fill: i < full ? "currentColor" : "none" }}
        />
      ))}
    </div>
  );
};

/* ---------------- Simple Accordion ---------------- */

/* ---------------- Simple Accordion (pro-grade) ---------------- */
function Accordion({ items = [], defaultOpen = 0, single = true }) {
  const [open, setOpen] = useState(typeof defaultOpen === "number" ? defaultOpen : -1);
  const isOpen = i => (single ? open === i : Array.isArray(open) && open.includes(i));

  const toggle = i => {
    if (single) setOpen(p => (p === i ? -1 : i));
    else setOpen(p => {
      const s = new Set(Array.isArray(p) ? p : []);
      s.has(i) ? s.delete(i) : s.add(i);
      return Array.from(s);
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {items.map((it, i) => (
        <div key={i} className="border-t first:border-t-0 border-slate-200">
          <button
            type="button"
            onClick={() => toggle(i)}
            aria-expanded={isOpen(i)}
            className="flex w-full items-center justify-between gap-4 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <div className="flex items-center gap-2 text-slate-900">
              {it.icon ? <it.icon className="h-4 w-4 text-slate-500" /> : null}
              <span className="text-lg font-semibold">{it.title}</span>
            </div>
            <FiChevronDown
              className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${isOpen(i) ? "rotate-180" : "rotate-0"
                }`}
            />
          </button>

          {/* fully collapses: no leftover padding */}
          <div
            className={`overflow-hidden transition-all duration-200 ease-out ${isOpen(i) ? "max-h-[1000px] px-4 pb-4" : "max-h-0 px-4 pb-0"
              }`}
          >
            <div className="text-sm text-slate-700">{it.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}


/* ---------------- Spec list as mini-accordion ---------------- */

function SpecsAccordion({ specs = [] }) {
  const iconMap = {
    material: FiBox,
    "recommended age": FiCalendar,
    "included pieces": FiLayers,
    "tray size": FiMaximize,
    color: FiDroplet,
    packaging: FiPackage,
    care: FiRefreshCw,
    "what's not included": FiAlertCircle,
  };

  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="rounded-xl border border-slate-200">
      {specs.map((s, i) => {
        const Icon = iconMap[s.label?.toLowerCase?.()] || null;
        const open = openIndex === i;
        return (
          <div key={i} className="border-b last:border-b-0">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(p => (p === i ? -1 : i))}
              className="flex w-full items-center justify-between gap-3 p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              <div className="flex items-center gap-2">
                {Icon ? <Icon className="h-4 w-4 text-slate-500" /> : null}
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {s.label}
                </dt>
              </div>
              <FiChevronDown
                className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : "rotate-0"
                  }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-200 ease-out ${open ? "max-h-[600px] px-3 pb-3" : "max-h-0 px-3 pb-0"
                }`}
            >
              <dd className="text-sm leading-snug text-slate-800">{s.value}</dd>
            </div>
          </div>
        );
      })}
    </div>
  );
}


/* ---------------- Related Slider ---------------- */

const RelatedSlider = ({ items = [] }) => {
  const ref = React.useRef(null);
  const scrollBy = (dx) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });
  if (!items.length) return null;
  return (
    <section className="mt-14">
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] text-slate-900">Related products</h3>
        <div className="flex gap-2">
          <button onClick={() => scrollBy(-320)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-800">
            <FiChevronLeft />
          </button>
          <button onClick={() => scrollBy(320)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-800">
            <FiChevronRight />
          </button>
        </div>
      </div>
      <div ref={ref} className="mt-4 flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
        {items.map((p) => (
          <Link key={p.id ?? p.url ?? p.title} to={p.url} className="min-w-[240px] max-w-[240px] rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100">
              <img src={p.thumbnail || p.image || "/placeholder.png"} alt={p.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-3">
              <div className="line-clamp-2 text-sm text-slate-900">{p.title}</div>
              <div className="mt-2 text-slate-800">{formatINR(p.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
/* ---------------- Info Rows (below info stripe) ---------------- */
function InfoRows({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
      {items.map((it, i) => (
        <div key={i} className="flex items-start justify-between gap-4 border-t p-4 first:border-t-0">
          <div className="flex items-start gap-3">
            {it.icon ? <it.icon className="mt-1 h-6 w-6 text-slate-600" /> : null}
            <div>
              <div className="text-base font-semibold text-slate-900">{it.title}</div>
              <div className="text-sm text-slate-600">{it.subtitle}</div>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600"
            aria-label="More info"
          >
            <FiInfo />
          </button>
        </div>
      ))}
    </div>
  );
}


/* ---------------- Main Page ---------------- */

export default function ProductDetail() {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [state, setState] = useState("loading");
  const [selImg, setSelImg] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const handleEnquiry = () => setShowEnquiryModal(true);

  const norm = (s = "") => s.replace(/\/+$/, "");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/data.json", { cache: "no-store" });
        const json = await res.json();
        if (mounted) {
          setData(Array.isArray(json) ? json : []);
          setState("idle");
        }
      } catch (e) {
        console.error(e);
        setState("error");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const product = useMemo(
    () => data.find((p) => p.slug === slug || norm(p.url || "").endsWith(norm(slug || ""))),
    [data, slug]
  );

  useEffect(() => {
    setSelImg(0);
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    const relIds = new Set(product.related || []);
    return data.filter((p) => relIds.has(p.id));
  }, [data, product]);

  if (state === "loading") {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
        <div className="h-64 animate-pulse rounded-2xl bg-[#faf7f2]" />
      </main>
    );
  }

  if (state === "error") {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
        <p className="rounded-xl bg-rose-50 p-4 text-rose-700 ring-1 ring-rose-200">Couldn’t load products. Please refresh and try again.</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
        <p className="text-slate-600">Product not found.</p>
      </main>
    );
  }

  const placeholder = "/placeholder.png";
  const imgsRaw = product.gallery?.length ? product.gallery : [product.thumbnail || product.image || placeholder];
  const imgs = imgsRaw.filter(Boolean);
  const safeSel = Math.min(selImg, Math.max(0, imgs.length - 1));
  const pct = discountPct(product.mrp, product.price);

  const handleWhatsApp = () => {
    if (!product) return;
    const message = `Hi, I have an enquiry about the product: ${product.title}.`;
    const whatsappURL = `https://wa.me/919877047723?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  /* -------------- Accordion payload -------------- */
  const accordionItems = [
    {
      title: "Description",
      icon: null,
      content: product.shortDescription ? (
        <p>{product.shortDescription}</p>
      ) : (
        <p className="text-slate-500">No description available.</p>
      ),
    },
    {
      title: "Highlights",
      content: product.highlights?.length ? (
        <ul className="space-y-2">
          {product.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <FiCheckCircle className="mt-0.5 text-[#6FB08B]" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500">No highlights provided.</p>
      ),
    },
    {
      title: "Product Details", 
      content: product.specifications?.length ? (
        <SpecsAccordion specs={product.specifications} />
      ) : (
        <p className="text-slate-500">No additional details.</p>
      ),
    },
  ];

  return (
    <main className="bg-[#FFFDFB]">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-500">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          <span>/</span>{" "}
          <Link to="/shop-all" className="hover:underline">
            Shop
          </Link>{" "}
          <span>/</span> <span className="text-slate-800">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* Left: sticky images */}
          <div className="self-start lg:sticky lg:top-20">
            <div className="grid grid-cols-[70px_1fr] gap-4">
              {/* thumbnails */}
              <div className="flex flex-col gap-3">
                {imgs.map((src, i) => (
                  <button
                    key={(src || "img") + i}
                    onClick={() => setSelImg(i)}
                    className={`overflow-hidden rounded-xl ring-1 ring-slate-200 ${i === safeSel ? "outline outline-2 outline-violet-400" : ""}`}
                  >
                    <img src={src} alt="" className="h-16 w-16 object-cover" />
                  </button>
                ))}
              </div>

              {/* main image */}
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                <div className="aspect-[4/3] sm:aspect-[4/3]">
                  <img
                    src={imgs[safeSel] || placeholder}
                    alt={product.title || "Product image"}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div className="lg:minh-[70vh]">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">{product.category}</span>

            <h1 className="text-[28px] leading-tight text-slate-900 md:text-[34px]">{product.title}</h1>

            {/* rating + reviews + stock */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2">
                <Stars value={product.rating} />
                <span className="text-slate-700">{Number(product.rating || 0).toFixed(1)}</span>
                <span className="text-slate-500">({product.reviews} reviews)</span>
              </span>
              <span className="mx-2 hidden sm:inline-block text-slate-300">|</span>
              <span className="inline-flex items-center gap-2 text-slate-600">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${product.inStock ? "bg-[#4F9F5B]" : "bg-slate-300"}`} />
                {product.inStock ? "In stock" : "Out of stock"}
              </span>
            </div>

            {/* price row */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="text-2xl font-semibold text-slate-900">{formatINR(product.price)}</div>
              {product.mrp && product.mrp > product.price && (
                <>
                  <div className="text-lg text-slate-500 line-through">{formatINR(product.mrp)}</div>
                  <span className="rounded-full bg-[#EAF4F2] px-3 py-1 text-sm text-[#276D55] ring-1 ring-[#CDE7E1]">{pct}% OFF</span>
                </>
              )}
            </div>

            {/* info stripe */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
              <div className="inline-flex items-center gap-2">
                <FiTruck /> {product.shipInfo || "Fast shipping across India"}
              </div>
              <div className="inline-flex items-center gap-2">
                <FiShield /> {product.warranty || "Quality checked"}
              </div>
            </div>
            {/* new: info rows under stripe */}
{(() => {
  const infoItems = [
    {
      icon: FiBox,
      title: product.inStock ? "In stock, order now" : "Currently unavailable",
      subtitle: product.inStock ? "In stock, order now" : "We’ll restock soon",
    },
    {
      icon: FiCreditCard,
      title: "Secure payments",
      subtitle: "Pay safely with Credit Card, PayPal, Apple Pay or Google Pay",
    },
    {
      icon: FiShield,
      title: "Safety & quality assured",
      subtitle: product.certText || "CE-certified manufacturing",
    },
  ];
  return <InfoRows items={infoItems} />;
})()}

                        {/* badges */}
            {product.badges?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
            ) : null}

            {/* MAIN ACCORDION: Description (open), Highlights, Product Details */}
            <div className="mt-6">
              <Accordion items={accordionItems} defaultOpen={0} single />
            </div>


            {/* Buttons: Enquiry and WhatsApp */}
            <div className="mt-8 flex flex-wrap gap-5">
              <button
                onClick={handleEnquiry}
                className="inline-flex items-center justify-center rounded-xl bg-[#ef927d] px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#c6634d] focus:outline-none focus:ring-2 focus:ring-[#6B63C8] focus:ring-opacity-50"
              >
                Enquire about this product
              </button>

              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center rounded-xl border border-[#ef927d] px-8 py-4 text-lg font-semibold text-[#4CAF50] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#ef927d] hover:text-[#ffff] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-50"
              >
                WhatsApp us
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        <RelatedSlider items={related} />
      </section>

      <ProductEnquiryForm product={product} isOpen={showEnquiryModal} onClose={() => setShowEnquiryModal(false)} />
    </main>
  );
}
