'use strict'
const ProductService = require("../services/product.service");
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
}
module.exports = new ProductController() ;
