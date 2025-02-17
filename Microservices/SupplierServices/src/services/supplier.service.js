'use strict';

const supplierModel = require('../models/supplier.model');
const { BadRequestError, AuthFailureError, ConflictRequestError, NotFoundError, ForbiddenError } = require('../core/error.response');

class SupplierService {

    static createSupplier = async (userId, supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers) => {
        try {
            const supplier = new supplierModel({
                supplierName,
                email,
                numberPhone,
                status,
                taxCode,
                description,
                lane,
                area,
                city,
                addressOthers,
                creator: {
                    createdBy: userId,
                    description: "Created new supplier"
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
        userId, id, supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers
    ) => {
        try {
            if (!id) {
                throw new BadRequestError("Supplier ID is required");
            }

            const updatedSupplier = await supplierModel.findByIdAndUpdate(id, {
                supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers,
            }, { new: true });

            updatedSupplier.creator.push({
                createdBy: userId,
                description: "Updated supplier"
            });

            await updatedSupplier.save();

            return {
                metadata: updatedSupplier
            }
        } catch (error) {
            throw error;
        }
    }

    static deleteSupplier = async (userId, id) => {
        try {
            if (!id) {
                throw new BadRequestError("Supplier ID is required");
            }

            const supplier = await supplierModel.findById(id);
            if (!supplier) {
                throw new NotFoundError("Supplier not found");
            }

            const newActiveStatus = !supplier.active;
            const actionDescription = newActiveStatus ? "Restored supplier" : "Deleted supplier";

            supplier.active = newActiveStatus;
            supplier.creator.push({
                createdBy: userId,
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