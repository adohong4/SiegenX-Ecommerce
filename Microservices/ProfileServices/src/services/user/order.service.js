'use strict';

const orderModel = require('../../models/order.model');
const userModel = require('../../models/profile.model');
const { BadRequestError } = require("../../core/error.response");
const RedisService = require('./UserRedis.service')

class OrderService {

    static userOrders = async (userId) => {
        const CACHE_KEY = `order:user:${userId}`
        try {
            const cachedOrder = await RedisService.getCache(CACHE_KEY);
            if (cachedOrder) {
                console.log('Cache hit: User Order from Redis');
                return { metadata: cachedOrder }
            }
            console.log('Cache miss: User Order from MongoDB');

            if (!userId) throw new BadRequestError("userId is required");

            const orders = await orderModel.find({ userId })
                .select('userId amount status paymentMethod payment statusActive date items._id items.images items.title items.price items.quantity items.category items.product_slug')
                .sort({ createdAt: -1 })
                .exec();

            await RedisService.setCache(CACHE_KEY, orders)

            return { metadata: orders }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = OrderService;