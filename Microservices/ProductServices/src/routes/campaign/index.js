'use strict'
const express = require('express');

const campaignController = require('../../controllers/campaign.controller')
const { asyncHandler } = require('../../helpers/asyncHandler');
const { checkTokenCookie } = require('../../middleware/checkAuth')


const router = express.Router();

router.post('/product/campaign/create', checkTokenCookie, asyncHandler(campaignController.createCampaign))

router.get('/product/campaign/get', checkTokenCookie, asyncHandler(campaignController.getAllCampaign))
router.get('/product/campaign/get/:id', checkTokenCookie, asyncHandler(campaignController.getCampaignById))

router.delete('/product/campaign/active/:id', checkTokenCookie, asyncHandler(campaignController.activeCampaign))

router.get('/product/campaign/paginate', checkTokenCookie, asyncHandler(campaignController.paginateCampaign))
router.get('/product/campaign/search/:code', checkTokenCookie, asyncHandler(campaignController.searchCampaignByCode))

module.exports = router;