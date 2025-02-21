'use strict';

const supplierModel = require('../models/supplier.model');
const { BadRequestError, AuthFailureError, ConflictRequestError, NotFoundError, ForbiddenError } = require('../core/error.response');
const validator = require('validator')

class SupplierService {

    static createSupplier = async (staffId, staffName, supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers) => {
        try {
            if (!validator.isEmail(email))
                throw new BadRequestError('Không đúng định dạng email');

            const existingSupplier = await supplierModel.findOne({
                $or: [{ email }, { taxCode }]
            });

            if (existingSupplier) {
                if (existingSupplier.email === email) {
                    throw new BadRequestError('Email đã được đăng ký, vui lòng chọn email khác');
                }
                if (existingSupplier.taxCode === taxCode) {
                    throw new BadRequestError('Mã số thuế đã bị trùng');
                }
            }

            const supplier = new supplierModel({
                supplierName, email, numberPhone, status, taxCode, description,
                lane, area, city, addressOthers,

                creator: {
                    createdBy: staffId,
                    createdName: staffName,
                    description: "Tạo mới nhà cung cấp"
                }
            })
            const supplierCreated = await supplier.save();

            return {
                metadata: supplierCreated
            }
        } catch (error) {
            throw error;
        }
    }

    static getSupplier = async () => {
        try {
            const supplier = await supplierModel.find({})
                .select('supplierName email numberPhone status taxCode description lane area city addressOthers');
            return { metadata: supplier }
        } catch (error) {
            throw error;
        }
    }

    static getSupplierById = async (id) => {
        try {
            const supplier = await supplierModel.findById(id);
            return { metadata: supplier }
        } catch (error) {
            throw error;
        }
    }

    static updateSupplier = async (
        staffId, staffName, id, supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers
    ) => {
        try {
            if (!validator.isEmail(email))
                throw new BadRequestError('Không đúng định dạng email');

            const existingSupplier = await supplierModel.findOne({
                $or: [{ email }, { taxCode }]
            });

            if (existingSupplier) {
                if (existingSupplier.email === email) {
                    throw new BadRequestError('Email đã được đăng ký, vui lòng chọn email khác');
                }
                if (existingSupplier.taxCode === taxCode) {
                    throw new BadRequestError('Mã số thuế đã bị trùng');
                }
            }

            const updatedSupplier = await supplierModel.findByIdAndUpdate(id, {
                supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers,
            }, { new: true });

            updatedSupplier.creator.push({
                createdBy: staffId,
                createdName: staffName,
                description: "Cập nhật nhà cung cấp"
            });
            await updatedSupplier.save();

            return {
                metadata: updatedSupplier
            }
        } catch (error) {
            throw error;
        }
    }

    static deleteSupplier = async (staffId, staffName, id) => {
        try {
            const supplier = await supplierModel.findById(id);
            if (!supplier) {
                throw new NotFoundError("Supplier not found");
            }

            const newActiveStatus = !supplier.active;
            const actionDescription = newActiveStatus ? "Hồi phục nhà cung cấp" : "Xóa nhà cung cấp";

            supplier.active = newActiveStatus;
            supplier.creator.push({
                createdBy: staffId,
                createdName: staffName,
                description: actionDescription
            });

            await supplier.save();

            return {
                metadata: supplier
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SupplierService;