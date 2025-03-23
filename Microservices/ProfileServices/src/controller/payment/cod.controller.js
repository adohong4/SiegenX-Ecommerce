'use strict'

const userModel = require('../../models/profile.model')
const orderModel = require('../../models/order.model')
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../../core/error.response")
const { CREATED } = require("../../core/success.response")
const RedisService = require('../../services/user/UserRedis.service')

class CODController {
    CODplaceOrder = async (req, res) => {
        const userId = req.user;
        try {
            const newOrder = new orderModel({
                userId: userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
                paymentMethod: "Thanh toán khi nhận hàng"
            });

            await newOrder.save();
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            RedisService.deleteCache(`order:user:${userId}`)

            // Trả về phản hồi xác nhận đơn hàng
            new CREATED({
                message: 'Đơn hàng đã được đặt thành công, vui lòng thanh toán khi nhận hàng.',
            }).send(res);
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }
}

module.exports = new CODController();