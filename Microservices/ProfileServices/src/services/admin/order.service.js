'use strict';

const orderModel = require('../../models/order.model');
const userModel = require('../../models/profile.model');
const { BadRequestError } = require("../../core/error.response");

class OrderService {

    static getOrders = async () => {
        try {
            const orders = await orderModel.find().sort({ createdAt: -1 });
            return { metadata: orders }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = OrderService;