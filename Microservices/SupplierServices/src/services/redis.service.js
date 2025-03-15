'use strict';

const { getRedis } = require('../config/init.redis');
const supplierModel = require('../models/supplier.model');
const { RedisErrorResponse } = require('../core/error.response');
const { default: mongoose } = require('mongoose');

const CACHE_TTL = 3600; // TTL default

class RedisService {
    constructor() {
        this.redisClient = getRedis().instanceRedis;
    }

    async ensureClient() {
        if (!this.redisClient || !this.redisClient.isOpen) {
            throw new RedisErrorResponse({
                message: 'Redis client chưa được khởi tạo hoặc đã đóng',
                code: -101,
            });
        }
    }

    async getSupplierById(supplierId) {
        await this.ensureClient();

        const cacheKey = `supplier:${supplierId}`;
        try {
            // Kiểm tra Redis trước
            const cachedSupplier = await this.redisClient.get(cacheKey);
            if (cachedSupplier) {
                console.log(`Cache hit for supplier:${supplierId}`);
                return JSON.parse(cachedSupplier);
            }

            // Nếu không có trong Redis, lấy từ MongoDB
            const supplier = await supplierModel.findById(supplierId).lean();
            if (!supplier) {
                return null;
            }

            // Điền dữ liệu vào Redis
            await this.redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(supplier));
            console.log(`Cache miss - Stored supplier:${supplierId} in Redis`);

            return supplier;
        } catch (error) {
            console.error(`Error in getSupplierById: ${error}`);
            throw error;
        }
    }

    async getSuppliers() {
        await this.ensureClient();

        const cacheKey = 'suppliers:active';
        try {
            // Kiểm tra Redis trước
            const cachedSuppliers = await this.redisClient.get(cacheKey);
            if (cachedSuppliers) {
                console.log(`Cache hit for suppliers:active`);
                return JSON.parse(cachedSuppliers);
            }

            // Nếu không có trong Redis, lấy từ MongoDB
            const suppliers = await supplierModel
                .find({ active: true })
                .select('supplierName email numberPhone status taxCode description lane area city addressOthers active')
                .sort({ createdAt: -1 })
                .lean();

            // Điền dữ liệu vào Redis
            await this.redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(suppliers));
            console.log(`Cache miss - Stored suppliers:active in Redis`);

            return suppliers;
        } catch (error) {
            console.error(`Error in getSuppliers: ${error}`);
            throw error;
        }
    }

    async updateSupplierCache(supplier) {
        await this.ensureClient();

        const cacheKey = `supplier:${supplier._id}`;
        try {
            await this.redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(supplier));
            console.log(`Updated cache for supplier:${supplier._id}`);

            // Cập nhật danh sách suppliers:active nếu supplier active
            if (supplier.active) {
                const suppliers = await supplierModel
                    .find({ active: true })
                    .select('supplierName email numberPhone status taxCode description lane area city addressOthers active')
                    .sort({ createdAt: -1 })
                    .lean();
                await this.redisClient.setEx('suppliers:active', CACHE_TTL, JSON.stringify(suppliers));
                console.log('Updated suppliers:active cache');
            }
        } catch (error) {
            console.error(`Error in updateSupplierCache: ${error}`);
            throw error;
        }
    }

    async invalidateSupplierCache(supplierId) {
        await this.ensureClient();

        const cacheKey = `supplier:${supplierId}`;
        try {
            await this.redisClient.del(cacheKey);
            console.log(`Invalidated cache for supplier:${supplierId}`);

            const keys = await this.redisClient.keys('suppliers:*');
            if (keys.length > 0) {
                await this.redisClient.del(keys);
                console.log(`Invalidated related list caches: ${keys}`);
            }
        } catch (error) {
            console.error(`Error in invalidateSupplierCache: ${error}`);
            throw error;
        }
    }

    async createOrUpdateSupplier(supplierData) {
        try {
            const supplier = await supplierModel.findOneAndUpdate(
                { _id: supplierData._id || new mongoose.Types.ObjectId() },
                supplierData,
                { upsert: true, new: true }
            );

            // Chỉ xóa cache
            await this.invalidateSupplierCache(supplier._id.toString());
            return supplier;
        } catch (error) {
            console.error(`Error in createOrUpdateSupplier: ${error}`);
            throw error;
        }
    }
}

module.exports = new RedisService();