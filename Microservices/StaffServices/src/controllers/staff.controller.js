'use strict'
const StaffService = require("../services/staff.service");
const { CREATED, OK, SuccessResponse, NOCONTENT } = require('../core/success.response');
const { rest } = require("lodash");

class StaffController {

    createStaff = async (req, res, next) => {
        try {
            const result = await StaffService.createStaff(req, res, next);
            if (result) {
                new CREATED({
                    message: 'Đa them nhan vien moi ',
                    metadata: result.staff
                }).send(res);
            }
        } catch (error) {
            next(error);
        }
    }

    getAllStaff = async (req, res, next) => {
        try {
            const result = await StaffService.getstaff(req, res);
            if (result) {
                new OK({
                    message: 'get staff OK',
                    metadata: result.staff
                }).send(res);
            }
        } catch (error) {
            next(error);
        }
    }

    updateStaff = async (req, res, next) => {
        try {
            const result = await StaffService.updateStaffs(req, res, next);

            new CREATED({
                message: 'Cập nhật thành công!',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }


    getStaffById = async (req, res, next) => {
        try {
            const result = await StaffService.getStaffById(req.params.id);

            new OK({
                message: 'get staff By Id OK',
                metadata: result.staff
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getStaffByPage = async (req, res, next) => {
        try {
            const result = await StaffService.getStaffByPage(req, res);

            new OK({
                message: 'get Staff By Page OK',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    paginateStaffTrash = async (req, res, next) => {
        try {
            const result = await StaffService.paginateStaffTrash(req, res);

            new OK({
                message: 'get Staff By Page OK',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    toggleStaffStatusActive = async (req, res, next) => {
        try {
            const staffId = req.user;
            const staffRole = req.role;
            const staffName = req.staffName;
            const { id } = req.params; // Lấy ID từ URL
            const result = await StaffService.toggleStaffStatusActive(id, staffId, staffRole, staffName);

            new OK({
                message: `Trạng thái nhân viên đã được cập nhật thành ${result.StatusActive}`,
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    deleteStaff = async (req, res, next) => {
        try {
            const result = await StaffService.deleteStaff(req, res);
            new OK({
                message: 'Xóa thành công',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    Login = async (req, res, next) => {
        try {
            const result = await StaffService.LoginStaff(req, res);
            new OK({
                message: 'Đăng nhập thành công',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getProfile = async (req, res, next) => {
        try {
            const profile = await StaffService.getProfile(req, res);
            new OK({
                message: 'Lấy thông tin profile thành công',
                metadata: profile
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    LogOutStaff = async (req, res, next) => {
        try {
            const result = await StaffService.LogOutStaff(req, res);
            new OK({
                message: "Đăng xuất thành công",
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    updateStaffProfile = async (req, res, next) => {
        try {
            const result = await StaffService.updateStaffProfile(req, res);
            new OK({
                message: "Cập nhật tài khoản thành công",
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StaffController();