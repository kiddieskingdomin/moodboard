import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE}`; // backend base

const formatINR = (paise = 0) =>
  `₹${Math.max(0, Math.round(paise) / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

// lazily load Razorpay SDK if missing
async function ensureRazorpay() {
  if (window.Razorpay) return true;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
  return !!window.Razorpay;
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    personalisation: "", // optional engraving text (max 12)
  });

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false); // for checkout
  const [verifying, setVerifying] = useState(false); // ✅ for payment verify
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");

  // pull cart for summary
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/cart`, {
          withCredentials: true,
        });
        if (mounted) setCart(res.data);
      } catch (e) {
        console.error("Cart load failed", e);
        if (mounted) setError("Could not load your cart.");
      } finally {
        if (mounted) setBooting(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const items = cart?.items || [];

  // totals
  // totals
  const subtotalPaise = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (it.pricePaiseSnap || 0) * (it.qty || 0),
        0
      ),
    [items]
  );

  // ✅ shipping rule wapas add kiya
  const shippingPaise = subtotalPaise > 99900 ? 0 : (items.length ? 4999 : 0);

  const taxPaise = 0; // GST, if ever
  const personalizationPaise =
    form.personalisation?.trim() ? 5000 : 0; // add ₹50 only if text filled
  const grandTotalPaise =
    subtotalPaise + shippingPaise + taxPaise + personalizationPaise;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "personalisation" && value.length > 12) return; // hard cap
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!items.length) return "Your cart is empty.";
    if (!form.name?.trim()) return "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Please enter a valid email.";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      return "Please enter a valid 10-digit phone.";
    if (!form.line1?.trim()) return "Please enter your address line 1.";
    if (!form.city?.trim()) return "Please enter your city.";
    if (!form.state?.trim()) return "Please enter your state.";
    if (!/^\d{6}$/.test(form.pincode))
      return "Please enter a valid 6-digit pincode.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await ensureRazorpay();

      // Step A: create order via backend
      const res = await axios.post(
        `${API_BASE}/api/checkout/start`,
        {
          shipping: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          personalization: form.personalisation?.trim() || "",
          clientTotals: {
            subtotalPaise,
            shippingPaise,
            taxPaise,
            personalizationPaise,
            grandTotalPaise,
          },
        },
        { withCredentials: true }
      );

      const { keyId, razorpayOrderId, amountPaise, orderId } = res.data;

      // Step B: Razorpay popup
      const options = {
        key: keyId,
        amount: amountPaise,
        currency: "INR",
        order_id: razorpayOrderId,
        name: "Kiddies Kingdom",
        description: "Order Payment",
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          personalization: form.personalisation?.trim() || "",
        },
        theme: { color: "#ef927d" },
        handler: async function (response) {
          // ✅ loader during verification
          setVerifying(true);
          try {
            await axios.post(
              `${API_BASE}/api/checkout/verify`,
              { ...response, email: form.email },
              { withCredentials: true }
            );
            navigate(`/order-success/${orderId}`);
          } catch (err) {
            console.error("Verification failed", err);
            setError(
              "Payment verification failed. Please contact support."
            );
          } finally {
            setVerifying(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout failed", err);
      setError(
        err?.response?.data?.error ||
        "Failed to start checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loader screen during verification
  if (verifying) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#ef927d] border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-slate-700">
          Verifying payment...
        </p>
      </div>
    );
  }

  if (booting) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-48 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {error ? (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left: Shipping form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          {[
            { name: "name", label: "Full Name" },
            { name: "email", label: "Email" },
            { name: "phone", label: "Phone" },
            { name: "line1", label: "Address Line 1" },
            { name: "line2", label: "Address Line 2 (optional)", optional: true },
            { name: "city", label: "City" },
            { name: "state", label: "State" },
            { name: "pincode", label: "Pincode" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium mb-1" htmlFor={f.name}>
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type="text"
                required={!f.optional}
                value={form[f.name]}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2 text-sm focus:ring focus:ring-violet-300"
              />
            </div>
          ))}

          {/* Personalisation field (optional) */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="personalisation"
            >
              Personalisation On Your Toy (Laser Engraving) (+₹50)
            </label>
            <input
              id="personalisation"
              name="personalisation"
              type="text"
              maxLength={12}
              value={form.personalisation}
              onChange={handleChange}
              placeholder="Max 12 characters (optional)"
              className="w-full rounded border px-3 py-2 text-sm focus:ring focus:ring-violet-300"
            />
            <div className="mt-1 text-xs text-slate-500">
              {form.personalisation.length}/12
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !items.length}
            className="w-full rounded-xl bg-[#ef927d] px-4 py-3 font-semibold text-white hover:bg-[#d87964] disabled:opacity-50"
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>
        </form>

        {/* Right: Order summary */}
        <aside className="rounded-2xl border border-slate-200 p-4 h-fit">
          <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>

          <div className="mt-3 space-y-3">
            {!items.length ? (
              <p className="text-sm text-slate-500">Your cart is empty.</p>
            ) : (
              items.map((it, i) => {
                const price = it.pricePaiseSnap || 0;
                const line = price * (it.qty || 0);
                return (
                  <div
                    key={`${it.productId}-${i}-${it.colorSnap || "default"}`}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm text-slate-800">
                        {it.titleSnap || "Product"}
                      </div>
                      {it.colorSnap ? (
                        <div className="text-xs text-slate-600">
                          Color:{" "}
                          <span className="font-medium text-slate-700">
                            {it.colorSnap}
                          </span>
                        </div>
                      ) : null}
                      <div className="text-xs text-slate-600">
                        {formatINR(price)} × {it.qty}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {formatINR(line)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <hr className="my-3" />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-slate-900">{formatINR(subtotalPaise)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Shipping</span>
              <span className="text-slate-900">
                {items.length ? formatINR(shippingPaise) : "—"}
              </span>
            </div>
            {form.personalisation?.trim() ? (
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Personalisation (+₹50): “{form.personalisation}”
                </span>
                <span className="text-slate-900">
                  {formatINR(personalizationPaise)}
                </span>
              </div>
            ) : null}

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatINR(grandTotalPaise)}</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Final payable is confirmed server-side when you click Pay.
          </p>
        </aside>
      </div>
    </div>
  );
}
