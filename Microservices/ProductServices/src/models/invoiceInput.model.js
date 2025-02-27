'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DOCUMENT_NAME = 'InvoiceInputs';

const ProductInputSchema = new Schema({
    nameProduct: { type: String, required: true },
    imageProduct: { type: String, required: true },
    productId: { type: String, required: true }, //id
    count: { type: Number, required: true },
    priceInput: { type: Number, required: true },
    tax: { type: Number },
    value: { type: Number, required: true }
})

const SupplierSchema = new Schema({
    nameSupplier: { type: String, required: true },
    supplierId: { type: String, required: true }, //id
    email: { type: String, required: true },
    numberPhone: { type: String, required: true },
})

const HistorySchema = new Schema({
    createdBy: { type: String, required: true }, //id
    createdName: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const InvoiceInputSchema = new Schema(
    {
        invoiceId: { type: String, required: true, unique: true },
        productIds: [ProductInputSchema],
        inputDate: { type: Date, required: true },
        statusPayment: { type: String, enum: ['pending', 'partial payment', 'completed'], default: 'pending' },
        statusInput: { type: String, enum: ['not imported', 'imported'], default: 'not imported' },
        status: {
            type: String, enum: [
                'active',          // đang hoạt động
                'paused',          // tạm dừng
                'completed',       // đã hoàn thành
                'pending',         // đang chờ xử lý
                'cancelled',       // đã bị hủy
                'failed',          // không thành công
                'draft'            // đang ở dạng nháp
            ], default: 'pending'
        },
        supplierId: [SupplierSchema],
        valueInvoice: { type: Number, required: true },
        creator: [HistorySchema],
        active: { type: Boolean, default: true },
    }, { minimize: false, timestamps: true }
);

InvoiceInputSchema.index({ _id: -1, category: 1 });

const invoiceInputModel = mongoose.models.invoice || mongoose.model(DOCUMENT_NAME, InvoiceInputSchema);

module.exports = invoiceInputModel;