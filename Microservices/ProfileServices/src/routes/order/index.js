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
router.get('/profile/order/get', asyncHandler(OrderAdminController.getOrders));
router.get('/profile/order/get/:id', asyncHandler(OrderAdminController.getOrderById));

router.get('/profile/order/paginate', asyncHandler(OrderAdminController.paginateOder));
router.get('/profile/order/trash/paginate', asyncHandler(OrderAdminController.paginateOderTrash));

router.get('/profile/order/search/:id', asyncHandler(OrderAdminController.searchById));

router.put('/profile/order/update', checkTokenCookie, asyncHandler(OrderAdminController.updateStatusOrder));

router.delete('/profile/order/delete/:id', checkTokenCookie, asyncHandler(OrderAdminController.deleteOrder));
router.delete('/profile/order/status/:id', checkTokenCookie, asyncHandler(OrderAdminController.toggleOrderStatus)); //delete && restore

module.exports = router;