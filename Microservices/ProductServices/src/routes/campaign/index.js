'use strict'
const express = require('express');

const campaignController = require('../../controllers/campaign.controller')
const { asyncHandler } = require('../../helpers/asyncHandler');
const { checkTokenCookie } = require('../../middleware/checkAuth')


const router = express.Router();

router.post('/product/campaign/create', checkTokenCookie, asyncHandler(campaignController.createCampaign))


module.exports = router;