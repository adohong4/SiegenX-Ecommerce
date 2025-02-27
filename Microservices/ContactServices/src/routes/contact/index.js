'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const ContactController = require('../../controllers/contact.controller')
const contactController = require('../../controllers/contact.controller')
const router = express.Router()
const { checkTokenCookie } = require('../../middleware/checkAuth');


//client
router.post('/contact/add', asyncHandler(ContactController.addContact));
router.get('/contact/list', asyncHandler(ContactController.getListContact));
router.get('/contact/list/:id', asyncHandler(ContactController.getDetailContact));
router.put('/contact/isCheck/:id', checkTokenCookie, asyncHandler(ContactController.updateContactIsCheck));
router.get('/contact/search/:email', asyncHandler(ContactController.getContactsByEmail));
router.get('/contact/count', asyncHandler(contactController.countContact));

router.get('/contact/pagination', asyncHandler(contactController.getContactWithPagination));//StatusActive: true
router.get('/contact/paginate', asyncHandler(contactController.paginateContact));//StatusActive: false

router.delete('/contact/delete/:id', checkTokenCookie, asyncHandler(contactController.deleteContact));
router.delete('/contact/status/:id', checkTokenCookie, asyncHandler(ContactController.toggleContactStatus)); //delete && restore

module.exports = router; 