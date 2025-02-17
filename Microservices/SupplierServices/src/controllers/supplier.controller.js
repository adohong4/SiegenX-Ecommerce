'use strict';

const SupplierService = require('../services/supplier.service');
const { OK, CREATED } = require('../core/success.response');

class SupplierController {

    createSupplier = async (req, res, next) => {
        try {
            const userId = req.user;
            const { supplierName, email, numberPhone, status, taxCode, description, lane, area, city, addressOthers } = req.body;

            const result = await SupplierService.createSupplier(
                userId,
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
}

module.exports = new SupplierController();