'use strict'

const accountModel = require('../../models/profile.model')
const { BadRequestError, AuthFailureError, NotFoundError } = require("../../core/error.response");

class AccountService {
    static getAllAccount = async () => {
        try {
            const account = await accountModel.find()
                .select('username email role address cartData')
                .sort({ createdAt: -1 })
                .exec();
            return {
                metadata: account
            }
        } catch (error) {
            throw new BadRequestError(error);
        }
    }

    static getAccountById = async (id) => {
        try {
            const account = await accountModel.findById(id)
            return {
                metadata: account
            }
        } catch (error) {
            throw new BadRequestError(error);
        }
    }
}

module.exports = AccountService;