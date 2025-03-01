'use strict';

const productModel = require('../models/product.model');
const invoiceInputModel = require('../models/invoiceInput.model');
const supplierModel = require('../models/supplier.model')
const { BadRequestError, AuthFailureError } = require('../core/error.response');


class InvoiceInputService {
    static createInvoiceInput = async (req, res) => {
        try {
            const staffId = req.user;
            const staffName = req.staffName;
            const { statusPayment, statusInput, status, supplierId, productIds, partialPayment, valueInvoice } = req.body;

            // Lấy tổng số hóa đơn hiện có
            let countInvoices = await invoiceInputModel.countDocuments();
            let stt = String(countInvoices + 1).padStart(3, '0'); // Tạo số thứ tự dạng '001', '002', ...
            let invoiceId = `HDN${stt}`; // Tạo mã hóa đơn
            let invoiceIdExist = await invoiceInputModel.findOne({ invoiceId });
            while (invoiceIdExist) {
                countInvoices++;
                stt = String(countInvoices + 1).padStart(3, '0');
                invoiceId = `HDN${stt}`;
                invoiceIdExist = await invoiceInputModel.findOne({ invoiceId });
            }

            // Get info product from productIds
            const products = await Promise.all(
                productIds.map(async (productId) => {
                    return await productModel.findById(productId.productId);
                })
            );

            // Create array of product for invoice
            const newProductIds = products.map((product, index) => ({
                nameProduct: product.nameProduct,
                imageProduct: product.images[0],
                productId: product._id,
                count: productIds[index].count,
                priceInput: productIds[index].priceInput,
                tax: productIds[index].tax,
                value: productIds[index].count * productIds[index].priceInput
            }));

            // Create Supplier
            const supplier = await supplierModel.findById(supplierId.supplierId); // Thêm await
            const newSupplier = {
                nameSupplier: supplier.supplierName,
                supplierId: supplier._id,
                email: supplier.email,
                numberPhone: supplier.numberPhone,
            };

            const finalPartialPayment = statusPayment === 'completed' ? valueInvoice : (partialPayment || 0);

            const newInvoice = new invoiceInputModel({
                invoiceId,
                productIds: newProductIds,
                statusPayment,
                statusInput,
                status,
                partialPayment: finalPartialPayment,
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

            await supplierModel.findByIdAndUpdate(supplier._id, { $push: { orderData: invoiceInput._id } });

            return invoiceInput;
        } catch (error) {
            throw error;
        }
    }


    static updateInvoiceById = async (req, res) => {
        try {
            const staffId = req.user;
            const staffName = req.staffName;
            const { id } = req.params;
            const { statusPayment, status, partialPayment } = req.body;

            const invoice = await invoiceInputModel.findById(id);
            if (!invoice) {
                throw new BadRequestError('Invoice not found');
            }
            const updates = { statusPayment, status };

            if (invoice.status === 'completed' && invoice.statusInput === 'imported')
                throw new BadRequestError('Sản phẩm nhập kho, không thể đổi trạng thái đơn hàng');

            if (statusPayment === 'completed') {
                updates.partialPayment = invoice.valueInvoice;
            } else if (statusPayment === 'partial payment') {
                if (partialPayment > invoice.valueInvoice) {
                    throw new BadRequestError("Số tiền thanh toán không thể lớn hơn giá trị hóa đơn");
                } else if (partialPayment === invoice.partialPayment) {
                    updates.statusPayment = 'completed';
                } else {
                    updates.partialPayment = invoice.partialPayment + (partialPayment || 0);
                    if (updates.partialPayment >= invoice.valueInvoice) {
                        updates.statusPayment = 'completed';
                    } else if (updates.partialPayment === 0) {
                        updates.statusPayment = 'pending';
                    }
                }
            } else {
                updates.partialPayment = 0;
            }

            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            const updatedInvoice = await invoiceInputModel.findByIdAndUpdate(id, updates, { new: true });
            updatedInvoice.creator.push({
                createdBy: staffId,
                createdName: staffName,
                description: "Cập nhật hóa đơn nhập"
            });
            await updatedInvoice.save();
            return { metadata: updatedInvoice };
        } catch (error) {
            throw error;
        }
    }


    static getAllInvoice = async () => {
        try {
            const invoice = await invoiceInputModel.find()
                .select('invoiceId inputDate statusPayment statusInput supplierId valueInvoice creator.createdName creator.description status')
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

    static pushNumberOfProduct = async (req, res) => {
        try {
            const staffId = req.user;
            const staffName = req.staffName;
            const { id } = req.params;
            const invoice = await invoiceInputModel.findById(id)
                .select('productIds.productId productIds.count status statusInput creator')
                .exec();

            if (invoice.status !== 'completed') throw new BadRequestError('Đơn hàng nhập chưa hoàn tất')
            if (invoice.statusInput !== 'not imported') throw new BadRequestError('Đơn hàng đã nhập kho')

            const results = [];

            for (const product of invoice.productIds) {
                const productInDb = await productModel.findById(product.productId);
                if (productInDb) {
                    const previousQuantity = productInDb.quantity; // Số lượng trước đó
                    const count = product.count; // Số lượng nhập vào

                    // Cập nhật quantity
                    productInDb.quantity += count;
                    await productInDb.save();

                    results.push({
                        productId: product.productId,
                        previousQuantity: previousQuantity,
                        count: count,
                        newQuantity: productInDb.quantity,
                    });
                }
            }

            invoice.statusInput = 'imported';
            invoice.creator.push({
                createdBy: staffId,
                createdName: staffName,
                description: "Đẩy số lượng thành công"
            })
            await invoice.save();
            return {
                metadata: {
                    result: results,
                    invoice: invoice
                }
            }
        } catch (error) {
            throw error;
        }
    }

    static softDeleteRestoreInvoice = async (staffId, staffName, id) => {
        const invoice = await invoiceInputModel.findById(id)
        if (invoice.statusInput === 'imported')
            throw new BadRequestError('Đã nhập kho, không thể xóa');

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

    static deleteInvoice = async (req, res) => {
        try {
            const userRole = req.role;
            const { id } = req.params;
            if (userRole !== 'ADMIN') throw new AuthFailureError('Tài khoản bị giới hạn')
            await invoiceInputModel.findByIdAndDelete(id);
            return;
        } catch (error) {
            throw error;
        }
    }

    static paginateInvoice = async (req, res) => {
        try {
            const page = req.query.page;
            const limit = req.query.limit;
            const skip = (page - 1) * limit;

            const invoice = await invoiceInputModel.find({ active: true })
                .select('invoiceId inputDate statusPayment statusInput supplierId valueInvoice creator.createdName creator.description status active')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalInvoice = await invoiceInputModel.countDocuments({ active: true });
            const totalPages = Math.ceil(totalInvoice / limit);
            return {
                metadata: {
                    invoice,
                    currentPage: page,
                    totalPages,
                    totalInvoice,
                    limit
                }
            }
        } catch (error) {
            throw error
        }
    }

    static paginateInvoiceTrash = async (req, res) => {
        try {
            const page = req.query.page;
            const limit = req.query.limit;
            const skip = (page - 1) * limit;

            const invoice = await invoiceInputModel.find({ active: false })
                .select('invoiceId inputDate statusPayment statusInput supplierId valueInvoice creator.createdName creator.description status active')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalInvoice = await invoiceInputModel.countDocuments({ active: false });
            const totalPages = Math.ceil(totalInvoice / limit);
            return {
                metadata: {
                    invoice,
                    currentPage: page,
                    totalPages,
                    totalInvoice,
                    limit
                }
            }
        } catch (error) {
            throw error
        }
    }

    static searchByInvoiceId = async (req, res) => {
        const { invoiceId } = req.params;
        const invoices = await invoiceInputModel.find({ invoiceId: { $regex: invoiceId, $options: 'i' } });
        return {
            metadata: invoices
        }
    }
}

module.exports = InvoiceInputService;