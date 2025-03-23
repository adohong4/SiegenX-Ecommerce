'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { checkTokenCookieAdmin, checkTokenCookie } = require('../../middleware/checkAuth')
const AccountController = require('../../controller/admin/account.controller')
const router = express.Router()

//Account
router.get('/profile/account/get', asyncHandler(AccountController.getAllAccount))
router.get('/profile/account/get/:id', asyncHandler(AccountController.getAccountById))

router.get('/profile/account/paginate', asyncHandler(AccountController.paginateAccount)) //status: true
router.get('/profile/account/trash/paginate', asyncHandler(AccountController.paginateAccountTrash)) //status: false

router.get('/profile/account/search/:email', checkTokenCookie, asyncHandler(AccountController.searchByEmail))

router.put('/profile/account/update/:id', checkTokenCookieAdmin, asyncHandler(AccountController.updateAccountById))

router.delete('/profile/account/active/:id', checkTokenCookieAdmin, asyncHandler(AccountController.statusAccount))
router.delete('/profile/account/delete/:id', checkTokenCookieAdmin, asyncHandler(AccountController.deleteAccountById))

module.exports = router;