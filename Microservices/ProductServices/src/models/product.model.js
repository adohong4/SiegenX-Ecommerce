'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify')

const DOCUMENT_NAME = 'Products';

const HistorySchema = new Schema({
    createdBy: { type: String, required: true },//id
    createdName: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const ProductSchema = new Schema(
    {
        title: { type: String, required: true },
        nameProduct: { type: String, required: true },
        product_slug: String,
        price: { type: Number, default: 0 },
        images: [String],
        recap: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        quantity: { type: Number, required: true },
        mainBoard: { type: String },
        chip: { type: String },
        cpu: { type: String },
        gpu: { type: String },
        ram: { type: String },
        memory: { type: String },
        version: { type: String },
        ports: { type: String },
        displaySize: { type: String },
        pixelDensity: { type: String },
        display: { type: String },
        refreshRate: { type: String },
        creator: [HistorySchema],
        active: { type: Boolean, default: true },
    },
    { minimize: false, timestamps: true }
);

//Document middleware: runs before .save() and .create()....
ProductSchema.pre('save', function (next) {
    this.product_slug = slugify(this.nameProduct, { lower: true })
    next();
})

ProductSchema.index({ _id: -1, category: 1 });

const productModel = mongoose.models.product || mongoose.model(DOCUMENT_NAME, ProductSchema);

module.exports = productModel;