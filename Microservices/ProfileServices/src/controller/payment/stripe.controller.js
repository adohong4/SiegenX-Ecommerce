'use strict'

const userModel = require('../../models/profile.model')
const orderModel = require('../../models/order.model')
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../../core/error.response")
const { CREATED } = require("../../core/success.response")
const RedisService = require('../../services/user/UserRedis.service')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeController {
    placeOrder = async (req, res) => {
        const userId = req.user;
        const frontend_url = process.env.URL_FRONTEND;
        try {
            // Tính tổng số tiền
            const totalAmount = req.body.amount;
            if (totalAmount < 99999999) {
                // Tính toán tổng số tiền từ các mặt hàng
                const line_items = req.body.items.map((item) => ({
                    price_data: {
                        currency: "vnd",
                        product_data: {
                            name: item.nameProduct
                        },
                        unit_amount: item.price
                    },
                    quantity: item.quantity
                }));

                // Thêm phí giao hàng
                line_items.push({
                    price_data: {
                        currency: "vnd",
                        product_data: {
                            name: "Phí vận chuyển"
                        },
                        unit_amount: 50000
                    },
                    quantity: 1
                });
                const newOrder = new orderModel({
                    userId: userId,
                    items: req.body.items,
                    amount: totalAmount,
                    address: req.body.address,
                    paymentMethod: "Thanh toán trực tuyến"
                });
                // Nếu tổng số tiền hợp lệ
                await newOrder.save();
                await userModel.findByIdAndUpdate(userId, { cartData: {} });
                // Tạo phiên giao dịch Stripe
                const session = await stripe.checkout.sessions.create({
                    line_items: line_items,
                    mode: 'payment',
                    payment_method_types: ['card'],
                    success_url: `${frontend_url}/verify/?success=true&orderId=${newOrder._id}`,
                    cancel_url: `${frontend_url}/verify/?success=false&orderId=${newOrder._id}`,
                });

                res.json({ success: true, session_url: session.url });
            } else {
                res.json({ success: false, message: "Vượt quá hạn mức giao dịch (99 triệu)" });
            }
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Có lỗi xảy ra." });
        }
    }

    //verify Order
    verifyOrder = async (req, res) => {
        const userId = req.user;
        const { orderId, success } = req.body;
        try {
            if (success == "true") {
                await orderModel.findByIdAndUpdate(orderId, { payment: true });
                await RedisService.deleteCache(`order:user:${userId}`)
                res.json({ success: true, message: "paid" })
            }
            else {
                await orderModel.findByIdAndDelete(orderId);
                res.json({ success: false, message: "Not paid" })
            }
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" })
        }
    }
}

module.exports = new StripeController();