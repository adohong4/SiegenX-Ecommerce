'use strict';

const productModel = require('../models/product.model');
const fs = require('fs')
const path = require('path');
const mongoose = require('mongoose');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const RedisService = require('./ProductRedis.service')

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

            await RedisService.deleteCache('campaign:products:global');
            await RedisService.deleteCache('products:all');
            await RedisService.clearCacheByPrefix('product');

            return {
                product
            }
        } catch (error) {
            throw error
        }
    }

    static getProduct = async () => {
        const CACHE_KEY = 'products:all';
        try {
            const cachedProducts = await RedisService.getCache(CACHE_KEY);
            if (cachedProducts) {
                console.log('Cache hit: Returning all products from Redis');
                return { product: cachedProducts };
            }

            console.log('Cache miss: Fetching all products from MongoDB');

            const product = await productModel.find()
                .select('title nameProduct product_slug price images category quantity active')
                .sort({ createdAt: -1 })
                .exec();

            await RedisService.setCache(CACHE_KEY, product);

            return { product };
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

            await RedisService.deleteCache('campaign:products:global');
            await RedisService.deleteCache('products:all');
            await RedisService.clearCacheByPrefix('product');

            return { product: updatedProduct }
        } catch (error) {
            throw error;
        }
    };

    static deleteProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const userRole = req.role;
            if (userRole != 'ADMIN') throw new AuthFailureError("Tài khoản không phải quản lý")

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

            await RedisService.deleteCache('campaign:products:global');
            await RedisService.deleteCache('products:all');
            await RedisService.clearCacheByPrefix('product');

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

        await RedisService.deleteCache('campaign:products:global');
        await RedisService.deleteCache('products:all');
        await RedisService.clearCacheByPrefix('product');

        return { metadata: product }
    }

    static getProductByName = async (req, res) => {
        try {
            const { nameProduct } = req.params;
            console.log(nameProduct)
            const product = await productModel.find({ nameProduct: { $regex: nameProduct, $options: 'i' } });
            return {
                metadata: product,
            }
        } catch (error) {
            throw error;
        }
    }

    static getCountProduct = async () => {
        return await productModel.countDocuments();
    }

    static getProductsByPage = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const products = await productModel.find({ active: true })
                .select('title nameProduct product_slug price images category quantity active')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalProducts = await productModel.countDocuments({ active: true });
            const totalPages = Math.ceil(totalProducts / limit);

            return {
                metadata: {
                    products,
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    limit
                }
            };
        } catch (error) {
            throw error;
        }
    }

    static paginateProductTrash = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const products = await productModel.find({ active: false })
                .select('title nameProduct product_slug price images category quantity active')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalProducts = await productModel.countDocuments({ active: false });
            const totalPages = Math.ceil(totalProducts / limit);

            return {
                metadata: {
                    products,
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    limit
                }
            };
        } catch (error) {
            throw error;
        }
    }

    static updateQuantityProduct = async (req, res) => {
        try {
            const { items } = req.body;
            // console.log("items: ", items)
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: "Items must be a non-empty array" });
            }

            // use transaction
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                for (const item of items) {
                    const itemId = item._id;
                    const { quantity } = item;
                    // console.log("itemId: ", itemId)
                    if (!itemId || !quantity || quantity <= 0) {
                        throw new Error(`Invalid itemId or quantity for item: ${JSON.stringify(item)}`);
                    }

                    const product = await productModel.findOne({
                        _id: itemId,
                        active: true
                    }).session(session);

                    if (!product) {
                        throw new Error(`Product with itemId ${itemId} not found or not active`);
                    }

                    if (product.quantity < quantity) {
                        throw new Error(`Không thể thanh toán ${product.nameProduct}. Có sẵn: ${product.quantity}, Mua: ${quantity}`);
                    }

                    product.quantity -= quantity;

                    await product.save({ session });
                }

                await session.commitTransaction();

                return;

            } catch (error) {
                if (session.inTransaction()) {
                    await session.abortTransaction();
                }
                throw error;
            } finally {
                session.endSession();
            }

        } catch (error) {
            throw error;
        }
    }

}
module.exports = ProductService;
