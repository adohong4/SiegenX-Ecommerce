'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const supplierController = require('../../controllers/supplier.controller')
const CustomController = require('../../controllers/custom.controller')
const { authMiddleware, checkTokenCookie } = require('../../middleware/checkAuth')
const router = express.Router()

//Supplier
router.post('/supplier/create', checkTokenCookie, asyncHandler(supplierController.createSupplier))

router.get('/supplier/get', asyncHandler(supplierController.getSupplier))
router.get('/supplier/get/:id', asyncHandler(supplierController.getSupplierById))

router.get('/supplier/paginate', asyncHandler(CustomController.paginate)) //pagination
router.get('/supplier/trash/paginate', asyncHandler(CustomController.paginateTrash)) //trash

router.get('/supplier/search/:name', asyncHandler(CustomController.searchByName)) //search by name

router.put('/supplier/update/:id', checkTokenCookie, asyncHandler(supplierController.updateSupplier))

router.delete('/supplier/active/:id', checkTokenCookie, asyncHandler(supplierController.activeSupplier)) //delete&&restore
router.delete('/supplier/delete/:id', checkTokenCookie, asyncHandler(supplierController.deleteSupplier))

module.exports = router;