'use strict'

const { OK, CREATED, SuccessResponse } = require('../core/success.response')
const ProfileService = require('../services/profile.service');

class ProfileController {
    uploadImageProfile = async (req, res, next) => {
        try {
            const result = await ProfileService.uploadImageProfile(req, res, next);
            new CREATED({
                message: 'Upload ảnh thành công',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new ProfileController();