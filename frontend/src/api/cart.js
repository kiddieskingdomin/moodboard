// src/api/cart.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/cart", // <- apne backend ka URL
  withCredentials: true,
});

export async function getCart() {
  const res = await API.get("/");
  return res.data;
}

export async function addToCart(productId, qty = 1) {
  const res = await API.post("/add", { productId, qty });
  return res.data;
}

export async function updateCart(productId, qty) {
  const res = await API.post("/update", { productId, qty });
  return res.data;
}

export async function removeFromCart(productId) {
  const res = await API.delete(`/remove/${productId}`);
  return res.data;
}

// 🔥 ye missing tha
export async function clearCart() {
  // sari items hata do
  const cart = await getCart();
  for (const item of cart.items) {
    await removeFromCart(item.productId);
  }
  return await getCart();
}
