'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const zalopayController = require('../../controller/zalopay.controller')
const { authMiddleware, checkTokenCookie } = require('../../middleware/checkAuth')
const router = express.Router()

//Zalopay
router.post('/online/zalopay/payment', checkTokenCookie, asyncHandler(zalopayController.placeOrder))
router.post('/online/zalopay/verify', checkTokenCookie, asyncHandler(zalopayController.verifyOrder))

module.exports = router;