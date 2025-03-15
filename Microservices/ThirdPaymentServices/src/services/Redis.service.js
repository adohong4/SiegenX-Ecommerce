'use strict'

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

    async updateCache(key, updateData, ttl = CACHE_TTL, createIfNotExists = true) {
        try {
            await this.ensureClient();
            const existingData = await this.getCache(key);

            if (existingData !== null) {
                const updatedData = { ...existingData, ...updateData };
                const serializedData = JSON.stringify(updatedData);
                await this.redisClient.setEx(key, ttl, serializedData);
                console.log(`Cache updated for key: ${key} with TTL: ${ttl}`);
                return updatedData;
            } else if (createIfNotExists) {
                // Nếu không tồn tại và createIfNotExists = true, lưu dữ liệu mới
                const serializedData = JSON.stringify(updateData);
                await this.redisClient.setEx(key, ttl, serializedData);
                console.log(`Cache created (from update) for key: ${key} with TTL: ${ttl}`);
                return updateData;
            } else {
                // Nếu không tồn tại và createIfNotExists = false, trả về null
                console.log(`Cache not found for key: ${key}, and createIfNotExists is false`);
                return null;
            }
        } catch (error) {
            console.error(`Error updating cache for key ${key}:`, error);
            throw new RedisErrorResponse({
                message: 'Lỗi khi cập nhật dữ liệu trong Redis',
                code: -105,
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