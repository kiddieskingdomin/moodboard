import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

// small helper to normalize text
const toNum = (v) => {
    if (v == null) return undefined;
    const n = Number(String(v).replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : undefined;
};

const formatINR = (n) =>
    typeof n === "number" ? n.toLocaleString("en-IN") : "";

const discountPct = (price, mrp) => {
    if (!price || !mrp || mrp <= 0 || price >= mrp) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
};

const norm = (s) => (typeof s === "string" ? s.toLowerCase() : "");

const fieldsToSearch = (p) => [
    norm(p.title || p.name),
    norm(p.description || p.desc),
    norm(p.category),
    norm(p.brand),
    norm(p.tags?.join(" ")),
    norm(p.sku),
    norm(p.id?.toString()),
];

export default function Search() {
    const q = useQuery().get("q") || "";
    const [data, setData] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setState({ loading: true, error: null });
                const res = await fetch("/data.json", { cache: "no-store" });
                const json = await res.json();
                if (!alive) return;
                const arr = Array.isArray(json) ? json : [];
                setData(arr);
                setState({ loading: false, error: null });
            } catch (e) {
                if (!alive) return;
                setState({ loading: false, error: "Failed to load products." });
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const results = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return [];
        // basic multi-term AND matching across several fields
        const parts = term.split(/\s+/g);
        return data.filter((p) => {
            const hay = fieldsToSearch(p).join(" ");
            return parts.every((part) => hay.includes(part));
        });
    }, [data, q]);

    if (state.loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
                <h1 className="text-xl font-semibold text-slate-800">Searching…</h1>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-3">
                            <div className="h-32 bg-slate-100 animate-pulse rounded" />
                            <div className="mt-3 h-4 w-3/4 bg-slate-100 animate-pulse rounded" />
                            <div className="mt-2 h-4 w-1/2 bg-slate-100 animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            </main>
        );
    }

    if (state.error) {
        return (
            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
                <h1 className="text-xl font-semibold text-red-600">{state.error}</h1>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Search</h1>
                    <p className="text-slate-600">
                        Results for <span className="font-medium">“{q || " "}”</span>
                    </p>
                </div>
                <div className="text-sm text-slate-500">
                    {q ? `${results.length} item${results.length === 1 ? "" : "s"}` : "Type something to search."}
                </div>
            </div>

            {!q && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
                    Type a query in the search bar above.
                </div>
            )}

            {q && results.length === 0 && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-900">
                    No matches found. Try fewer words or a different term.
                </div>
            )}

            {q && results.length > 0 && (
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.map((p) => {
                        const id = p.slug || p.id || p.sku || norm(p.title || p.name).replace(/\s+/g, "-");
                        const href = p.url || `/product/${id}`;
                        return (
                            <li key={id} className="rounded-lg border border-slate-200 p-3 hover:shadow-sm transition">
                                <Link to={href} className="block">
                                    <div className="aspect-[1/1] overflow-hidden rounded-lg bg-slate-50">
                                        <img
                                            src={p.image || p.images?.[0] || "/placeholder.webp"}
                                            alt={p.title || p.name || "Product"}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <h3 className="line-clamp-2 text-sm font-medium text-slate-900">
                                            {p.title || p.name || "Untitled"}
                                        </h3>
                                        {p.category && (
                                            <div className="mt-1 text-xs text-slate-500">{p.category}</div>
                                        )}
                                        {/* Price / MRP / Discount */}
                                        {(p.price != null || p.mrp != null) && (() => {
                                            const price = toNum(p.price);
                                            const mrp = toNum(p.mrp ?? p.mrpPrice ?? p.listPrice);
                                            const off = discountPct(price, mrp);

                                            return (
                                                <div className="mt-2 flex items-center gap-2">
                                                    {typeof price === "number" && (
                                                        <span className="text-[15px] font-semibold text-[#d8a298]">
                                                            ₹{formatINR(price)}
                                                        </span>
                                                    )}

                                                    {typeof mrp === "number" && mrp > (price ?? 0) && (
                                                        <span className="text-xs text-slate-500 line-through">
                                                            ₹{formatINR(mrp)}
                                                        </span>
                                                    )}

                                                    {off > 0 && (
                                                        <span className="ml-1 rounded-full bg-[#fff2ea] px-2 py-0.5 text-xs font-semibold text-[#ef927d]">
                                                            {off}% OFF
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </main>
    );
}
