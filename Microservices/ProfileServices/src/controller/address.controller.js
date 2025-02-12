'use strict'

const AddressService = require('../services/address.service');
const { OK, CREATED } = require('../core/success.response')

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

    getListAddress = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const result = await AddressService.getListAddress(userId);
            new OK({
                message: 'Lấy danh sách địa chỉ thành công',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    deleteAddress = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const { addressId } = req.params;
            await AddressService.deleteAddress({ userId, addressId });
            new OK({
                message: 'Xóa địa chỉ thành công',
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AddressController();