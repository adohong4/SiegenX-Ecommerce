'use strict'
const express = require('express');

const campaignController = require('../../controllers/campaign.controller')
const { asyncHandler } = require('../../helpers/asyncHandler');
const { checkTokenCookie } = require('../../middleware/checkAuth')


const router = express.Router();

router.post('/product/campaign/create', checkTokenCookie, asyncHandler(campaignController.createCampaign))

router.get('/product/campaign/get', asyncHandler(campaignController.getAllCampaign))
router.get('/product/campaign/get/:id', checkTokenCookie, asyncHandler(campaignController.getCampaignById))

router.put('/product/campaign/update/:id', checkTokenCookie, asyncHandler(campaignController.updateCampaignById))

router.delete('/product/campaign/active/:id', checkTokenCookie, asyncHandler(campaignController.activeCampaign))//delete && restore
router.delete('/product/campaign/delete/:id', checkTokenCookie, asyncHandler(campaignController.deleteCampaign))

router.get('/product/campaign/paginate', checkTokenCookie, asyncHandler(campaignController.paginateCampaign))
router.get('/product/campaign/trash/paginate', checkTokenCookie, asyncHandler(campaignController.paginateCampaignTrash))

router.get('/product/campaign/search/:code', checkTokenCookie, asyncHandler(campaignController.searchCampaignByCode))

//custom
router.post('/product/campaign/addToCampaign', checkTokenCookie, asyncHandler(campaignController.addToCampaign))
router.post('/product/campaign/removeFromCampaign', checkTokenCookie, asyncHandler(campaignController.removeFromCampaign))

router.get('/product/campaign/updateProductPrice', asyncHandler(campaignController.updateProductPricesForCampaign))
router.get('/product/campaign/updateProductPrice/:productSlug', asyncHandler(campaignController.updateProductPricesForCampaignBySlug))
module.exports = router;