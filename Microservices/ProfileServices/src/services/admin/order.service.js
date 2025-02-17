'use strict';

const orderModel = require('../../models/order.model');
const userModel = require('../../models/profile.model');
const { BadRequestError } = require("../../core/error.response");

class OrderService {

    static getOrders = async () => {
        try {
            const orders = await orderModel.find()
                .select('userId amount address status paymentMethod payment')
                .sort({ createdAt: -1 });
            return { metadata: orders }
        } catch (error) {
            throw error;
        }
    }

    static getOderById = async (id) => {
        try {
            const order = await orderModel.findById(id).sort({ createdAt: -1 });
            if (!order) throw new BadRequestError('Không tìm thấy id');
            return { metadata: order }
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

    static paginateOrder = async (page = 1, pageSize = 5) => {
        try {
            const skip = (page - 1) * pageSize
            const limit = pageSize;

            const order = await orderModel.find()
                .select('userId amount address status paymentMethod payment')
                .skip(skip)
                .limit(limit)
                .exec();
            const totalOrder = await orderModel.countDocuments();
            const totalPages = Math.ceil(totalOrder / pageSize);
            return {
                metadata: {
                    order,
                    currentPage: page,
                    totalPages,
                    totalOrder
                }
            }
        } catch (error) {
            throw error;
        }
    }

    static searchById = async (id) => {
        try {
            const order = await orderModel.find({
                $expr: {
                    $regexMatch: {
                        input: { $toString: "$_id" }, // Chuyển đổi _id thành chuỗi
                        regex: id,
                        options: 'i' // Tìm kiếm không phân biệt chữ hoa chữ thường
                    }
                }
            })
                .select('userId amount address status paymentMethod payment')
                .sort({ createdAt: -1 })
                .exec();
            return {
                metadata: order
            }
        } catch (error) {
            throw (error);
        }
    }

}

module.exports = OrderService;