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
}, { minimize: false, timestamps: true })

const supplierModel = mongoose.models.supplier || mongoose.model(DOCUMENT_NAME, SupplierSchema)


async function createSupplier(data) {
    const supplier = new supplierModel(data);
    await supplier.save();

    const objectIdHex = supplier._id.toString();
    const formattedId = `SUPN${objectIdHex.slice(-4).toUpperCase()}`;

    console.log('Supplier created with ID: ', formattedId);
    return formattedId;
}

module.exports = supplierModel;