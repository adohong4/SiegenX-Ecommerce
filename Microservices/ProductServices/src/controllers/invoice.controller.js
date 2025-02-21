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
}

module.exports = new InvoiceInputController();