'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const supplierController = require('../../controllers/supplier.controller')
const CustomController = require('../../controllers/custom.controller')
const { authMiddleware, checkTokenCookie } = require('../../middleware/checkAuth')
const router = express.Router()

//Supplier
router.post('/supplier/create', checkTokenCookie, asyncHandler(supplierController.createSupplier))

router.get('/supplier/get', checkTokenCookie, asyncHandler(supplierController.getSupplier))
router.get('/supplier/get/:id', checkTokenCookie, asyncHandler(supplierController.getSupplierById))
router.get('/supplier/paginate', checkTokenCookie, asyncHandler(CustomController.paginate))

router.put('/supplier/update/:id', checkTokenCookie, asyncHandler(supplierController.updateSupplier))

router.delete('/supplier/delete/:id', checkTokenCookie, asyncHandler(supplierController.deleteSupplier))

module.exports = router;