import React, { useEffect, useMemo, useState } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import {
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../api/cart";
import { useNavigate } from "react-router-dom";

const formatINR = (paise = 0) =>
  `₹${Math.max(0, Math.round(paise) / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // load on open
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

  // lock background scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const emitCartUpdated = () =>
    window.dispatchEvent(new Event("cart:updated"));

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

  // 👇 remove now targets the specific variant line by color
  const handleRemove = async (pid, colorName) => {
    try {
      setLoading(true);
      const updated = await removeFromCart(pid, colorName);
      setCart(updated);
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
      emitCartUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalPaise = useMemo(
    () =>
      cart?.items?.reduce(
        (sum, it) => sum + (it.pricePaiseSnap || 0) * (it.qty || 0),
        0
      ) ?? 0,
    [cart]
  );

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
            <p className="my-10 text-center text-slate-500">🛒 Your cart is empty.</p>
          )}

          {cart?.items?.map((it, idx) => {
            const price = it.pricePaiseSnap ?? 0;
            const line = price * (it.qty ?? 0);
            const img = it.imageSnap || "/placeholder.png";
            const href = it.slugSnap ? `/product/${it.slugSnap}` : "#";

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
                    alt={it.titleSnap || "Product"}
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
                    {it.titleSnap || "Product"}
                  </a>

                  {/* 👇 Show color if available */}
                  {it.colorSnap && (
                    <div className="mt-0.5 text-xs text-slate-500">
                      Color: <span className="font-medium text-slate-700">{it.colorSnap}</span>
                    </div>
                  )}

                  <div className="mt-1 text-sm text-slate-600">
                    {formatINR(price)} × {it.qty} ={" "}
                    <span className="font-medium text-slate-900">
                      {formatINR(line)}
                    </span>
                  </div>
                </div>

                {/* controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      !loading &&
                      handleQtyChange(it.productId, (it.qty || 1) - 1, it.colorSnap)
                    }
                    disabled={loading}
                    className="h-8 w-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{it.qty}</span>
                  <button
                    onClick={() =>
                      !loading &&
                      handleQtyChange(it.productId, (it.qty || 1) + 1, it.colorSnap)
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
