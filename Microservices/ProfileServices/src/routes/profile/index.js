'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const profileController = require('../../controller/profile.controller')
const { authMiddleware, checkTokenCookie } = require('../../middleware/checkAuth')
const upload = require('../../config/upload.config')
const router = express.Router()

//Profile
router.get('/profile/getProfile', checkTokenCookie, asyncHandler(profileController.getProfile))
router.post('/profile/upload', checkTokenCookie, upload.single("profile"), asyncHandler(profileController.uploadImageProfile)) //Upload image profile




module.exports = router;