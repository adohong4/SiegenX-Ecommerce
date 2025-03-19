'use strict';

const orderModel = require('../../models/order.model');
const userModel = require('../../models/profile.model');
const { BadRequestError, AuthFailureError } = require("../../core/error.response");
const RedisService = require('../user/UserRedis.service');

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
            const staffName = req.staffName;
            const userId = req.user;
            const { status, orderId } = req.body;

            const order = await orderModel.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            const updateData = { status: status };

            if (status === 'Giao hàng thành công' &&
                order.paymentMethod === 'Thanh toán khi nhận hàng') {
                updateData.payment = true;
            }

            await orderModel.findByIdAndUpdate(orderId, updateData);

            order.creator.push({
                createdBy: userId,
                createdName: staffName,
                description: `Cập nhật trạng thái ${status}`
            });

            await order.save();

            const CACHE_KEY = `order:user:${order.userId}`;
            await RedisService.deleteCache(CACHE_KEY);

            return {
                metadata: order
            };
        } catch (error) {
            throw error;
        }
    }

    static deleteOrder = async (req, res) => {
        try {
            const userRole = req.role;
            const orderId = req.params.id;
            if (userRole !== "ADMIN") throw new AuthFailureError("Tài khoản bị giới hạn chức năng.")
            const deleteOrder = await orderModel.findByIdAndDelete(orderId);

            await RedisService.deleteCache(`order:user:${orderId.userId}`);

            return {
                metadata: deleteOrder
            };
        } catch (error) {
            throw error;
        }
    }

    static toggleOrderStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user;
            const staffName = req.staffName;
            const order = await orderModel.findById(id);

            const newStatus = !order.statusActive;
            const actionDes = newStatus ? "Hồi phục hóa đơn" : "Đã xóa hóa đơn";

            order.statusActive = newStatus;
            order.creator.push({
                createdBy: userId,
                createdName: staffName,
                description: actionDes
            })
            await order.save();
            return order;
        } catch (error) {
            throw error;
        }
    }

    static paginateOrder = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit

            const order = await orderModel.find({ statusActive: true })
                .select('userId amount address status paymentMethod payment createdAt statusActive items')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalOrder = await orderModel.countDocuments({ statusActive: true });
            const totalPages = Math.ceil(totalOrder / limit);
            return {
                metadata: {
                    order,
                    currentPage: page,
                    totalPages,
                    totalOrder,
                    limit
                }
            }
        } catch (error) {
            throw error;
        }
    }

    static paginateOrderTrash = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit

            const order = await orderModel.find({ statusActive: false })
                .select('userId amount address status paymentMethod payment createdAt statusActive')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalOrder = await orderModel.countDocuments({ statusActive: false });
            const totalPages = Math.ceil(totalOrder / limit);
            return {
                metadata: {
                    order,
                    currentPage: page,
                    totalPages,
                    totalOrder,
                    limit
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
                        input: { $toString: "$_id" },
                        regex: id,
                        options: 'i'
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