'use strict';

const supplierModel = require('../models/supplier.model');
const { BadRequestError, AuthFailureError, ConflictRequestError, NotFoundError, ForbiddenError } = require('../core/error.response');

class CustomService {
    static paginate = async (page = 1, pageSize = 5) => {
        try {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;

            const supplier = await supplierModel.find()
                .select('supplierName email numberPhone status taxCode description lane area city addressOthers')
                .skip(skip)
                .limit(limit)
                .exec();
            const totalSupplier = await supplierModel.countDocuments();
            const totalPages = Math.ceil(totalSupplier / pageSize);
            return {
                metadata: {
                    supplier,
                    currentPage: page,
                    totalPages,
                    totalSupplier
                }
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CustomService;