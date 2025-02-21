'use strict';

const SupplierService = require('../services/supplier.service');
const { OK, CREATED } = require('../core/success.response');

class SupplierController {

    createSupplier = async (req, res, next) => {
        try {
            const staffId = req.user;
            const staffName = req.staffName;
            const { supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers } = req.body;

            const result = await SupplierService.createSupplier(
                staffId, staffName,
                supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers
            );

            new CREATED({
                message: "Supplier created successfully",
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getSupplier = async (req, res, next) => {
        try {
            const result = await SupplierService.getSupplier();
            new OK({
                message: "Get supplier successfully",
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getSupplierById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await SupplierService.getSupplierById(id);
            new OK({
                message: "Get supplier successfully",
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    updateSupplier = async (req, res, next) => {
        try {
            const staffId = req.user;
            const staffName = req.staffName;
            const { id } = req.params;
            const { supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers } = req.body;

            const result = await SupplierService.updateSupplier(
                staffId, staffName, id,
                supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers
            );

            new OK({
                message: "Supplier updated successfully",
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    deleteSupplier = async (req, res, next) => {
        try {
            const staffId = req.user;
            const staffName = req.staffName;
            const { id } = req.params;
            const result = await SupplierService.deleteSupplier(staffId, staffName, id);
            new OK({
                message: "Supplier deleted successfully",
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SupplierController();