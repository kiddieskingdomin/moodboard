import express from 'express'
import Cart from '../models/cart.js'
import { getById } from '../utils/catelog.js'

const router = express.Router()

// --- GET current cart ---
router.get('/', async (req, res) => {
  let cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) {
    cart = await Cart.create({ sessionId: req.sessionId, items: [] })
  }
  res.json(cart)
})

// --- ADD item ---
// --- ADD item ---
router.post('/add', async (req, res) => {
  const { productId, qty = 1 } = req.body
  const product = getById(productId)
  if (!product) return res.status(404).json({ error: 'product_not_found' })

  let cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) cart = new Cart({ sessionId: req.sessionId, items: [] })

  const existing = cart.items.find(i => i.productId === productId)
  const pricePaise = Math.round((product.price ?? 0) * 100)  // 👈 INR → paise

  if (existing) {
    existing.qty = Math.min(10, existing.qty + qty)
    existing.titleSnap = product.title
    existing.pricePaiseSnap = pricePaise
  } else {
    cart.items.push({
      productId,
      qty,
      titleSnap: product.title,
      pricePaiseSnap: pricePaise
    })
  }

  await cart.save()
  res.json(cart)
})

// --- UPDATE qty ---
router.post('/update', async (req, res) => {
  const { productId, qty } = req.body
  if (!productId || !qty) return res.status(400).json({ error: 'missing_fields' })

  const cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) return res.status(404).json({ error: 'cart_not_found' })

  const item = cart.items.find(i => i.productId === productId)
  if (!item) return res.status(404).json({ error: 'item_not_found' })

  item.qty = qty
  await cart.save()
  res.json(cart)
})

// --- REMOVE item ---
router.delete('/remove/:productId', async (req, res) => {
  const { productId } = req.params
  const cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) return res.status(404).json({ error: 'cart_not_found' })

  cart.items = cart.items.filter(i => i.productId !== productId)
  await cart.save()
  res.json(cart)
})

export default router
