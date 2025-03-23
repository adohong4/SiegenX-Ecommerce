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

    async setCache(key, data, ttl = CACHE_TTL, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                await this.ensureClient();
                const serializedData = JSON.stringify(data);
                await this.redisClient.setEx(key, ttl, serializedData);
                console.log(`Cache set for key: ${key} with TTL: ${ttl}`);
                return;
            } catch (error) {
                if (i === retries - 1) {
                    console.error(`Error setting cache for key ${key}:`, error);
                    throw new RedisErrorResponse({
                        message: 'Lỗi khi lưu dữ liệu vào Redis',
                        code: -102,
                        details: error.message,
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s
            }
        }
    }

    async getCache(key) {
        try {
            await this.ensureClient();
            const data = await this.redisClient.get(key);
            if (data) {
                console.log(`Cache hit for key: ${key}`);
                try {
                    return JSON.parse(data);
                } catch (parseError) {
                    console.error(`Error parsing cache data for key ${key}:`, parseError);
                    return null;
                }
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
        } catch (error) {
            console.error(`Error clearing cache with prefix ${prefix}:`, error);
            throw new RedisErrorResponse({
                message: 'Lỗi khi xóa cache theo prefix',
                code: -106,
                details: error.message,
            });
        }
    }
}

module.exports = new RedisService();