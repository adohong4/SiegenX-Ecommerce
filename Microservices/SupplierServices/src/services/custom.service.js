'use strict';

const supplierModel = require('../models/supplier.model');
const { BadRequestError, AuthFailureError, ConflictRequestError, NotFoundError, ForbiddenError } = require('../core/error.response');

class CustomService {
    static paginate = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const supplier = await supplierModel.find({ active: true })
                .select('supplierName email numberPhone status taxCode description lane area city addressOthers active')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalSupplier = await supplierModel.countDocuments({ active: true });
            const totalPages = Math.ceil(totalSupplier / limit);
            return {
                metadata: {
                    supplier,
                    currentPage: page,
                    totalPages,
                    totalSupplier,
                    limit
                }
            }
        } catch (error) {
            throw error;
        }
    }

    static paginateTrash = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const supplier = await supplierModel.find({ active: false })
                .select('supplierName email numberPhone status taxCode description lane area city addressOthers active')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalSupplier = await supplierModel.countDocuments({ active: false });
            const totalPages = Math.ceil(totalSupplier / limit);
            return {
                metadata: {
                    supplier,
                    currentPage: page,
                    totalPages,
                    totalSupplier,
                    limit
                }
            }
        } catch (error) {
            throw error;
        }
    }

    static searchByName = async (name) => {
        try {
            const supplier = await supplierModel.find({ supplierName: { $regex: name, $options: 'i' } })
                .select('supplierName email numberPhone status taxCode description lane area city addressOthers')
                .exec();
            return {
                metadata: supplier
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CustomService;