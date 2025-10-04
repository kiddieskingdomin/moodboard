// routes/cart.js
import express from 'express'
import Cart from '../models/cart.js'
// tiny nit: tumne file ka naam "catelog.js" likha hai; agar galti se "catalog.js" ho to path sahi kar lena.
import { getById } from '../utils/catelog.js'

const router = express.Router()

/* ---------------- helpers ---------------- */

// normalize string compare
const same = (a, b) =>
  String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase()

// pick variant by color name (no variantId drama)
function pickVariant(product, colorName) {
  if (!product?.colorVariants?.length || !colorName) return null
  return product.colorVariants.find(v =>
    same(v?.name, colorName) || same(v?.color, colorName)
  ) || null
}

// convert various inputs to paise (accepts rupees number too)
const toPaise = (n) => {
  if (n == null) return 0
  const x = typeof n === 'string' ? Number(n) : n
  if (!Number.isFinite(x)) return 0
  // assume rupees; multiply
  return Math.round(x * 100)
}

// prefer variant image if color selected
function pickImageFor(product, colorName) {
  if (colorName && product?.colorVariants?.length) {
    const v = product.colorVariants.find(c => same(c.name, colorName) || same(c.color, colorName))
    const img = v?.images?.[0]
    if (img) return img
  }
  return product?.thumbnail || product?.image || (product?.gallery?.[0]) || '/placeholder.png'
}

function pickSlug(p) {
  return String(p?.slug ?? p?.id ?? '').toLowerCase()
}

// build price snapshots with variant awareness
function buildPriceSnap(product, colorName) {
  const v = pickVariant(product, colorName)
  // allow price both as rupees (price) or direct paise (pricePaise)
  const pricePaise =
    Number.isFinite(v?.pricePaise) ? Math.max(0, Math.round(v.pricePaise)) :
    v?.price != null ? toPaise(v.price) :
    Number.isFinite(product?.pricePaise) ? Math.max(0, Math.round(product.pricePaise)) :
    toPaise(product?.price ?? 0)

  const mrpPaise =
    Number.isFinite(v?.mrpPaise) ? Math.max(0, Math.round(v.mrpPaise)) :
    v?.mrp != null ? toPaise(v.mrp) :
    Number.isFinite(product?.mrpPaise) ? Math.max(0, Math.round(product.mrpPaise)) :
    toPaise(product?.mrp ?? 0)

  return { pricePaise, mrpPaise }
}

/* ---------------- routes ---------------- */

// --- GET current cart (with backfill for old items) ---
router.get('/', async (req, res) => {
  let cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) {
    cart = await Cart.create({ sessionId: req.sessionId, items: [] })
    return res.json(cart)
  }

  // backfill if old items missing snapshots (now variant-aware)
  let touched = false
  for (const it of cart.items) {
    if (!it.titleSnap || !it.pricePaiseSnap || !it.imageSnap || !it.slugSnap) {
      const p = getById(it.productId)
      if (p) {
        const { pricePaise, mrpPaise } = buildPriceSnap(p, it.colorSnap)
        it.titleSnap = it.titleSnap || p.title
        it.pricePaiseSnap = it.pricePaiseSnap ?? pricePaise
        // optional extra mrp snapshot if you added the field to schema
        if (typeof it.mrpPaiseSnap === 'undefined' && typeof mrpPaise === 'number') {
          it.mrpPaiseSnap = mrpPaise
        }
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
  const { productId, qty = 1, colorSnap: bodyColor, color, /* optional client snapshots */ pricePaise: pricePaiseBody, mrpPaise: mrpPaiseBody, price, mrp, title, image, slug } = req.body
  const selectedColor = bodyColor ?? color ?? null

  const product = getById(productId)
  if (!product) return res.status(404).json({ error: 'product_not_found' })

  let cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) cart = new Cart({ sessionId: req.sessionId, items: [] })

  // compute server-side variant-aware price
  const fromCatalog = buildPriceSnap(product, selectedColor)
  // allow client snapshot override if provided (but always numeric)
  const pricePaise = Number.isFinite(pricePaiseBody) ? Math.max(0, Math.round(pricePaiseBody))
                    : price != null ? toPaise(price)
                    : fromCatalog.pricePaise
  const mrpPaise = Number.isFinite(mrpPaiseBody) ? Math.max(0, Math.round(mrpPaiseBody))
                  : mrp != null ? toPaise(mrp)
                  : fromCatalog.mrpPaise

  // Same product + same color merge; different color = new line
  const existing = cart.items.find(i =>
    i.productId === productId && same(i.colorSnap, selectedColor)
  )

  if (existing) {
    existing.qty = Math.min(10, existing.qty + qty)
    existing.titleSnap = title || product.title
    existing.pricePaiseSnap = pricePaise
    if (typeof existing.mrpPaiseSnap !== 'number') existing.mrpPaiseSnap = mrpPaise
    existing.imageSnap = image || pickImageFor(product, existing.colorSnap) // color respect
    existing.slugSnap = slug || pickSlug(product)
  } else {
    cart.items.push({
      productId,
      qty: Math.max(1, Math.min(10, qty)),
      titleSnap: title || product.title,
      pricePaiseSnap: pricePaise,
      mrpPaiseSnap: mrpPaise,                // harmless if schema has it; else ignored
      imageSnap: image || pickImageFor(product, selectedColor),
      slugSnap: slug || pickSlug(product),
      colorSnap: selectedColor || undefined
    })
  }

  await cart.save()
  res.json(cart)
})

// --- UPDATE qty / color (optional color change support) ---
router.post('/update', async (req, res) => {
  const { productId, qty, colorSnap: bodyColor, color, prevColor, pricePaise: pricePaiseBody, mrpPaise: mrpPaiseBody, price, mrp, title, image, slug } = req.body
  if (!productId || qty == null) return res.status(400).json({ error: 'missing_fields' })

  const newColor = bodyColor ?? color
  const cart = await Cart.findOne({ sessionId: req.sessionId })
  if (!cart) return res.status(404).json({ error: 'cart_not_found' })

  // pehle item dhoondo color ke hisab se (prevColor optional)
  const item =
    cart.items.find(i => i.productId === productId && same(i.colorSnap, prevColor ?? i.colorSnap)) ||
    cart.items.find(i => i.productId === productId)

  if (!item) return res.status(404).json({ error: 'item_not_found' })

  // qty clamp
  item.qty = Math.max(1, Math.min(10, qty))

  const p = getById(productId)
  if (p) {
    // color change aaya to set kar do
    if (typeof newColor !== 'undefined') {
      item.colorSnap = newColor || undefined
    }

    // recompute price with possibly new color
    const fromCatalog = buildPriceSnap(p, item.colorSnap)
    const pricePaise = Number.isFinite(pricePaiseBody) ? Math.max(0, Math.round(pricePaiseBody))
                      : price != null ? toPaise(price)
                      : fromCatalog.pricePaise
    const mrpPaise = Number.isFinite(mrpPaiseBody) ? Math.max(0, Math.round(mrpPaiseBody))
                    : mrp != null ? toPaise(mrp)
                    : fromCatalog.mrpPaise

    item.titleSnap = title || p.title
    item.pricePaiseSnap = pricePaise
    if (typeof item.mrpPaiseSnap !== 'number') item.mrpPaiseSnap = mrpPaise
    item.imageSnap = image || pickImageFor(p, item.colorSnap)
    item.slugSnap = slug || pickSlug(p)
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
    cart.items = cart.items.filter(i => !(i.productId === productId && same(i.colorSnap, color)))
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
