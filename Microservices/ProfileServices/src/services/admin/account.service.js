'use strict'

const accountModel = require('../../models/profile.model')
const bcrypt = require('bcrypt')
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

    static updateAccountById = async (id, fullName, username, password) => {
        try {
            const updates = { fullName, username };

            // Cập nhật mật khẩu nếu có
            if (password) {
                if (password.length < 8) {
                    throw new BadRequestError("Mật khẩu phải dài ít nhất 8 ký tự");
                }
                const salt = await bcrypt.genSalt(10);
                updates.password = await bcrypt.hash(password, salt);
            }

            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            const updatedUser = await accountModel.findByIdAndUpdate(id, updates, { new: true });

            if (!updatedUser) throw new BadRequestError("Cập nhật không thành công");

            return { metadata: updatedUser };
        } catch (error) {
            throw new BadRequestError(error);
        }
    }
}

module.exports = AccountService;