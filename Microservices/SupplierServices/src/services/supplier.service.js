'use strict';

const supplierModel = require('../models/supplier.model');
const { BadRequestError, AuthFailureError, ConflictRequestError, NotFoundError, ForbiddenError } = require('../core/error.response');
const SupplierRedisService = require('./redis.service')
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

            // Xóa cache sau khi tạo
            await SupplierRedisService.invalidateSupplierCache(supplierCreated._id.toString());

            return {
                metadata: supplierCreated
            }
        } catch (error) {
            throw error;
        }
    }

    static getSupplier = async () => {
        try {
            //use Redis
            const supplier = await SupplierRedisService.getSuppliers();
            return { metadata: supplier }
        } catch (error) {
            throw error;
        }
    }

    static getSupplierById = async (id) => {
        try {
            //use RedisService to get the Supplier list from cache
            const supplier = await SupplierRedisService.getSupplierById(id)
            if (!supplier) {
                throw new NotFoundError('Supplier not found');
            }
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
                _id: { $ne: id },
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

            // Cập nhật cache ngay sau khi cập nhật
            await SupplierRedisService.updateSupplierCache(updatedSupplier);

            return {
                metadata: updatedSupplier
            }
        } catch (error) {
            throw error;
        }
    }

    static activeSupplier = async (staffId, staffName, id) => {
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

            // Xóa cache sau khi thay đổi trạng thái
            await SupplierRedisService.invalidateSupplierCache(id);

            return {
                metadata: supplier
            }
        } catch (error) {
            throw error;
        }
    }

    static deleteSupplier = async (req, res) => {
        try {
            const userRole = req.role;
            const { id } = req.params;
            if (userRole !== 'ADMIN') throw new AuthFailureError('Tài khoản bị giới hạn');

            await supplierModel.findByIdAndDelete(id)
            // Xóa cache sau khi xóa
            await SupplierRedisService.invalidateSupplierCache(id);
            return;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SupplierService;