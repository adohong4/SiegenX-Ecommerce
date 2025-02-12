'use strict'

const profileModel = require("../models/profile.model");

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
}

module.exports = AddressService;