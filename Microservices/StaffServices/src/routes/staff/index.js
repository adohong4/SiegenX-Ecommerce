 'use strict'
const express = require('express');

const StaffController = require('../../controllers/staff.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const router = express.Router();

router.post('/staff/add', asyncHandler(StaffController.createStaff));
router.get("/staff/getall", asyncHandler(StaffController.getAllStaff))



module.exports = router;