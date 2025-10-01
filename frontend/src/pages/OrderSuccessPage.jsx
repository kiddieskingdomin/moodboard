import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE}`;

const inr = (n) =>
  `₹${(n / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/api/checkout/orders/${id}`, { withCredentials: true })
      .then((res) => setOrder(res.data))
      .catch((e) => {
        console.error("Order fetch error", e);
        setErr(
          "Could not load order. If payment succeeded, your invoice link will still work."
        );
      });
  }, [id]);

  const total = useMemo(() => (order ? order.amountPaise || 0 : 0), [order]);

  // correct: backend stores "personalisation"
  const personalizationText =
    order?.personalisation && order.personalisation.trim()
      ? order.personalisation.trim()
      : "";
  const personalizationPaise = personalizationText ? 5000 : 0;

  if (err && !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="rounded bg-rose-50 p-4 text-rose-700">{err}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-block rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-2">🎉 Payment Successful!</h1>
        <p className="text-slate-700">
          Thank you <span className="font-semibold">{order.shipping?.name}</span>.
          Your order <span className="font-mono">#{id}</span> is confirmed.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
        </p>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Order Items</h2>
        </div>
        <ul className="divide-y divide-slate-200">
          {(order.items || []).map((it, idx) => {
            const line = (it.pricePaiseSnap || 0) * (it.qty || 0);
            return (
              <li
                key={`${it.productId}-${idx}-${it.colorSnap || "default"}`}
                className="flex gap-4 p-4"
              >
                <img
                  src={it.imageSnap || "/placeholder.png"}
                  alt={it.titleSnap}
                  className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">
                    {it.titleSnap}
                  </div>

                  {/* show selected color if present */}
                  {it.colorSnap ? (
                    <div className="text-xs text-slate-600">
                      Color:{" "}
                      <span className="font-medium text-slate-700">
                        {it.colorSnap}
                      </span>
                    </div>
                  ) : null}

                  <div className="text-sm text-slate-600">
                    {inr(it.pricePaiseSnap || 0)} × {it.qty}
                  </div>
                </div>
                <div className="font-semibold text-slate-900">{inr(line)}</div>
              </li>
            );
          })}

          {/* Personalisation line, if applicable */}
          {personalizationText ? (
            <li className="flex gap-4 p-4">
              <div className="h-16 w-16 rounded-lg bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center text-xs text-slate-500">
                Engrave
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">Personalisation</div>
                <div className="text-sm text-slate-600">“{personalizationText}”</div>
              </div>
              <div className="font-semibold text-slate-900">
                +{inr(personalizationPaise)}
              </div>
            </li>
          ) : null}
        </ul>

        <div className="flex justify-between px-6 py-4 border-t">
          <div className="text-slate-600">Total</div>
          <div className="text-lg font-bold text-slate-900">{inr(total)}</div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Shipping Details</h2>
        </div>
        <div className="px-6 py-4 space-y-1 text-sm text-slate-700">
          <p>{order.shipping?.name}</p>
          <p>{order.shipping?.line1}</p>
          {order.shipping?.line2 && <p>{order.shipping.line2}</p>}
          <p>
            {order.shipping?.city}, {order.shipping?.state} - {order.shipping?.pincode}
          </p>
          <p>📞 {order.shipping?.phone}</p>
          <p>✉️ {order.shipping?.email}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
        </div>
        <div className="px-6 py-4 text-sm text-slate-700 space-y-1">
          <p>
            <span className="font-medium">Payment ID:</span>{" "}
            {order.razorpayPaymentId || "N/A"}
          </p>
          <p>
            <span className="font-medium">Method:</span> Razorpay
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className="text-green-600 font-semibold">
              {order.status === "paid" ? "Paid" : order.status || "Paid"}
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <a
          href={`${API}/api/checkout/orders/${id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
        >
          Download Invoice
        </a>
        <Link
          to="/"
          className="inline-block rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
