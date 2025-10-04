// src/components/cartDrawer.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import { getCart, updateCart, removeFromCart, clearCart } from "../api/cart";
import { useNavigate } from "react-router-dom";

/* ---------------- helpers ---------------- */

const toPaise = (v) => {
  if (v == null) return 0;
  const n = typeof v === "string" ? Number(v) : v;
  if (Number.isNaN(n)) return 0;
  // if looks like rupees, convert; if already paise, leave as-is when it's an integer > 10000 and caller passed explicit *_Paise field
  return Math.round(n);
};

const rupeesToPaise = (r) => {
  const n = typeof r === "string" ? Number(r) : r;
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

const formatINR = (paise = 0) =>
  `₹${Math.max(0, Math.round(paise) / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const keyForLine = (pid, color) => `${pid}|${color || ""}`;

/* ---------------- component ---------------- */

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snapshots, setSnapshots] = useState({});
  const navigate = useNavigate();

  /* ---------- bootstrap snapshots from localStorage ---------- */
  useEffect(() => {
    const raw = localStorage.getItem("cartSnapshots");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setSnapshots(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartSnapshots", JSON.stringify(snapshots));
  }, [snapshots]);

  /* ---------- load on open ---------- */
  const loadCart = async () => {
    setLoading(true);
    try {
      const c = await getCart();
      setCart(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const c = await getCart();
        if (mounted) setCart(c);
      } catch (e) {
        console.error(e);
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  /* ---------- react to global events ---------- */
  useEffect(() => {
    if (!isOpen) return;

    const onUpdated = () => loadCart();

    const onSnapshot = (e) => {
      const d = e?.detail || {};
      const k = d.key || keyForLine(d.productId, d.color);
      if (!k) return;

      // accept both rupees and paise fields
      const pricePaise =
        d.pricePaise ??
        d.pricePaiseSnap ??
        (d.price != null ? rupeesToPaise(d.price) : undefined);

      const mrpPaise =
        d.mrpPaise ??
        d.mrpPaiseSnap ??
        (d.mrp != null ? rupeesToPaise(d.mrp) : undefined);

      setSnapshots((prev) => ({
        ...prev,
        [k]: {
          ...prev[k],
          key: k,
          productId: d.productId,
          color: d.color ?? null,
          // priority to explicit paise
          pricePaise:
            pricePaise != null
              ? toPaise(pricePaise)
              : prev[k]?.pricePaise ?? undefined,
          mrpPaise:
            mrpPaise != null ? toPaise(mrpPaise) : prev[k]?.mrpPaise ?? undefined,
          title: d.title ?? prev[k]?.title,
          image: d.image ?? prev[k]?.image,
          slug: d.slug ?? prev[k]?.slug,
        },
      }));
    };

    window.addEventListener("cart:updated", onUpdated);
    window.addEventListener("cart:snapshot", onSnapshot);
    return () => {
      window.removeEventListener("cart:updated", onUpdated);
      window.removeEventListener("cart:snapshot", onSnapshot);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ---------- lock background scroll when open ---------- */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  /* ---------- ESC to close ---------- */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const emitCartUpdated = () => window.dispatchEvent(new Event("cart:updated"));

  /* ---------- mutations ---------- */

  const handleQtyChange = async (pid, qty, colorName) => {
    try {
      setLoading(true);
      let updated;
      if (qty <= 0) {
        updated = await removeFromCart(pid, colorName);
      } else {
        updated = await updateCart(pid, qty, colorName);
      }
      setCart(updated);
      emitCartUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (pid, colorName) => {
    try {
      setLoading(true);
      const updated = await removeFromCart(pid, colorName);
      setCart(updated);

      // also remove snapshot for that line key
      const k = keyForLine(pid, colorName);
      setSnapshots((prev) => {
        const copy = { ...prev };
        delete copy[k];
        return copy;
      });

      emitCartUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      setLoading(true);
      const updated = await clearCart();
      setCart(updated);
      setSnapshots({});
      emitCartUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- totals ---------- */

  const totalPaise = useMemo(() => {
    const lines = cart?.items || [];
    return lines.reduce((sum, it) => {
      const key = keyForLine(it.productId, it.colorSnap);
      const snap = snapshots[key];

      // prefer snapshot price; else backend snapshot; else 0
      const unit =
        snap?.pricePaise ??
        it.pricePaiseSnap ??
        (it.priceRupeesSnap != null ? rupeesToPaise(it.priceRupeesSnap) : 0);

      return sum + toPaise(unit) * (it.qty ?? 0);
    }, 0);
  }, [cart, snapshots]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* drawer */}
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl rounded-l-2xl animate-slideIn"
        role="dialog"
        aria-modal="true"
        aria-label="Cart drawer"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
            aria-label="Close cart"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-28">
          {loading && (
            <div className="my-6 text-sm text-slate-500">Updating…</div>
          )}

          {!cart?.items?.length && !loading && (
            <p className="my-10 text-center text-slate-500">
              🛒 Your cart is empty.
            </p>
          )}

          {cart?.items?.map((it, idx) => {
            const key = keyForLine(it.productId, it.colorSnap);
            const snap = snapshots[key];

            const unitPaise =
              snap?.pricePaise ??
              it.pricePaiseSnap ??
              (it.priceRupeesSnap != null
                ? rupeesToPaise(it.priceRupeesSnap)
                : 0);

            const mrpPaise =
              snap?.mrpPaise ??
              it.mrpPaiseSnap ??
              (it.mrpRupeesSnap != null ? rupeesToPaise(it.mrpRupeesSnap) : 0);

            const qty = it.qty ?? 0;
            const line = toPaise(unitPaise) * qty;

            const img =
              snap?.image ||
              it.imageSnap ||
              it.product?.image ||
              "/placeholder.png";

            const title =
              snap?.title || it.titleSnap || it.product?.title || "Product";

            const href = (snap?.slug || it.slugSnap)
              ? `/product/${snap?.slug || it.slugSnap}`
              : "#";

            return (
              <div
                key={`${it.productId}-${idx}-${it.colorSnap || "default"}`}
                className="flex items-start gap-3 border-b py-4 last:border-b-0"
              >
                {/* image */}
                <a
                  href={href}
                  className="block h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-200"
                >
                  <img
                    src={img}
                    alt={title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </a>

                {/* details */}
                <div className="min-w-0 flex-1">
                  <a
                    href={href}
                    className="line-clamp-2 text-sm font-medium text-slate-900 hover:underline"
                  >
                    {title}
                  </a>

                  {/* color */}
                  {it.colorSnap && (
                    <div className="mt-0.5 text-xs text-slate-500">
                      Color:{" "}
                      <span className="font-medium text-slate-700">
                        {it.colorSnap}
                      </span>
                    </div>
                  )}

                  <div className="mt-1 text-sm text-slate-600">
                    {formatINR(unitPaise)} × {qty} ={" "}
                    <span className="font-medium text-slate-900">
                      {formatINR(line)}
                    </span>
                  </div>

                  {/* strike MRP if any */}
                  {mrpPaise > unitPaise ? (
                    <div className="text-xs text-slate-500 line-through">
                      {formatINR(mrpPaise)}
                    </div>
                  ) : null}
                </div>

                {/* controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      !loading &&
                      handleQtyChange(
                        it.productId,
                        Math.max(0, (it.qty || 1) - 1),
                        it.colorSnap
                      )
                    }
                    disabled={loading}
                    className="h-8 w-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{qty}</span>
                  <button
                    onClick={() =>
                      !loading &&
                      handleQtyChange(
                        it.productId,
                        (it.qty || 1) + 1,
                        it.colorSnap
                      )
                    }
                    disabled={loading}
                    className="h-8 w-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>

                  <button
                    onClick={() => !loading && handleRemove(it.productId, it.colorSnap)}
                    disabled={loading}
                    className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pointer-events-auto sticky bottom-0 z-10 border-t bg-white px-5 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClear}
              disabled={loading || !cart?.items?.length}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiTrash2 /> Clear
            </button>
            <div className="flex items-center gap-4">
              <span className="text-base font-semibold text-slate-900">
                Total: {formatINR(totalPaise)}
              </span>
              <button
                className="rounded-lg bg-[#ef927d] px-4 py-2 text-white font-medium hover:bg-[#d87964] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!cart?.items?.length || loading}
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
