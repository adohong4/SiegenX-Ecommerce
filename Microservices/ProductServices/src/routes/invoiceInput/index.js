'use strict'
const express = require('express');

const invoiceController = require('../../controllers/invoice.controller')
const { asyncHandler } = require('../../helpers/asyncHandler');
const { checkTokenCookie } = require('../../middleware/checkAuth')


const router = express.Router();

router.post('/invoice/create', checkTokenCookie, asyncHandler(invoiceController.createInvoiceInput))

router.get('/invoice/get', asyncHandler(invoiceController.getAllInvoice))
router.get('/invoice/get/:id', asyncHandler(invoiceController.getInvoiceById))

router.delete('/invoice/active/:id', checkTokenCookie, asyncHandler(invoiceController.softDeleteRestoreInvoice)) //delete && restore

module.exports = router;