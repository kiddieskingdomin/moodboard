// src/api/cart.js (as-is)
import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/api/cart`,
  withCredentials: true,
});

export async function getCart() {
  const res = await API.get("/");
  return res.data;
}

export async function addToCart(productId, qty = 1, colorName = null) {
  const res = await API.post("/add", { productId, qty, color: colorName });
  return res.data;
}

export async function updateCart(productId, qty, colorName = null) {
  const res = await API.post("/update", { productId, qty, color: colorName });
  return res.data;
}

export async function removeFromCart(productId, colorName = null) {
  const q = colorName ? `?color=${encodeURIComponent(colorName)}` : "";
  const res = await API.delete(`/remove/${productId}${q}`);
  return res.data;
}

export async function clearCart() {
  const res = await API.delete("/clear");
  return res.data;
}
