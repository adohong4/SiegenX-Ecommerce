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

}

module.exports = new StaffController() ;