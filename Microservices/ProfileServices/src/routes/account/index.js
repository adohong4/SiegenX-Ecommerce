'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authMiddleware, checkTokenCookie } = require('../../middleware/checkAuth')
const AccountController = require('../../controller/admin/account.controller')
const router = express.Router()

//Account
router.get('/profile/account/get', checkTokenCookie, asyncHandler(AccountController.getAllAccount))
router.get('/profile/account/get/:id', checkTokenCookie, asyncHandler(AccountController.getAccountById))
router.get('/profile/account/paginate', checkTokenCookie, asyncHandler(AccountController.paginateAccount))
router.get('/profile/account/search/:email', checkTokenCookie, asyncHandler(AccountController.searchByEmail))

router.put('/profile/account/update/:id', checkTokenCookie, asyncHandler(AccountController.updateAccountById))
router.delete('/profile/account/delete/:id', checkTokenCookie, asyncHandler(AccountController.statusAccount))


module.exports = router;