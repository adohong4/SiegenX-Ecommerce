'use strict';

const productModel = require('../models/product.model');
const invoiceInputModel = require('../models/invoiceInput.model');
const fs = require('fs')
const path = require('path');
const { BadRequestError } = require('../core/error.response');


class InvoiceInputService {
    static createInvoiceInput = async (req, res) => {
        try {
            const staffId = req.user;
            const { statusPayment, statusInput, status, supplierId, productIds } = req.body;

            // get info product from productIds
            const products = await Promise.all(
                productIds.map(async (productId) => {
                    return await productModel.findById(productId.productId);
                })
            );

            // create array of product for invoice
            const newProductIds = products.map((product, index) => ({
                nameProduct: product.nameProduct,
                imageProduct: product.images[0],
                productId: product._id,
                count: productIds[index].count,
                priceInput: productIds[index].priceInput,
                tax: productIds[index].tax,
                value: productIds[index].count * productIds[index].priceInput
            }));

            // Tính tổng giá trị hóa đơn
            const valueInvoice = newProductIds.reduce((total, product) => {
                return total + product.value + (product.tax || 0); // Cộng thuế nếu có
            }, 0);

            const newInvoice = new invoiceInputModel({
                productIds: newProductIds,
                statusPayment,
                statusInput,
                status,
                supplierId,
                inputDate: new Date(),
                valueInvoice: valueInvoice,
                creator: [{
                    createdBy: staffId,
                    description: "Tạo mới hóa đơn nhập"
                }]
            });

            const invoiceInput = await newInvoice.save();
            return invoiceInput;
        } catch (error) {
            throw error;
        }
    }

    static getAllInvoice = async () => {
        try {
            const invoice = await invoiceInputModel.find()
                .select('inputDate statusPayment statusInput supplierId valueInvoice creator.createdBy status')
                .sort({ createdAt: -1 })
                .exec()

            return invoice;
        } catch (error) {
            throw error;
        }
    }

    static getAllInvoiceById = async (id) => {
        try {
            const invoice = await invoiceInputModel.findById(id)
            return invoice;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = InvoiceInputService;