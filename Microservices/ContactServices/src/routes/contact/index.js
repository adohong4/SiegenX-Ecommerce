'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const ContactController = require('../../controllers/contact.controller')
const contactController = require('../../controllers/contact.controller')
const router = express.Router()

//client
router.post('/contact/add', asyncHandler(ContactController.addContact));
router.get('/contact/list', asyncHandler(ContactController.getListContact));
router.get('/contact/list/:id', asyncHandler(ContactController.getDetailContact));
router.post('/contact/updateICheck/:id', asyncHandler(ContactController.updateContactIsCheck));
router.get('/contact/search_email/:email', asyncHandler(ContactController.getContactsByEmail));
router.get('/contact/count', asyncHandler(contactController.countContact));
router.get('/contact/pagination', asyncHandler(contactController.getContactWithPagination));
router.delete('/contact/delete/:id', asyncHandler(contactController.deleteContact));

module.exports = router; 