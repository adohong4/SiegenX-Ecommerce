'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DOCUMENT_NAME = 'Suppliers'

const HistorySchema = new Schema({
    createdBy: { type: String, required: true }, //id
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const SupplierSchema = new Schema({
    supplierName: { type: String, required: true },
    email: { type: String, required: true },
    numberPhone: { type: Number, required: true },
    status: { type: String, required: true },
    taxCode: { type: String, required: true },
    description: { type: String },
    lane: { type: String }, //đường
    area: { type: String }, //khu vực
    city: { type: String }, //phường
    addressOthers: { type: String },
    creator: [HistorySchema],
    active: { type: Boolean, default: true },
    orderData: { type: Object, default: [] },
}, { minimize: false, timestamps: true })

const supplierModel = mongoose.models.supplier || mongoose.model(DOCUMENT_NAME, SupplierSchema)

module.exports = supplierModel;