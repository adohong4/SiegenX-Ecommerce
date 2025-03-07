'use strict'

const express = require('express')

const { asyncHandler } = require('../../helpers/asyncHandler')
const { checkTokenCookie } = require('../../middleware/checkAuth')
const paymentController = require('../../controller/payment/cod.controller')
const stripeController = require('../../controller/payment/stripe.controller')

const router = express.Router()

//Payment
router.post('/profile/cod/verify', checkTokenCookie, asyncHandler(paymentController.CODplaceOrder))


router.post('/profile/stripe/place', checkTokenCookie, asyncHandler(stripeController.placeOrder))
router.post('/profile/stripe/verify', checkTokenCookie, asyncHandler(stripeController.verifyOrder))


module.exports = router;