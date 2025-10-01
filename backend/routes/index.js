import express from 'express'
import cartRoutes from './cartRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import enquiryRoutes from './enquiry.js'
import productRoutes from './productRoutes.js'
const router = express.Router()

router.use('/cart', cartRoutes)
router.use('/checkout', paymentRoutes)
router.use('/enquiry', enquiryRoutes)
router.use('/product-enquiry', productRoutes)

export default router
