'use strict'

const profileModel = require("../../models/profile.model");

class AddressService {
    static createAddress = async ({ userId, fullname, phone, street, precinct, city, province }) => {
        try {
            const newAddress = { fullname, phone, street, precinct, city, province };

            const updatedProfile = await profileModel.findByIdAndUpdate(
                userId,
                { $push: { address: newAddress } },
                { new: true, runValidators: true }
            );

            return {
                metadata: updatedProfile.address,
            }
        } catch (error) {
            throw error;
        }
    }

    static getListAddress = async (userId) => {
        try {
            const profile = await profileModel.findById(userId);

            if (!profile) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            return { metadata: { addresses: profile.address } };
        } catch (error) {
            throw error;
        }
    }

    static deleteAddress = async ({ userId, addressId }) => {
        try {
            const profile = await profileModel.findById(userId);

            if (!profile) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            const updatedProfile = await profileModel.findOneAndUpdate(
                { _id: userId },
                { $pull: { address: { _id: addressId } } },
                { new: true }
            );

            if (!updatedProfile) {
                throw new BadRequestError("Không tìm thấy địa chỉ để xóa");
            }

            return;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AddressService;