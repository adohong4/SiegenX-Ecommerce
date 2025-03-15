'use strict';

const { getRedis } = require('../config/init.redis');
const { RedisErrorResponse } = require('../core/error.response');

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

    async setCache(key, data, ttl = CACHE_TTL) {
        try {
            await this.ensureClient();
            const serializedData = JSON.stringify(data);
            await this.redisClient.setEx(key, ttl, serializedData);
            console.log(`Cache set for key: ${key} with TTL: ${ttl}`);
        } catch (error) {
            console.error(`Error setting cache for key ${key}:`, error);
            throw new RedisErrorResponse({
                message: 'Lỗi khi lưu dữ liệu vào Redis',
                code: -102,
                details: error.message,
            });
        }
    }

    async getCache(key) {
        try {
            await this.ensureClient();
            const data = await this.redisClient.get(key);
            if (data) {
                console.log(`Cache hit for key: ${key}`);
                return JSON.parse(data);
            }
            console.log(`Cache miss for key: ${key}`);
            return null;
        } catch (error) {
            console.error(`Error getting cache for key ${key}:`, error);
            throw new RedisErrorResponse({
                message: 'Lỗi khi lấy dữ liệu từ Redis',
                code: -103,
                details: error.message,
            });
        }
    }

    async deleteCache(key) {
        try {
            await this.ensureClient();
            const result = await this.redisClient.del(key);
            console.log(`Cache deleted for key: ${key}, result: ${result}`);
            return result;
        } catch (error) {
            console.error(`Error deleting cache for key ${key}:`, error);
            throw new RedisErrorResponse({
                message: 'Lỗi khi xóa dữ liệu từ Redis',
                code: -104,
                details: error.message,
            });
        }
    }

    // Xóa nhiều key theo pattern (ví dụ: "product:*")
    async clearCacheByPrefix(prefix) {
        try {
            await this.ensureClient();
            const keys = await this.redisClient.keys(`${prefix}:*`);
            if (keys.length > 0) {
                await this.redisClient.del(keys);
                console.log(`Cleared ${keys.length} keys with prefix: ${prefix}`);
            }
            return keys.length;
        } catch (error) {
            console.error(`Error clearing cache with prefix ${prefix}:`, error);
            throw new RedisErrorResponse({
                message: 'Lỗi khi xóa cache theo prefix',
                code: -106,
                details: error.message,
            });
        }
    }

    // Lưu danh sách sản phẩm vào Redis với key theo slug
    async cacheProductBySlug(slug, productData, ttl = CACHE_TTL) {
        const key = `product:${slug}`;
        await this.setCache(key, productData, ttl);
    }

    // Lấy sản phẩm từ Redis theo slug
    async getProductBySlugFromCache(slug) {
        const key = `product:${slug}`;
        return await this.getCache(key);
    }

    // Xóa cache sản phẩm theo slug
    async deleteProductCacheBySlug(slug) {
        const key = `product:${slug}`;
        return await this.deleteCache(key);
    }

    // Lưu danh sách sản phẩm theo chiến dịch
    async cacheProductsByCampaign(campaignId, productsData, ttl = CACHE_TTL) {
        const key = `campaign:products:${campaignId}`;
        await this.setCache(key, productsData, ttl);
    }

    // Lấy danh sách sản phẩm từ Redis theo chiến dịch
    async getProductsByCampaignFromCache(campaignId) {
        const key = `campaign:products:${campaignId}`;
        return await this.getCache(key);
    }

    // Xóa cache danh sách sản phẩm theo chiến dịch
    async deleteProductsCacheByCampaign(campaignId) {
        const key = `campaign:products:${campaignId}`;
        return await this.deleteCache(key);
    }

    // Lưu thông tin chiến dịch
    async cacheCampaign(campaignId, campaignData, ttl = CACHE_TTL) {
        const key = `campaign:${campaignId}`;
        await this.setCache(key, campaignData, ttl);
    }

    // Lấy thông tin chiến dịch từ Redis
    async getCampaignFromCache(campaignId) {
        const key = `campaign:${campaignId}`;
        return await this.getCache(key);
    }

    // Xóa cache chiến dịch
    async deleteCampaignCache(campaignId) {
        const key = `campaign:${campaignId}`;
        return await this.deleteCache(key);
    }
}

module.exports = new RedisService();