'use strict';

const orderModel = require('../../models/order.model');
const userModel = require('../../models/profile.model');
const { BadRequestError } = require("../../core/error.response");

class OrderService {

    static userOrders = async (userId) => {
        try {
            if (!userId) throw new BadRequestError("userId is required");

            const orders = await orderModel.find({ userId })
                .select('userId amount status paymentMethod payment statusActive date items.images items.title items.price items.quantity items.category items.product_slug')
                .sort({ createdAt: -1 });
            return { metadata: orders }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = OrderService;