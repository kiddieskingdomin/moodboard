import React, { useEffect, useMemo, useState } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import {
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../api/cart";

const formatINR = (paise = 0) =>
  `₹${Math.max(0, Math.round(paise) / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function CartDrawer({ isOpen, onClose }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // load on open
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getCart()
      .then(setCart)
      .catch(console.error)
      .finally(() => setLoading(false));
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

  const handleQtyChange = async (pid, qty) => {
    try {
      setLoading(true);
      if (qty <= 0) {
        const updated = await removeFromCart(pid);
        setCart(updated);
      } else {
        const updated = await updateCart(pid, qty);
        setCart(updated);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (pid) => {
    setLoading(true);
    try {
      const updated = await removeFromCart(pid);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      const updated = await clearCart();
      setCart(updated);
    } finally {
      setLoading(false);
    }
  };

  const totalPaise = useMemo(
    () => cart?.items?.reduce((sum, it) => sum + (it.pricePaiseSnap || 0) * (it.qty || 0), 0) ?? 0,
    [cart]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* drawer */}
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Cart drawer"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
            aria-label="Close cart"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {loading && (
            <div className="my-6 text-sm text-slate-500">Updating…</div>
          )}

          {!cart?.items?.length && !loading && (
            <p className="my-6 text-slate-500">Cart is empty.</p>
          )}

          {cart?.items?.map((it, idx) => {
            const price = it.pricePaiseSnap ?? 0;
            const line = price * (it.qty ?? 0);
            return (
              <div
                key={`${it.productId}-${idx}`}  // 👈 unique key
                className="border-b py-3 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-medium text-slate-900">
                      {it.titleSnap || "Product"}
                    </div>
                    <div className="mt-0.5 text-sm text-slate-600">
                      {formatINR(price)} × {it.qty} ={" "}
                      <span className="font-medium text-slate-900">
                        {formatINR(line)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(it.productId, (it.qty || 1) - 1)}
                      className="h-8 w-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{it.qty}</span>
                    <button
                      onClick={() => handleQtyChange(it.productId, (it.qty || 1) + 1)}
                      className="h-8 w-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                    <button
                      onClick={() => handleRemove(it.productId)}
                      className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded border border-rose-200 text-rose-600 hover:bg-rose-50"
                      aria-label="Remove item"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pointer-events-auto sticky bottom-0 z-10 border-t bg-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <FiTrash2 /> Clear
            </button>
            <div className="flex items-center gap-4">
              <span className="text-base font-semibold text-slate-900">
                Total: {formatINR(totalPaise)}
              </span>
              <button
                className="rounded-xl bg-[#ef927d] px-4 py-2 text-white hover:bg-[#d87964]"
                onClick={() => {
                  // yahan payment flow attach karenge
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
