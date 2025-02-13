'use strict';

const express = require('express');
const { checkTokenCookie } = require('../../middleware/checkAuth');
const { asyncHandler } = require('../../helpers/asyncHandler')
const OrderController = require('../../controller/user/order.controller');

const router = express.Router();

//User
router.get('/profile/order/get', checkTokenCookie, asyncHandler(OrderController.userOrders));


//Admin

module.exports = router;