'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const profileController = require('../../controller/user/profile.controller')
const addressController = require('../../controller/user/address.controller')
const { authMiddleware, checkTokenCookie } = require('../../middleware/checkAuth')
const upload = require('../../config/upload.config')
const router = express.Router()

//Profile
router.get('/profile/getProfile', checkTokenCookie, asyncHandler(profileController.getProfile))
router.post('/profile/upload', checkTokenCookie, upload.single("profile"), asyncHandler(profileController.uploadImageProfile)) //Upload image profile
router.put('/profile/update', checkTokenCookie, asyncHandler(profileController.updateProfile))


//Address
router.post('/profile/address/create', checkTokenCookie, asyncHandler(addressController.createAddress))
router.get('/profile/address/getList', checkTokenCookie, asyncHandler(addressController.getListAddress))
router.delete('/profile/address/delete/:addressId', checkTokenCookie, asyncHandler(addressController.deleteAddress))

module.exports = router;