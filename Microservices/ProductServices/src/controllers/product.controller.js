'use strict'
const ProductService = require("../services/product.service");
const ProductCustom = require("../services/Product.custom");
const { CREATED, OK, SuccessResponse, NOCONTENT } = require('../core/success.response');

class ProductController {

    createProduct = async (req, res, next) => {
        try {
            const result = await ProductService.createProduct(req, res, next);
            if (result) {
                new CREATED({
                    message: 'Đã thêm sản phẩm mới',
                    metadata: result.product
                }).send(res);
            }
        } catch (error) {
            next(error);
        }
    }


    getAllProduct = async (req, res, next) => {
        try {
            const result = await ProductService.getProduct(req.body);
            if (result) {
                new OK({
                    message: 'get Product OK',
                    metadata: result.product
                }).send(res);
            }
        } catch (error) {
            next(error);
        }
    }

    getProductById = async (req, res, next) => {
        try {
            const result = await ProductService.getProductById(req.params.id);

            new OK({
                message: 'get Product By Id OK',
                metadata: result.product
            }).send(res);
        } catch (error) {
            next(error);
        }
    }


    getProductByslug = async (req, res, next) => {
        try {
            const result = await ProductService.getProductByslug(req.params.product_slug);

            new OK({
                message: 'get Product By slug OK',
                metadata: result.product
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    updateProduct = async (req, res, next) => {
        try {
            const result = await ProductService.updateProduct(req, res, next);

            new CREATED({
                message: 'Cập nhật thành công!',
                metadata: result.product
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    deleteProduct = async (req, res, next) => {
        try {
            const result = await ProductService.deleteProduct(req, res);

            new OK({
                message: 'Xóa thành công',
                metadata: result.product
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    softRestoreProduct = async (req, res, next) => {
        const staffId = req.user;
        const staffName = req.staffName;
        const { id } = req.params;
        const result = await ProductService.softRestoreProduct(staffId, staffName, id);
        new CREATED({
            message: 'Xóa thành công',
            metadata: result.product
        }).send(res);
    }

    getProductByName = async (req, res, next) => {
        try {
            const result = await ProductService.getProductByName(req, res);
            new OK({
                message: 'get Product By title OK',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getCountProduct = async (req, res, next) => {
        try {
            const result = await ProductService.getCountProduct();

            new OK({
                message: 'get CountProduct  OK',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getProductsByPage = async (req, res, next) => {
        try {
            const result = await ProductService.getProductsByPage(req, res);

            new OK({
                message: 'get Product By Page OK',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    paginateProductTrash = async (req, res, next) => {
        try {
            const result = await ProductService.paginateProductTrash(req, res);

            new OK({
                message: 'get Product Trash',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    ContentBasedFiltering = async (req, res, next) => {
        try {
            const result = await ProductCustom.ContentBasedFiltering(req, res);
            new OK({
                message: 'filter Product',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new ProductController();
