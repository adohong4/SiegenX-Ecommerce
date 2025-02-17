'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authMiddleware, checkTokenCookie } = require('../../middleware/checkAuth')
const AccountController = require('../../controller/admin/account.controller')
const router = express.Router()

//Account
router.get('/profile/account/get', asyncHandler(AccountController.getAllAccount))
router.get('/profile/account/get/:id', asyncHandler(AccountController.getAccountById))

router.put('/profile/account/update/:id', asyncHandler(AccountController.updateAccountById))

module.exports = router;