// src/pages/SearchPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiStar } from "react-icons/fi";

/* ---------- Small shared bits copied from ProductsPage ---------- */
const Stars = ({ value = 0 }) => {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} className={i < full ? "fill-amber-300" : ""} />
      ))}
    </div>
  );
};

const StockBadge = ({ inStock }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        inStock ? "bg-[#4F9F5B]" : "bg-slate-300"
      }`}
    />
    {inStock ? "In stock" : "Out of stock"}
  </div>
);

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
  if (typeof amount === "string") return amount;
  return "—";
};

const Card = ({ item }) => (
  <div className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
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

    <div className="space-y-3 rounded-b-2xl border-t border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <StockBadge inStock={item.inStock} />
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Stars value={item.rating} />
          <span className="text-slate-500">({item.reviews})</span>
        </div>
      </div>

      <Link
        to={item.url}
        className="block text-base leading-6 text-slate-900 hover:underline"
      >
        {item.title}
      </Link>

      <div className="mt-3 text-lg text-slate-800">{formatPrice(item.price)}</div>

      <Link
        to={item.url}
        className="mt-3 inline-flex w-full items-center justify-center rounded-full border-2 border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
      >
        View product
      </Link>
    </div>
  </div>
);

/* ---------------- Search Page ---------------- */
const PAGE_SIZE = 16;

export default function SearchPage() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("idle"); // idle | loading | error
  const [searchParams, setSearchParams] = useSearchParams();

  const q = useMemo(() => (searchParams.get("q") || "").trim(), [searchParams]);

  // current page from URL, defaults 1
  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return Number.isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

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
        console.error(e);
        setState("error");
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  // basic matcher: title, category, tags, description if present
  const filtered = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return items.filter((it) => {
      const hay =
        `${it.title || ""} ${it.category || ""} ${it.tags || ""} ${
          it.description || ""
        }`.toLowerCase();
      return hay.includes(needle);
    });
  }, [items, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = (clampedPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const goToPage = (p) => {
    const page = Math.min(Math.max(p, 1), totalPages);
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-6">
        <div>
          <span className="inline-block rounded-full bg-[#F6EBDD] px-4 py-1 text-sm text-slate-700 ring-1 ring-slate-200">
            Search
          </span>
          <h1 className="mt-3 text-[28px] md:text-[34px] leading-tight text-slate-800">
            Results for “{q || "—"}”
          </h1>
          <p className="mt-1 text-slate-600 text-sm">
            {q ? `${filtered.length} item(s) found` : "Type something to search."}
          </p>
        </div>

        {state === "error" && (
          <p className="mt-6 text-sm text-rose-600">
            Couldn’t load products. Check <code>public/data.json</code>.
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {state === "loading" &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
              />
            ))}

          {state !== "loading" && q && pageItems.length === 0 && (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              No matching products.
            </div>
          )}

          {pageItems.map((item, idx) => (
            <Card key={`${item.id}-${start + idx}`} item={item} />
          ))}
        </div>

        {/* Pagination */}
        {q && totalPages > 1 && (
          <nav
            className="mt-10 flex items-center justify-center gap-2"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(clampedPage - 1)}
              disabled={clampedPage <= 1}
              className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-800 disabled:opacity-50"
            >
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isEdge = page === 1 || page === totalPages;
                const isNear = Math.abs(page - clampedPage) <= 1;
                if (!isEdge && !isNear) {
                  if (page === 2 && clampedPage > 3) return <span key={page}>…</span>;
                  if (page === totalPages - 1 && clampedPage < totalPages - 2)
                    return <span key={page}>…</span>;
                  return null;
                }
                const active = page === clampedPage;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`h-9 w-9 rounded-full text-sm ${
                      active
                        ? "bg-violet-900 text-white"
                        : "border border-slate-300 text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(clampedPage + 1)}
              disabled={clampedPage >= totalPages}
              className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-800 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
