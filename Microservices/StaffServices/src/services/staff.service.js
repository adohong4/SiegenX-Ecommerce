'use strict';

const staffModel = require('../models/staff.model');
const { BadRequestError } = require('../core/error.response');

class StaffService {
    static createStaff = async (req, res, next) => {
        try {
            
            const newStaff = new staffModel({
                Username: req.body.Username,
                StaffName: req.body.StaffName,
                Email: req.body.Email,
                Password: req.body.Password,
                Numberphone: req.body.Numberphone,
                Tax: req.body.Tax,
                Role: req.body.Role,
                StatusActive: req.body.StatusActive,

                
            });

            const staff = await newStaff.save();

            return {
                staff
            }
        } catch (error) {
            throw error
        }
    }
    
    static getstaff = async () => {
        try {
            const staff = await staffModel.find({});
            return {
                staff
            }
        } catch (error) {
            throw error
        }
    }

    static updateStaffs = async (req, res, next) => {
        try {
            const staffId = req.params.id;
            const staff = await staffModel.findById(staffId);

            if (!staff) {
                throw new BadRequestError('nhan vien không tồn tại');
            }

            // Cập nhật thông tin nhan vien
            const updates = {
                Username: req.body.Username,
                StaffName: req.body.StaffName,
                Email: req.body.Email,
                Password: req.body.Password,
                Numberphone: req.body.Numberphone,
                Tax: req.body.Tax,
                Role: req.body.Role,
                StatusActive: req.body.StatusActive,

            };

            const updatedStaff = await staffModel.findByIdAndUpdate(staffId, updates, { new: true });

            return {
                staff: updatedStaff
            }
        } catch (error) {
            throw error;
        }
    };

    static getStaffById = async (id) => {
        try {
            const staff = await staffModel.findById(id);
            return {
                staff,
            }
        } catch (error) {
            throw error;
        }
    }

    
}

module.exports = StaffService ;