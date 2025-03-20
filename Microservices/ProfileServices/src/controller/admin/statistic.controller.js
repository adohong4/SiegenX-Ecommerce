'use strict';

const StatisticService = require('../../services/admin/statistic.service');
const { OK, CREATED } = require('../../core/success.response');

class StatisticController {
    productStatisticTable = async (req, res, next) => {
        try {
            const statistic = await StatisticService.productStatisticTable();
            new OK({
                message: 'Lấy thông tin thống kê',
                metadata: statistic.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StatisticController();