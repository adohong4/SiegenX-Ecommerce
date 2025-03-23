'use strict';

const OrderService = require('../../services/user/order.service');
const { OK, CREATED } = require('../../core/success.response');

class OrderController {

    userOrders = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const orders = await OrderService.userOrders(userId);
            new OK({
                message: 'Lấy thông tin đơn hàng thành công',
                metadata: orders.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();


