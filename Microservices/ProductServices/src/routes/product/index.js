'use strict'
const express = require('express');

const multer = require("multer");
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


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
router.post("/product/add", upload.array("images"), asyncHandler(ProductController.createProduct));
router.get("/product/getAll", asyncHandler(ProductController.getAllProduct));



module.exports = router;