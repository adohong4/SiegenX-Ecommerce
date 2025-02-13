'use strict';

const express = require('express');
const { checkTokenCookie } = require('../../middleware/checkAuth');
const { asyncHandler } = require('../../helpers/asyncHandler')
const OrderUserController = require('../../controller/user/order.controller');
const OrderAdminController = require('../../controller/admin/order.controller');

const router = express.Router();

//User
router.get('/profile/user/order/get', checkTokenCookie, asyncHandler(OrderUserController.userOrders));


//Admin
router.get('/profile/order/get', checkTokenCookie, asyncHandler(OrderAdminController.getOrders));

module.exports = router;