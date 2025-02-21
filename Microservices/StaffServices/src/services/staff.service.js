'use strict';

const staffModel = require('../models/staff.model');
const { BadRequestError } = require('../core/error.response');
const bcrypt = require('bcrypt')
const validator = require('validator')
const { createToken } = require("../middleware/authUtils")


class StaffService {
    static createStaff = async (req, res, next) => {
        try {
            const staffId = req.user;
            //console.log('Id: ',staffId)
            const staffRole = req.role;
            if(staffRole != 'ADMIN'){
                throw new BadRequestError('Bạn không có quyền truy cập');
            }
            const { Email, Password, Username, Tax, StaffName, Numberphone } = req.body;
    
            if (!validator.isEmail(Email)) {
                throw new BadRequestError('Không đúng định dạng email');
            }
    
            if (Password.length < 8) {
                throw new BadRequestError('Mật khẩu quá yếu, cần ít nhất 8 ký tự')
            }
    
            const existingStaff = await staffModel.findOne({ 
                $or: [{ Email }, { Username }, { Tax }]
            });
    
            if (existingStaff) {
                if (existingStaff.Email === Email) {
                    throw new BadRequestError('Email đã được đăng ký, vui lòng chọn email khác');
                }
                if (existingStaff.Username === Username) {
                    throw new BadRequestError('Tên đăng nhập đã được tạo');
                }
                if (existingStaff.Tax === Tax) {
                    throw new BadRequestError('Mã số thuế đã bị trùng');
                }
            }
    
            const hashedPassword = await bcrypt.hash(Password, 10);
    
            const newStaff = new staffModel({
                Username,
                StaffName,
                Email,
                Password,
                HashedPassword: hashedPassword, 
                Numberphone,
                Tax,

                creator: {
                    createdBy: staffId,
                    description: "Created new campaign"
                }
            });
    
            const staff = await newStaff.save();
    
            return { staff };
        } catch (error) {
            next(error); 
        }
    };
    
    
    static getstaff = async (req,res) => {
        try {
            // const staffId = req.user;
            // console.log('Id: ',staffId)

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

    

    static async toggleStaffStatusActive(id, staffId, staffRole) {
        try {
            console.log(staffRole);
            if(staffRole != 'ADMIN'){
                throw new BadRequestError('Bạn không có quyền truy cập');
            }
            // Tìm nhân viên theo ID
            const staff = await staffModel.findById(id);
            if (!staff) {
                throw new Error("Nhân viên không tồn tại!");
            }

            // Đảo ngược trạng thái StatusActive
            const newStatus = !staff.StatusActive;
            const actionDes = newStatus? "restored staff" : "deleted Staff" ;
            // Cập nhật lại giá trị trong DB
            staff.StatusActive = newStatus ;
            staff.creator.push({
                createdBy: staffId,
                    description: actionDes
            })
            await staff.save();
            return staff; // Trả về thông tin sau khi cập nhật
        } catch (error) {
            throw error;
        }
    }
    
    static LoginStaff = async (req , res) => {
        try {
            const { Email, Password  } = req.body;
            const staff = await staffModel.findOne({ Email });

            if (!staff) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            const isMath = await bcrypt.compare(Password, staff.HashedPassword);

            if (!isMath) {
                throw new BadRequestError("Mật khẩu không chính xác");
            }

            const { _id: staffId } = staff;
            const role = staff.Role;
            const token = createToken({ staffId, Email, role }, req.res); 

            return {
                staff: {
                    id: staff._id,
                    email: staff.Email,
                    role: staff.Role,
                },
                token,
            };
        } catch (error) {
            throw error;
        }
    }

    static getProfile = async (req , res) => {
        try {
            const staffId = req.user ;  
            console.log("staffId: ", staffId);

        if (!staffId) {
            throw new BadRequestError("Thiếu thông tin tài khoản");
        }
            const profile = await staffModel.findById(staffId);
            console.log("profile: ", profile);

            if (!profile) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            return profile;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = StaffService ;