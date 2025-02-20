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

    static getStaffByPage = async (page = 1, pageSize = 5) => {
        try {
            // Tính toán vị trí bắt đầu và số lượng sản phẩm cần lấy
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
    
            // Lấy danh sách sản phẩm với phân trang
            const staffs = await staffModel.find()
                .skip(skip)        // Bỏ qua các sản phẩm đã được truy vấn trước đó
                .limit(limit);     // Giới hạn số lượng sản phẩm mỗi trang
    
            // Lấy tổng số sản phẩm để tính số trang
            const totalStaff = await staffModel.countDocuments();
    
            // Tính toán số trang
            const totalPages = Math.ceil(totalStaff / pageSize);
    
            return {
                metadata:{
                    staffs,
                currentPage: page,
                totalPages,
                totalStaff,}
            };
        } catch (error) {
            throw error;
        }
    }

    static softDeleteStaff = async (id) => {
        try {
            const staff = await staffModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            if (!staff) {
                throw new Error("Nhân viên không tồn tại!");
            }
            return {
                message: "Nhân viên đã được xóa mềm",
                staff
            };
        } catch (error) {
            throw error;
        }
    };

    static async toggleStaffStatusActive(id) {
        try {
            // Tìm nhân viên theo ID
            const staff = await staffModel.findById(id);
            if (!staff) {
                throw new Error("Nhân viên không tồn tại!");
            }

            // Đảo ngược trạng thái StatusActive
            const newStatus = !staff.StatusActive;

            // Cập nhật lại giá trị trong DB
            const updatedStaff = await staffModel.findByIdAndUpdate(id, { StatusActive: newStatus }, { new: true });

            return updatedStaff; // Trả về thông tin sau khi cập nhật
        } catch (error) {
            throw error;
        }
    }
    

    
}

module.exports = StaffService ;