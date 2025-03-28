'use strict'
const InvoiceInputService = require("../services/invoiceInput.service");
const { CREATED, OK, SuccessResponse, NOCONTENT } = require('../core/success.response');

class InvoiceInputController {
    createInvoiceInput = async (req, res, next) => {
        try {
            const result = await InvoiceInputService.createInvoiceInput(req, res);
            new CREATED({
                message: 'Đã tạo hóa đơn nhập',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    updateInvoiceById = async (req, res, next) => {
        try {
            const result = await InvoiceInputService.updateInvoiceById(req, res);
            new CREATED({
                message: 'Cập nhật hóa đơn nhập',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getAllInvoice = async (req, res, next) => {
        try {
            const result = await InvoiceInputService.getAllInvoice(req, res);
            new OK({
                message: 'Danh sách hóa đơn nhập',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getInvoiceStatistic = async (req, res, next) => {
        try {
            const result = await InvoiceInputService.getInvoiceStatistic(req, res);
            new OK({
                message: 'Danh sách hóa đơn nhập',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getInvoiceById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await InvoiceInputService.getInvoiceById(id);
            new OK({
                message: 'Thông tin hóa đơn nhập',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    pushNumberOfProduct = async (req, res, next) => {
        try {
            const result = await InvoiceInputService.pushNumberOfProduct(req, res);
            new OK({
                message: 'Đẩy số lượng thành công',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    softDeleteRestoreInvoice = async (req, res, next) => {
        const staffId = req.user;
        const staffName = req.staffName;
        const { id } = req.params;
        const result = await InvoiceInputService.softDeleteRestoreInvoice(staffId, staffName, id)
        new CREATED({
            message: 'Chuyển đổi thành công',
            metadata: result.metadata
        }).send(res);
    }

    deleteInvoice = async (req, res, next) => {
        await InvoiceInputService.deleteInvoice(req, res)
        new OK({
            message: 'Xóa thành công',
        }).send(res);
    }

    paginateInvoice = async (req, res, next) => {
        const result = await InvoiceInputService.paginateInvoice(req, res)
        new OK({
            message: 'Phân trang thành công',
            metadata: result.metadata
        }).send(res);
    }

    paginateInvoiceTrash = async (req, res, next) => {
        const result = await InvoiceInputService.paginateInvoiceTrash(req, res)
        new OK({
            message: 'Phân trang thành công',
            metadata: result.metadata
        }).send(res);
    }

    searchByInvoiceId = async (req, res, next) => {
        const result = await InvoiceInputService.searchByInvoiceId(req, res)
        new OK({
            message: 'Tìm kiếm thành công',
            metadata: result.metadata
        }).send(res);
    }
}

module.exports = new InvoiceInputController();