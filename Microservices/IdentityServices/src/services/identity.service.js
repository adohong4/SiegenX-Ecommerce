'use strict'

const identityModel = require("../models/identity.model");
const bcrypt = require('bcrypt')
const validator = require('validator')
const { getInfoData } = require("../utils")
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { createToken } = require("../middleware/authUtils")

class IdentityService {
    static login = async () => {
        try {
            const user = await identityModel.findOne({ email });

            if (!user) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            const isMath = await bcrypt.compare(password, user.password);

            if (!isMath) {
                throw new BadRequestError("Mật khẩu không chính xác");
            }

            const token = createToken(user._id);
            return {
                user: {
                    id: user._id,
                    email: user.email,
                },
                token,
            };
        } catch (error) {
            throw error;
        }
    }

    static register = async () => {
        try {

        } catch (error) {

        }
    }

}

module.exports = IdentityService;