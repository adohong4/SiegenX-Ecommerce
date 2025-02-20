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

    getAllInvoiceById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await InvoiceInputService.getAllInvoiceById(id);
            new OK({
                message: 'Thông tin hóa đơn nhập',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new InvoiceInputController();