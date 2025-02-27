'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DOCUMENT_NAME = 'Orders'

const orderSchema = new Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Đợi xác nhận" },
    date: {
        type: String,
        default: () => {
            // get the current time in VN time zone
            return new Date().toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    },
    paymentMethod: { type: String, default: "Thanh toán khi nhận hàng" },
    payment: { type: Boolean, default: false },
    statusActive: { type: Boolean, default: true }
}, { timestamps: true })

orderSchema.index({ userId: 1 });

const orderModel = mongoose.models.order || mongoose.model(DOCUMENT_NAME, orderSchema)

module.exports = orderModel;