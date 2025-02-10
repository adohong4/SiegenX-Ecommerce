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

        } catch (error) {

        }
    }

}

module.exports = new IdentityController();