 'use strict'
const express = require('express');

const StaffController = require('../../controllers/staff.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const router = express.Router();

router.post('/staff/add', asyncHandler(StaffController.createStaff));
router.get("/staff/getall", asyncHandler(StaffController.getAllStaff))
router.post("/staff/update/:id", asyncHandler(StaffController.updateStaff))



module.exports = router;