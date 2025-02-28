'use strict'
const express = require('express');

const invoiceController = require('../../controllers/invoice.controller')
const { asyncHandler } = require('../../helpers/asyncHandler');
const { checkTokenCookie } = require('../../middleware/checkAuth')


const router = express.Router();

router.post('/product/invoice/create', checkTokenCookie, asyncHandler(invoiceController.createInvoiceInput))

router.get('/product/invoice/get', checkTokenCookie, asyncHandler(invoiceController.getAllInvoice))
router.get('/product/invoice/get/:id', asyncHandler(invoiceController.getInvoiceById))

router.get('/product/invoice/paginate', checkTokenCookie, asyncHandler(invoiceController.paginateInvoice))
router.get('/product/invoice/trash/paginate', checkTokenCookie, asyncHandler(invoiceController.paginateInvoiceTrash)) //trash

router.get('/product/invoice/search/:invoiceId', checkTokenCookie, asyncHandler(invoiceController.searchByInvoiceId))

router.put('/product/invoice/update/:id', checkTokenCookie, asyncHandler(invoiceController.updateInvoiceById))
router.put('/product/invoice/push/:id', checkTokenCookie, asyncHandler(invoiceController.pushNumberOfProduct)) // push the number of product from invoice to product

router.delete('/product/invoice/active/:id', checkTokenCookie, asyncHandler(invoiceController.softDeleteRestoreInvoice)) //delete && restore

module.exports = router;