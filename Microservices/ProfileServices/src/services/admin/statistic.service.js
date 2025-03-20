'use strict';

const orderModel = require('../../models/order.model');
const userModel = require('../../models/profile.model');
const { BadRequestError, AuthFailureError } = require("../../core/error.response");
const RedisService = require('../user/UserRedis.service');

class StatisticService {
    static productStatisticTable = async (req, res) => {
        try {
            const orders = await orderModel.find({ statusActive: true }).lean();

            const itemsMap = new Map();

            orders.forEach(order => {
                order.items.forEach(item => {
                    const itemId = item._id;

                    if (itemsMap.has(itemId)) {
                        const existingItem = itemsMap.get(itemId);
                        existingItem.quantity += item.quantity;
                    } else {
                        itemsMap.set(itemId, {
                            _id: item._id,
                            image: Array.isArray(item.images) ? item.images[0] : null,
                            title: item.title,
                            price: item.price,
                            quantity: item.quantity
                        });
                    }
                });
            });

            const itemsStats = Array.from(itemsMap.values()).sort((a, b) => b.quantity - a.quantity);;

            return {
                metadata: {
                    totalItems: itemsStats.length,
                    items: itemsStats
                }
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = StatisticService;