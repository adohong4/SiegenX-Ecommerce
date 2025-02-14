  'use strict';

const productModel = require('../models/product.model');
const fs = require('fs')
const path = require('path');
const { BadRequestError } = require('../core/error.response');

class ProductService {
    static createProduct = async (req, res, next) => {
        try {
            let image_filename = "";
            if (req.files) {
                image_filename = req.files.map(file => file.filename);
            } else {
                throw new Error("No file uploaded");
            }

            const newProduct = new productModel({
                title: req.body.title,
                nameProduct: req.body.nameProduct,
                product_slug: req.body.product_slug,
                price: req.body.price,
                images: image_filename,
                recap: req.body.recap,
                description: req.body.description,
                category: req.body.category,
                quantity: req.body.quantity,
                mainBoard: req.body.mainBoard,
                chip: req.body.chip,
                cpu: req.body.cpu,
                gpu: req.body.gpu,
                ram: req.body.ram,
                memory: req.body.memory,
                version: req.body.version,
                ports: req.body.ports,
                displaySize: req.body.displaySize,
                pixelDensity: req.body.pixelDensity,
                display: req.body.display,
                refreshRate: req.body.refreshRate
            });

            const product = await newProduct.save();

            return {
                product
            }
        } catch (error) {
            throw error
        }
    }

    static getProduct = async () => {
        try {
            const product = await productModel.find({});
            return {
                product
            }
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" })
        }
    }

    static getProductById = async (id) => {
        try {
            const product = await productModel.findById(id);
            return {
                product,
            }
        } catch (error) {
            throw error;
        }
    }

    static getProductByslug = async (product_slug) => {
        try {
            const product = await productModel.findOne({product_slug});
            return {
                product,
            }
        } catch (error) {
            throw error;
        }
    }


    static updateProduct = async (req, res, next) => {
        try {
            const productId = req.params.id;
            const product = await productModel.findById(productId);

            if (!product) {
                throw new BadRequestError('Sản phẩm không tồn tại');
            }

            // Cập nhật thông tin sản phẩm
            const updates = {
                title: req.body.title,
                nameProduct: req.body.nameProduct,
                price: req.body.price,
                recap: req.body.recap,
                description: req.body.description,
                category: req.body.category,
                quantity: req.body.quantity,
                mainBoard: req.body.mainBoard,
                chip: req.body.chip,
                cpu: req.body.cpu,
                gpu: req.body.gpu,
                ram: req.body.ram,
                memory: req.body.memory,
                version: req.body.version,
                ports: req.body.ports,
                displaySize: req.body.displaySize,
                pixelDensity: req.body.pixelDensity,
                display: req.body.display,
                refreshRate: req.body.refreshRate
            };

            const updatedProduct = await productModel.findByIdAndUpdate(productId, updates, { new: true });

            return {
                product: updatedProduct
            }
        } catch (error) {
            throw error;
        }
    };

}
module.exports = ProductService ;
