'use strict';

const OrderService = require('../../services/admin/order.service');
const { OK, CREATED } = require('../../core/success.response');

class OrderController {

    getOrders = async (req, res, next) => {
        try {
            const orders = await OrderService.getOrders();
            new OK({
                message: 'Lấy thông tin đơn hàng thành công',
                metadata: orders.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    updateStatusOrder = async (req, res, next) => {
        try {
            const order = await OrderService.updateStatusOrder(req, res);
            new CREATED({
                message: 'Cập nhật trạng thái đơn hàng thành công',
                metadata: order.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();
