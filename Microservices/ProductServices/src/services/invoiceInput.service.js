'use strict';

const productModel = require('../models/product.model');
const invoiceInputModel = require('../models/invoiceInput.model');
const supplierModel = require('../models/supplier.model')
const { BadRequestError } = require('../core/error.response');


class InvoiceInputService {
    static createInvoiceInput = async (req, res) => {
        try {
            const staffId = req.user;
            const staffName = req.staffName;
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

            //create Supplier
            const supplier = await supplierModel.findById(supplierId.supplierId); // Thêm await
            const newSupplier = {
                nameSupplier: supplier.supplierName,
                supplierId: supplier._id,
                email: supplier.email,
                numberPhone: supplier.numberPhone,
            };

            // Tính tổng giá trị hóa đơn
            const valueInvoice = newProductIds.reduce((total, product) => {
                return total + product.value + (product.tax || 0); // Cộng thuế nếu có
            }, 0);

            const newInvoice = new invoiceInputModel({
                productIds: newProductIds,
                statusPayment,
                statusInput,
                status,
                supplierId: newSupplier,
                inputDate: new Date(),
                valueInvoice: valueInvoice,
                creator: [{
                    createdBy: staffId,
                    createdName: staffName,
                    description: "Tạo mới hóa đơn nhập"
                }]
            });

            const invoiceInput = await newInvoice.save();

            //Đẩy id invoice vô orderData của supplierModel
            await supplierModel.findByIdAndUpdate(supplier._id, { $push: { orderData: invoiceInput._id } });

            return invoiceInput;
        } catch (error) {
            throw error;
        }
    }

    static getAllInvoice = async () => {
        try {
            const invoice = await invoiceInputModel.find()
                .select('inputDate statusPayment statusInput supplierId valueInvoice creator.createdName creator.description status')
                .sort({ createdAt: -1 })
                .exec()

            return invoice;
        } catch (error) {
            throw error;
        }
    }

    static getInvoiceById = async (id) => {
        try {
            const invoice = await invoiceInputModel.findById(id)
            return invoice;
        } catch (error) {
            throw error;
        }
    }

    static softDeleteRestoreInvoice = async (staffId, staffName, id) => {
        const invoice = await invoiceInputModel.findById(id)
        console.log("data:", invoice)
        const newActiveStatus = !invoice.active;
        const actionDescription = newActiveStatus ? "Hồi phục hóa đơn nhập" : "Xóa hóa đơn nhập";

        invoice.active = newActiveStatus;
        invoice.creator.push({
            createdBy: staffId,
            createdName: staffName,
            description: actionDescription
        })
        await invoice.save();
        return { metadata: invoice }
    }
}

module.exports = InvoiceInputService;