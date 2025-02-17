'use strict';

const supplierModel = require('../models/supplier.model');

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
}

module.exports = SupplierService;