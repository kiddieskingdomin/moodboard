import express from 'express'
import Cart from '../models/cart.js'
import { getById } from '../utils/catelog.js'

const router = express.Router()

// helper to pick snapshot image (prefers color variant)
function pickImageFor(product, colorName) {
  if (colorName && product?.colorVariants?.length) {
    const v = product.colorVariants.find(c => c.name === colorName)
    const img = v?.images?.[0]
    if (img) return img
  }
  return product?.thumbnail || product?.image || (product?.gallery?.[0]) || '/placeholder.png'
}
function pickSlug(p) {
  return String(p?.slug ?? p?.id ?? '').toLowerCase()
}

// --- GET current cart (with backfill for old items) ---
router.get('/', async (req, res) => {
  let cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) {
    cart = await Cart.create({ sessionId: req.sessionId, items: [] })
    return res.json(cart)
  }

  // backfill if old items missing snapshots
  let touched = false
  for (const it of cart.items) {
    if (!it.titleSnap || !it.pricePaiseSnap || !it.imageSnap || !it.slugSnap) {
      const p = getById(it.productId)
      if (p) {
        it.titleSnap = it.titleSnap || p.title
        it.pricePaiseSnap = it.pricePaiseSnap ?? Math.round((p.price ?? 0) * 100)
        // colorSnap ho to us variant ki image lo
        it.imageSnap = it.imageSnap || pickImageFor(p, it.colorSnap)
        it.slugSnap = it.slugSnap || pickSlug(p)
        touched = true
      }
    }
  }
  if (touched) await cart.save()
  res.json(cart)
})

// --- ADD item ---
router.post('/add', async (req, res) => {
  const { productId, qty = 1, colorSnap: bodyColor, color } = req.body
  const selectedColor = bodyColor ?? color ?? null

  const product = getById(productId)
  if (!product) return res.status(404).json({ error: 'product_not_found' })

  let cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) cart = new Cart({ sessionId: req.sessionId, items: [] })

  const pricePaise = Math.round((product.price ?? 0) * 100)

  // Same product + same color ko merge karo; different color ho to new line item
  const existing = cart.items.find(i => 
    i.productId === productId && String(i.colorSnap || '') === String(selectedColor || '')
  )

  if (existing) {
    existing.qty = Math.min(10, existing.qty + qty)
    existing.titleSnap = product.title
    existing.pricePaiseSnap = pricePaise
    existing.imageSnap = pickImageFor(product, existing.colorSnap) // color respect
    existing.slugSnap = pickSlug(product)
  } else {
    cart.items.push({
      productId,
      qty,
      titleSnap: product.title,
      pricePaiseSnap: pricePaise,
      imageSnap: pickImageFor(product, selectedColor),
      slugSnap: pickSlug(product),
      colorSnap: selectedColor || undefined
    })
  }

  await cart.save()
  res.json(cart)
})

// --- UPDATE qty / color (optional color change support) ---
router.post('/update', async (req, res) => {
  const { productId, qty, colorSnap: bodyColor, color, prevColor } = req.body
  if (!productId || qty == null) return res.status(400).json({ error: 'missing_fields' })

  const newColor = bodyColor ?? color
  const cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) return res.status(404).json({ error: 'cart_not_found' })

  // pehle item dhoondo color ke hisab se (prevColor optional)
  const item = cart.items.find(i => 
    i.productId === productId && String(i.colorSnap || '') === String(prevColor ?? i.colorSnap ?? '')
  ) || cart.items.find(i => i.productId === productId)

  if (!item) return res.status(404).json({ error: 'item_not_found' })

  // qty clamp
  item.qty = Math.max(1, Math.min(10, qty))

  const p = getById(productId)
  if (p) {
    // color change aaya to set kar do
    if (typeof newColor !== 'undefined') {
      item.colorSnap = newColor || undefined
    }

    item.titleSnap = p.title
    item.pricePaiseSnap = Math.round((p.price ?? 0) * 100)
    item.imageSnap = pickImageFor(p, item.colorSnap)
    item.slugSnap = pickSlug(p)
  }

  await cart.save()
  res.json(cart)
})

// --- REMOVE item ---
// supports optional ?color=... to remove only that color of the product
router.delete('/remove/:productId', async (req, res) => {
  const { productId } = req.params
  const { color } = req.query

  const cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) return res.status(404).json({ error: 'cart_not_found' })

  if (typeof color === 'string') {
    cart.items = cart.items.filter(i => !(i.productId === productId && String(i.colorSnap || '') === color))
  } else {
    // no color specified: remove all variants of that productId
    cart.items = cart.items.filter(i => i.productId !== productId)
  }

  await cart.save()
  res.json(cart)
})

// --- CLEAR cart (optional) ---
router.delete('/clear', async (req, res) => {
  const cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) return res.status(404).json({ error: 'cart_not_found' })
  cart.items = []
  await cart.save()
  res.json(cart)
})

export default router
