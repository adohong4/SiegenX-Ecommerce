'use strict'

const express = require('express')

const { asyncHandler } = require('../../helpers/asyncHandler')
const { checkTokenCookie } = require('../../middleware/checkAuth')
const paymentController = require('../../controller/payment/cod.controller')

const router = express.Router()

//Payment
router.post('/profile/cod/verify', checkTokenCookie, asyncHandler(paymentController.CODplaceOrder))


module.exports = router;