import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiStar, FiHeart } from "react-icons/fi";

const Stars = ({ value = 0 }) => {
  // show 5 stars with soft amber fill for filled ones
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} className={i < full ? "fill-amber-300" : ""} />
      ))}
    </div>
  );
};
const getDiscountPct = (mrp, price) =>
  mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
const formatPrice = (amount) => {
  if (typeof amount === "number") {
    try {
      return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      });
    } catch {
      return amount.toString();
    }
  }
  if (typeof amount === "string") return amount; // already like "₹1150.0"
  return "—";
};
const StockBadge = ({ inStock }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span className={`inline-block h-2.5 w-2.5 rounded-full ${inStock ? "bg-[#4F9F5B]" : "bg-slate-300"}`} />
    {inStock ? "In stock" : "Out of stock"}
  </div>
);

const Price = ({ amount }) => (
  <div className="mt-3 text-lg text-slate-800">
    {amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </div>
);

const Card = ({ item }) => {
  const pct = getDiscountPct(item.mrp, item.price);

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* image */}
      <Link to={item.url} className="block overflow-hidden rounded-t-2xl">
        <div className="aspect-[4/3] w-full bg-slate-100">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </Link>

      {/* body */}
      <div className="space-y-3 rounded-b-2xl border-t border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <StockBadge inStock={item.inStock} />
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Stars value={item.rating} />
            <span className="text-slate-500">({item.reviews})</span>
          </div>
        </div>

        <Link to={item.url} className="block text-base leading-6 text-slate-900 hover:underline">
          {item.title}
        </Link>

        {/* ✅ Price row with discount */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="text-lg font-semibold text-slate-900">
            {formatPrice(item.price)}
          </div>

          {item.mrp && item.mrp > item.price && (
            <>
              <div className="text-sm text-slate-500 line-through">
                {formatPrice(item.mrp)}
              </div>
              {pct > 0 && (
                <span className="rounded-full bg-[#EAF4F2] px-2.5 py-0.5 text-xs font-medium text-[#276D55] ring-1 ring-[#CDE7E1]">
                  {pct}% OFF
                </span>
              )}
            </>
          )}
        </div>

        <Link
          to={item.url}
          className="mt-3 inline-flex w-full items-center justify-center rounded-full border-2 border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
        >
          View product
        </Link>
      </div>
    </div>
  );
};


const Bestsellers = () => {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("idle"); // idle | loading | error

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setState("loading");
        const res = await fetch("/data.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch data.json");
        const data = await res.json();
        if (mounted) {
          setItems(Array.isArray(data) ? data : []);
          setState("idle");
        }
      } catch (e) {
        setState("error");
        console.error(e);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-[28px] md:text-[32px] text-slate-800">Our bestsellers</h2>

        {state === "error" && (
          <p className="mt-6 text-center text-sm text-rose-600">Couldn’t load products. Check <code>public/data.json</code>.</p>
        )}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 8).map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Bestsellers;
