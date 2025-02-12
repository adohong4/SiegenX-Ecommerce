'use strict'

const AddressService = require('../services/address.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class AddressController {
    createAddress = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const { fullname, phone, street, precinct, city, province } = req.body;
            const result = await AddressService.createAddress({ userId, fullname, phone, street, precinct, city, province });
            new CREATED({
                message: 'Tạo địa chỉ mới thành công',
                metadata: result.metadata
            }).send(res);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AddressController();