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

    getOrderById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const orders = await OrderService.getOderById(id);
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

    deleteOrder = async (req, res, next) => {
        try {
            const order = await OrderService.deleteOrder(req, res);
            new CREATED({
                message: 'Xóa đơn hàng thành công',
                metadata: order.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    toggleOrderStatus = async (req, res, next) => {
        try {
            const order = await OrderService.toggleOrderStatus(req, res);
            new CREATED({
                message: 'Xóa đơn hàng thành công',
                metadata: order.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    paginateOder = async (req, res, next) => {
        try {
            const result = await OrderService.paginateOrder(req, res);
            new OK({
                message: 'phân trang thành công',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    paginateOderTrash = async (req, res, next) => {
        try {
            const result = await OrderService.paginateOrderTrash(req, res);
            new OK({
                message: 'phân trang thành công',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }


    searchById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await OrderService.searchById(id);
            new OK({
                message: 'Tìm kiếm thành công',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();
