'use strict'
const express = require('express');

const StaffController = require('../../controllers/staff.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');

const { checkTokenCookie } = require('../../middleware/checkAuth');

const router = express.Router();
router.post('/staff/add', checkTokenCookie, asyncHandler(StaffController.createStaff));
router.get("/staff/getall", checkTokenCookie, asyncHandler(StaffController.getAllStaff))


router.post("/staff/update/:id", asyncHandler(StaffController.updateStaff))
router.get("/staff/getById/:id", asyncHandler(StaffController.getStaffById));
router.get("/staff/getStaffByPage", asyncHandler(StaffController.getStaffByPage));
router.delete("/staff/toggleStaffStatusActive/:id", checkTokenCookie, asyncHandler(StaffController.toggleStaffStatusActive));

router.post("/staff/login", asyncHandler(StaffController.Login));
router.get("/staff/getProfile", checkTokenCookie, asyncHandler(StaffController.getProfile));
router.post("/staff/logOut", checkTokenCookie, asyncHandler(StaffController.LogOutStaff));


module.exports = router;