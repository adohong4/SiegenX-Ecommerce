'use strict'

const { OK, CREATED, SuccessResponse } = require('../core/success.response')
const IdentityService = require('../services/identity.service');

class IdentityController {
    login = async (req, res, next) => {
        new OK({
            metadata: await IdentityService.login(req.body)
        }).send(res)
    }

    register = async () => {
        try {
            const result = await IdentityService.register(req.body)
            new CREATED({
                message: 'Đăng ký thành công',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new IdentityController();