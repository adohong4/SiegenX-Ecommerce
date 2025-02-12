'use strict'

const { OK, CREATED, SuccessResponse } = require('../core/success.response')
const ProfileService = require('../services/profile.service');

class ProfileController {

    getProfile = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const profile = await ProfileService.getProfile(userId);
            new OK({
                message: 'Lấy thông tin profile thành công',
                metadata: profile
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

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