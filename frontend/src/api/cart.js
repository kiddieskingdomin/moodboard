// src/api/cart.js
import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/api/cart`,
  withCredentials: true,
});

export async function getCart() {
  const res = await API.get("/");
  return res.data;
}

// 👇 colorName third arg (optional) – pass when a variant is selected
export async function addToCart(productId, qty = 1, colorName = null) {
  // backend expects `color`
  const res = await API.post("/add", { productId, qty, color: colorName });
  return res.data;
}

// 👇 update needs color to target the right variant line
export async function updateCart(productId, qty, colorName = null) {
  // backend expects `color`
  const res = await API.post("/update", { productId, qty, color: colorName });
  return res.data;
}

// 👇 remove specific variant: we’ll send color as query param
export async function removeFromCart(productId, colorName = null) {
  const q = colorName ? `?color=${encodeURIComponent(colorName)}` : "";
  const res = await API.delete(`/remove/${productId}${q}`);
  return res.data;
}

// 👇 use the backend endpoint; stop loop-murdering your own API
export async function clearCart() {
  const res = await API.delete("/clear");
  return res.data;
}
