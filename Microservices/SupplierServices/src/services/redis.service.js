'use strict'

const { getRedis } = require('../config/init.redis')
const supplierModel = require('../models/supplier.model')
const { RedisErrorResponse, BadRequestError } = require('../core/error.response')
const CACHE_TTL = 3600;

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
            const cachedSupplier = await this.redisClient.get(cacheKey);
            if (cachedSupplier) {
                console.log(`Cache hit for supplier:${supplierId}`);
                return JSON.parse(cachedSupplier);
            }

            const supplier = await supplierModel.findById(supplierId).lean();
            if (!supplier) {
                return null;
            }

            await this.redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(supplier));
            console.log(`Cache miss - Stored supplier:${supplierId} in Redis`);

            return supplier;
        } catch (error) {
            console.error(`Error in getSupplierById: ${error}`);
            throw new RedisErrorResponse({
                message: 'Lỗi khi lấy thông tin nhà cung cấp',
                code: -102,
            });
        }
    }

}

module.exports = new RedisService();