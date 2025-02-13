'use strict'

const express = require('express');

const { asyncHandler } = require('../../helpers/asyncHandler')
const cartController = require('../../controller/cart.controller')
const { checkTokenCookie } = require('../../middleware/checkAuth')
const router = express.Router()

router.post('/profile/cart/add', checkTokenCookie, asyncHandler(cartController.addToCart))
router.post('/profile/cart/addQuantity', checkTokenCookie, asyncHandler(cartController.addQuantityToCart))

router.post('/profile/cart/remove', checkTokenCookie, asyncHandler(cartController.removeFromCart))
router.get('/profile/cart/get', checkTokenCookie, asyncHandler(cartController.getCart))

module.exports = router;
