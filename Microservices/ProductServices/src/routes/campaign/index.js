'use strict'
const express = require('express');

const campaignController = require('../../controllers/campaign.controller')
const { asyncHandler } = require('../../helpers/asyncHandler');
const { checkTokenCookie } = require('../../middleware/checkAuth')


const router = express.Router();

router.post('/product/campaign/create', checkTokenCookie, asyncHandler(campaignController.createCampaign))

router.get('/product/campaign/get', checkTokenCookie, asyncHandler(campaignController.getAllCampaign))
router.get('/product/campaign/get/:id', checkTokenCookie, asyncHandler(campaignController.getCampaignById))

router.put('/product/campaign/update/:id', checkTokenCookie, asyncHandler(campaignController.updateCampaignById))

router.delete('/product/campaign/active/:id', checkTokenCookie, asyncHandler(campaignController.activeCampaign))

router.get('/product/campaign/paginate', checkTokenCookie, asyncHandler(campaignController.paginateCampaign))
router.get('/product/campaign/search/:code', checkTokenCookie, asyncHandler(campaignController.searchCampaignByCode))

//custom
router.post('/product/campaign/addToCampaign', checkTokenCookie, asyncHandler(campaignController.addToCampaign))
router.post('/product/campaign/removeFromCampaign', checkTokenCookie, asyncHandler(campaignController.removeFromCampaign))

router.get('/product/campaign/updateProductPrice', asyncHandler(campaignController.updateProductPricesForCampaign))
module.exports = router;