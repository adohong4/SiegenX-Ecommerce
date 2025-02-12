'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const ContactController = require('../../controllers/contact.controller')
const router = express.Router()

//client
router.post('/contact/add', asyncHandler(ContactController.addContact))
router.get('/contact/list', asyncHandler(ContactController.getListContact))

module.exports = router; 