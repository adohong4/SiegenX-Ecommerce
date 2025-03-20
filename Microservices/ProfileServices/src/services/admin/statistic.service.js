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

    static productStatisticCategory = async (req, res) => {
        try {
            const orders = await orderModel.find({ statusActive: true }).lean();

            const categoryStats = new Map();

            orders.forEach(order => {
                order.items.forEach(item => {
                    const category = item.category || 'Không xác định';

                    if (categoryStats.has(category)) {
                        const existingCategory = categoryStats.get(category);
                        existingCategory.totalQuantity += item.quantity;
                        existingCategory.productCount += 1;
                    } else {
                        categoryStats.set(category, {
                            totalQuantity: item.quantity,
                            productCount: 1
                        });
                    }
                });
            });

            const stats = Array.from(categoryStats.entries()).map(([category, data]) => ({
                category,
                totalQuantity: data.totalQuantity,
                productCount: data.productCount
            }));

            // Tính tổng số và tổng số danh mục
            const totalCategories = stats.length;

            return {
                metadata: {
                    totalCategories,
                    categories: stats
                }
            };
        } catch (error) {
            throw error;
        }
    }

    static getRevenueStats = async (req) => {
        try {
            const { time } = req.body;
            if (!time || !['week', 'month', 'year'].includes(time)) {
                throw new BadRequestError('Invalid time parameter. Must be "week", "month", or "year".');
            }

            const orders = await orderModel.find({ statusActive: true }).lean();
            const now = new Date();

            if (time === 'week') {
                // Tạo danh sách 7 ngày gần nhất
                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(now.getDate() - 6);
                const dayStats = new Map();

                // Khởi tạo tất cả 7 ngày với giá trị 0
                for (let d = new Date(sevenDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
                    const dayKey = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    dayStats.set(dayKey, { totalRevenue: 0, orderCount: 0 });
                }

                orders.forEach(order => {
                    const orderDate = new Date(order.date.split(' ')[1].split('/').reverse().join('-') + ' ' + order.date.split(' ')[0]);
                    if (orderDate >= sevenDaysAgo && orderDate <= now) {
                        const dayKey = orderDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        const stat = dayStats.get(dayKey);
                        stat.totalRevenue += order.amount;
                        stat.orderCount += 1;
                    }
                });

                const stats = Array.from(dayStats.entries()).map(([day, data]) => ({
                    day,
                    totalRevenue: data.totalRevenue,
                    orderCount: data.orderCount,
                }));

                const totalRevenue = stats.reduce((sum, stat) => sum + stat.totalRevenue, 0);

                return {
                    metadata: {
                        time: 'week',
                        totalRevenue,
                        days: stats,
                    },
                };
            } else if (time === 'month') {
                // Tạo danh sách 12 tháng gần nhất
                const twelveMonthsAgo = new Date(now);
                twelveMonthsAgo.setMonth(now.getMonth() - 11);
                const monthStats = new Map();

                // Khởi tạo tất cả 12 tháng với giá trị 0
                for (let m = new Date(twelveMonthsAgo); m <= now; m.setMonth(m.getMonth() + 1)) {
                    const monthKey = m.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
                    monthStats.set(monthKey, { totalRevenue: 0, orderCount: 0 });
                }

                orders.forEach(order => {
                    const orderDate = new Date(order.date.split(' ')[1].split('/').reverse().join('-') + ' ' + order.date.split(' ')[0]);
                    if (orderDate >= twelveMonthsAgo && orderDate <= now) {
                        const monthKey = orderDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
                        const stat = monthStats.get(monthKey);
                        stat.totalRevenue += order.amount;
                        stat.orderCount += 1;
                    }
                });

                const stats = Array.from(monthStats.entries()).map(([month, data]) => ({
                    month,
                    totalRevenue: data.totalRevenue,
                    orderCount: data.orderCount,
                }));

                const totalRevenue = stats.reduce((sum, stat) => sum + stat.totalRevenue, 0);

                return {
                    metadata: {
                        time: 'month',
                        totalRevenue,
                        months: stats,
                    },
                };
            } else if (time === 'year') {
                // Tạo danh sách 3 năm gần nhất
                const threeYearsAgo = new Date(now);
                threeYearsAgo.setFullYear(now.getFullYear() - 2);
                const yearStats = new Map();

                // Khởi tạo tất cả 3 năm với giá trị 0
                for (let y = new Date(threeYearsAgo); y <= now; y.setFullYear(y.getFullYear() + 1)) {
                    const yearKey = y.getFullYear().toString();
                    yearStats.set(yearKey, { totalRevenue: 0, orderCount: 0 });
                }

                orders.forEach(order => {
                    const orderDate = new Date(order.date.split(' ')[1].split('/').reverse().join('-') + ' ' + order.date.split(' ')[0]);
                    if (orderDate >= threeYearsAgo && orderDate <= now) {
                        const yearKey = orderDate.getFullYear().toString();
                        const stat = yearStats.get(yearKey);
                        stat.totalRevenue += order.amount;
                        stat.orderCount += 1;
                    }
                });

                const stats = Array.from(yearStats.entries()).map(([year, data]) => ({
                    year,
                    totalRevenue: data.totalRevenue,
                    orderCount: data.orderCount,
                }));

                const totalRevenue = stats.reduce((sum, stat) => sum + stat.totalRevenue, 0);

                return {
                    metadata: {
                        time: 'year',
                        totalRevenue,
                        years: stats,
                    },
                };
            }
        } catch (error) {
            throw new BadRequestError('Error getting revenue stats: ' + error.message);
        }
    };
}

module.exports = StatisticService;