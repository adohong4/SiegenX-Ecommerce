'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const identityController = require('../../controllers/identity.controller')

const router = express.Router()


//signUp && Sign in
router.post('/identity/login', asyncHandler(identityController.login))
router.post('/identity/register', asyncHandler(identityController.register))
router.post('/identity/logout', asyncHandler(identityController.logout))

//Google login

module.exports = router;