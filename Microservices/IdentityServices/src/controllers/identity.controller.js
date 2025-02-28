'use strict'

const { OK, CREATED, SuccessResponse } = require('../core/success.response')
const IdentityService = require('../services/identity.service');

class IdentityController {
    login = async (req, res, next) => {
        const { email, password } = req.body;
        const result = await IdentityService.login(req, { email, password });
        new OK({
            message: 'Đăng nhập thành công',
            metadata: result,
        }).send(res)
    }

    register = async (req, res, next) => {
        try {
            const { email, password, username } = req.body;
            const result = await IdentityService.register(req, { username, email, password })
            new CREATED({
                message: 'Đăng ký thành công',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    logout = async (req, res, next) => {
        try {
            await IdentityService.logout(res);
            new OK({
                message: 'Đăng xuất thành công',
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new IdentityController();