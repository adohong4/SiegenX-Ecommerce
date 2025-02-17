'use strict'

const AccountService = require('../../services/admin/account.service')
const { OK, CREATED } = require('../../core/success.response')

class AccountController {
    getAllAccount = async (req, res, next) => {
        try {
            const result = await AccountService.getAllAccount()
            new OK({
                message: 'Lấy danh sách thành công',
                metadata: result.metadata
            }).send(res)
        } catch (error) {
            next(error);
        }
    }

    getAccountById = async (req, res, next) => {
        try {
            const { id } = req.params
            const result = await AccountService.getAccountById(id)
            new OK({
                message: 'Lấy thông tin thành công',
                metadata: result.metadata
            }).send(res)
        } catch (error) {
            next(error);
        }
    }

    updateAccountById = async (req, res, next) => {
        try {
            const { id } = req.params
            const { fullName, username, password } = req.body
            const result = await AccountService.updateAccountById(id, fullName, username, password)
            new CREATED({
                message: 'cập nhật thông tin thành công',
                metadata: result.metadata
            }).send(res)
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AccountController();