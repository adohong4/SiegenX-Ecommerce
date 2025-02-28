'use strict'
const express = require('express');

const StaffController = require('../../controllers/staff.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');

const { checkTokenCookie } = require('../../middleware/checkAuth');

const router = express.Router();
router.post('/staff/add', checkTokenCookie, asyncHandler(StaffController.createStaff));
router.get("/staff/getall", checkTokenCookie, asyncHandler(StaffController.getAllStaff))

router.post("/staff/update/:id", checkTokenCookie, asyncHandler(StaffController.updateStaff))
router.get("/staff/getById/:id", asyncHandler(StaffController.getStaffById));

router.get("/staff/paginate", asyncHandler(StaffController.getStaffByPage));
router.get("/staff/trash/paginate", asyncHandler(StaffController.paginateStaffTrash));

router.delete("/staff/toggleStaffStatusActive/:id", checkTokenCookie, asyncHandler(StaffController.toggleStaffStatusActive));
router.delete("/staff/delete/:id", checkTokenCookie, asyncHandler(StaffController.deleteStaff));

router.post("/staff/login", asyncHandler(StaffController.Login));
router.get("/staff/getProfile", checkTokenCookie, asyncHandler(StaffController.getProfile));
router.post("/staff/logOut", checkTokenCookie, asyncHandler(StaffController.LogOutStaff));
router.put("/staff/updateProfile", checkTokenCookie, asyncHandler(StaffController.updateStaffProfile));

module.exports = router;