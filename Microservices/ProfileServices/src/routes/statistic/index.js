'use strict';

const express = require('express');
const { checkTokenCookie, checkTokenCookieAdmin } = require('../../middleware/checkAuth');
const { asyncHandler } = require('../../helpers/asyncHandler')
const StatisticController = require('../../controller/admin/statistic.controller');

const router = express.Router();

//User
router.get('/profile/statistic/get', asyncHandler(StatisticController.productStatisticTable));
router.get('/profile/statistic/category/get', asyncHandler(StatisticController.productStatisticCategory));
router.get('/profile/statistic/revenue', asyncHandler(StatisticController.getRevenueStats));

module.exports = router;