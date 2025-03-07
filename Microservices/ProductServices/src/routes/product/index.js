'use strict'
const express = require('express');

const multer = require("multer");
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { checkTokenCookie } = require('../../middleware/checkAuth')


const router = express.Router();

//image Storage Engine
const storage = multer.diskStorage({
    destination: "upload",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

//admin
router.post("/product/add", upload.array("images"), checkTokenCookie, asyncHandler(ProductController.createProduct));

router.get("/product/getAll", asyncHandler(ProductController.getAllProduct));
router.get("/product/getById/:id", asyncHandler(ProductController.getProductById));
router.get("/product/getBySlug/:product_slug", asyncHandler(ProductController.getProductByslug));

router.post("/product/updateProduct/:id", checkTokenCookie, asyncHandler(ProductController.updateProduct));

router.delete("/product/deleteProduct/:id", checkTokenCookie, asyncHandler(ProductController.deleteProduct)); //xóa cứng
router.delete("/product/delete/:id", checkTokenCookie, asyncHandler(ProductController.softRestoreProduct)); //xóa mềm

router.get("/product/getProductByName/:nameProduct", asyncHandler(ProductController.getProductByName));
router.get("/product/getCountProduct", asyncHandler(ProductController.getCountProduct));

router.get("/product/paginate", asyncHandler(ProductController.getProductsByPage));
router.get("/product/trash/paginate", asyncHandler(ProductController.paginateProductTrash)); //trash

router.post("/product/recommend", asyncHandler(ProductController.ContentBasedFiltering))



module.exports = router;