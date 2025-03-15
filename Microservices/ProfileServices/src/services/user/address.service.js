'use strict'

const profileModel = require("../../models/profile.model");
const RedisService = require('./UserRedis.service')

class AddressService {
    static createAddress = async ({ userId, fullname, phone, street, precinct, city, province }) => {
        try {
            const newAddress = { fullname, phone, street, precinct, city, province };

            const updatedProfile = await profileModel.findByIdAndUpdate(
                userId,
                { $push: { address: newAddress } },
                { new: true, runValidators: true }
            );

            await RedisService.deleteCache(`address:user:${userId}`)

            return {
                metadata: updatedProfile.address,
            }
        } catch (error) {
            throw error;
        }
    }

    static getListAddress = async (userId) => {
        const CACHE_KEY = `address:user:${userId}`;
        try {
            const cachedAddress = await RedisService.getCache(CACHE_KEY);
            if (cachedAddress) {
                console.log('Cache hit: User Address from Redis');
                return { metadata: { addresses: cachedAddress } };
            }

            console.log('Cache miss: User Address from MongoDB');

            const profile = await profileModel.findById(userId);
            if (!profile) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            await RedisService.setCache(CACHE_KEY, profile.address);

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

            await RedisService.deleteCache(`address:user:${userId}`)

            return;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AddressService;