'use strict';

const productModel = require('../models/product.model');
const fs = require('fs')
const path = require('path');
const { BadRequestError } = require('../core/error.response');

class ProductService {
    static createProduct = async (req, res, next) => {
        try {
            const staffId = req.user;
            const staffName = req.staffName;
            const { title, nameProduct, price, recap, description, category, quantity,
                mainBoard, chip, cpu, gpu, ram, memory, version, ports, displaySize, pixelDensity, display, refreshRate
            } = req.body
            let image_filename = "";
            if (req.files) {
                image_filename = req.files.map(file => file.filename);
            } else {
                throw new Error("No file uploaded");
            }

            const newProduct = new productModel({
                title, nameProduct, price, category, quantity,
                images: image_filename,
                recap, description,

                mainBoard, chip, cpu, gpu, ram, memory, version, ports,
                displaySize, pixelDensity, display, refreshRate,
                creator: {
                    createdBy: staffId,
                    createdName: staffName,
                    description: "Tạo mới sản phẩm"
                }
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
            const product = await productModel.find()
                .select('title nameProduct product_slug price images category quantity active')
                .exec();
            return {
                product
            }
        } catch (error) {
            throw error;
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
            const product = await productModel.findOne({ product_slug });
            return {
                product,
            }
        } catch (error) {
            throw error;
        }
    }


    static updateProduct = async (req, res, next) => {
        try {
            const staffId = req.user;
            const staffName = req.staffName;
            const productId = req.params.id;
            const { title, nameProduct, price, recap, description, category, quantity,
                mainBoard, chip, cpu, gpu, ram, memory, version, ports, displaySize, pixelDensity, display, refreshRate
            } = req.body;

            const updates = {
                title, nameProduct, price, recap, description, category, quantity,
                mainBoard, chip, cpu, gpu, ram, memory, version, ports, displaySize, pixelDensity, display, refreshRate
            };

            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
            const updatedProduct = await productModel.findByIdAndUpdate(productId, updates, { new: true });

            if (!updatedProduct) {
                throw new BadRequestError('Không tìm thấy sản phẩm');
            }

            updatedProduct.creator.push({
                createdBy: staffId,
                createdName: staffName,
                description: "Cập nhật sản phẩm"
            });
            await updatedProduct.save();

            return { product: updatedProduct }
        } catch (error) {
            throw error;
        }
    };

    static deleteProduct = async (id) => {
        try {
            const product = await productModel.findById(id);

            if (!product) {
                throw new Error('Product not found');
            }

            if (product.images && product.images.length > 0) {
                // Lặp qua mảng images và xóa tất cả hình ảnh
                const deleteImagePromises = product.images.map(image => {
                    const imagePath = path.join(__dirname, '../../upload', image); // Tạo đường dẫn đầy đủ
                    return new Promise((resolve, reject) => {
                        fs.access(imagePath, fs.constants.F_OK, (err) => {
                            if (err) {
                                console.warn(`Image not found: ${imagePath}`);
                                return resolve(); // Nếu hình ảnh không tồn tại, bỏ qua
                            }

                            fs.unlink(imagePath, (err) => {
                                if (err) {
                                    console.error(`Error deleting image: ${imagePath}`, err);
                                    return reject(err);
                                }
                                console.log(`Image deleted: ${imagePath}`);
                                resolve();
                            });
                        });
                    });
                });

                // Chờ cho tất cả hình ảnh được xóa
                await Promise.all(deleteImagePromises);
            } else {
                console.warn('No images to delete.');
            }

            await productModel.findByIdAndDelete(id)

            return {
                product
            }
        } catch (error) {
            throw error;
        }
    }

    static softRestoreProduct = async (staffId, staffName, id) => {
        const product = await productModel.findById(id)
        const newActiveStatus = !product.active;
        const actionDescription = newActiveStatus ? "Hồi phục sản phẩm" : "Xóa sản phẩm";

        product.active = newActiveStatus;
        product.creator.push({
            createdBy: staffId,
            createdName: staffName,
            description: actionDescription
        })
        await product.save();
        return { metadata: product }
    }

    static getProductByTitle = async (title) => {
        try {
            const product_title = String(title).trim();
            const product = await productModel.find({
                title: { $regex: product_title, $options: 'i' } // 'i' để tìm kiếm không phân biệt chữ hoa/thường
            });
            return {
                product,
            }
        } catch (error) {
            throw error;
        }
    }

    static getCountProduct = async () => {
        return await productModel.countDocuments();
    }

    static getProductsByPage = async (page = 1, pageSize = 5) => {
        try {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;

            const products = await productModel.find()
                .select('title nameProduct product_slug price images category quantity active')
                .skip(skip)
                .limit(limit)
                .exec();

            const totalProducts = await productModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / pageSize);

            return {
                metadata: {
                    products,
                    currentPage: page,
                    totalPages,
                    totalProducts,
                }
            };
        } catch (error) {
            throw error;
        }
    }


}
module.exports = ProductService;
