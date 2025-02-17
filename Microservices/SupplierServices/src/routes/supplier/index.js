'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const supplierController = require('../../controllers/supplier.controller')
const { authMiddleware, checkTokenCookie } = require('../../middleware/checkAuth')
const router = express.Router()

//Supplier
router.post('/supplier/create', checkTokenCookie, asyncHandler(supplierController.createSupplier))

module.exports = router;