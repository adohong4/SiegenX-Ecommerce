 'use strict'
const StaffService = require("../services/staff.service");
const { CREATED, OK, SuccessResponse, NOCONTENT } = require('../core/success.response');

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
            const result = await StaffService.getstaff();
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
                metadata: result.staff
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
            const result = await StaffService.getStaffByPage();

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
            const { id } = req.params; // Lấy ID từ URL
            const result = await StaffService.toggleStaffStatusActive(id);

            new OK({
                message: `Trạng thái nhân viên đã được cập nhật thành ${result.StatusActive}`,
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

}

module.exports = new StaffController() ;