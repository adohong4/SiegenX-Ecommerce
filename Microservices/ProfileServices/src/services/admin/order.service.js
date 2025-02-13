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

    static updateStatusOrder = async (req, res) => {
        try {
            const order = await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
            return {
                metadata: order
            }
        } catch (error) {
            throw error;
        }
    }

    static deleteOrder = async ({ orderId, isStatus }) => {
        try {
            const deleteOrder = await orderModel.findByIdAndUpdate(
                orderId,
                { statusActive: isStatus },
                { new: true, runValidators: true }
            )
            return {
                metadata: deleteOrder
            };
        } catch (error) {
            throw error;
        }
    }

}

module.exports = OrderService;