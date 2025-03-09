'use strict';

const staffModel = require('../models/staff.model');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const bcrypt = require('bcrypt')
const validator = require('validator')
const { createToken } = require("../middleware/authUtils")


class StaffService {
    static createStaff = async (req, res, next) => {
        try {
            const staffId = req.user;
            const userName = req.staffName;
            //console.log('Id: ',staffId)
            const staffRole = req.role;
            if (staffRole !== 'ADMIN') {
                throw new BadRequestError('Tài khoản bị giới hạn');
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
                    createdName: userName,
                    description: "Tạo mới"
                }
            });

            const staff = await newStaff.save();

            return { staff };
        } catch (error) {
            next(error);
        }
    };


    static getstaff = async (req, res) => {
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
            const userName = req.staffName;
            const userId = req.user;
            const userRole = req.role;
            const { StaffName, Username, Password, HashedPassword, Numberphone, Tax, Role } = req.body
            const updates = { StaffName, Username, Password, Numberphone, Tax, HashedPassword, Role }
            const staff = await staffModel.findById(staffId);
            if (userRole !== 'ADMIN') throw new AuthFailureError("Tài khoản bị giới hạn")
            if (Password) {
                if (Password.length < 8) {
                    throw new BadRequestError("Mật khẩu phải dài ít nhất 8 ký tự");
                }
                const salt = await bcrypt.genSalt(10);
                updates.HashedPassword = await bcrypt.hash(Password, salt);
            }
            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            const updatedStaff = await staffModel.findByIdAndUpdate(staffId, updates, { new: true });
            staff.creator.push({
                createdBy: userId,
                createdName: userName,
                description: "Cập nhật tài khoản"
            })
            await staff.save();
            return { metadata: updatedStaff };
        } catch (error) {
            throw error;
        }
    };

    static updateStaffProfile = async (req, res) => {
        try {
            const { StaffName, Username, Password, Numberphone, Tax, HashedPassword } = req.body;
            const staffId = req.user;

            const updates = { StaffName, Username, Password, Numberphone, Tax, HashedPassword }

            if (Password) {
                if (Password.length < 8) {
                    throw new BadRequestError("Mật khẩu phải dài ít nhất 8 ký tự");
                }
                const salt = await bcrypt.genSalt(10);
                updates.HashedPassword = await bcrypt.hash(Password, salt);
            }

            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            const updatedStaff = await staffModel.findByIdAndUpdate(staffId, updates, { new: true });

            if (!updatedStaff) throw new BadRequestError("Cập nhật không thành công");

            return { metadata: updatedStaff };
        } catch (error) {
            throw new Error(error);
        }
    }

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

    static getStaffByPage = async (req, res) => {
        try {
            const userRole = req.role;
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const skip = (page - 1) * limit;
            const searchQuery = req.query.search || '';
            if (userRole !== 'ADMIN') throw new AuthFailureError('Tài khoản bị giới hạn')

            const searchFilter = searchQuery
                ? {
                    $or: [
                        { Username: { $regex: searchQuery, $options: 'i' } },
                        { Email: { $regex: searchQuery, $options: 'i' } },
                    ],
                } : {};

            // Xử lý sắp xếp
            const sortField = req.query.sort || 'createdAt';
            const sortOrder = req.query.order === 'asc' ? 1 : -1;
            const sortOptions = { [sortField]: sortOrder };

            const staffs = await staffModel.find({ StatusActive: true, ...searchFilter })
                .select('StaffName Username Email Numberphone Tax Role StatusActive createdAt StatusActive creator')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec();

            const totalStaff = await staffModel.countDocuments({ StatusActive: true, ...searchFilter });
            const totalPages = Math.ceil(totalStaff / limit);
            return {
                metadata: {
                    staffs,
                    currentPage: page,
                    totalPages,
                    totalStaff,
                    limit,
                    search: searchQuery,
                    sort: sortField,
                    order: req.query.order || 'desc',
                }
            };
        } catch (error) {
            throw error;
        }
    }

    static paginateStaffTrash = async (req, res) => {
        try {
            const userRole = req.role;
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const skip = (page - 1) * limit;
            const searchQuery = req.query.search || '';
            if (userRole !== 'ADMIN') throw new AuthFailureError('Tài khoản bị giới hạn')

            const searchFilter = searchQuery
                ? {
                    $or: [
                        { Username: { $regex: searchQuery, $options: 'i' } },
                        { Email: { $regex: searchQuery, $options: 'i' } },
                    ],
                }
                : {};

            // Xử lý sắp xếp
            const sortField = req.query.sort || 'createdAt';
            const sortOrder = req.query.order === 'asc' ? 1 : -1;
            const sortOptions = { [sortField]: sortOrder };

            const staffs = await staffModel.find({ StatusActive: false, ...searchFilter })
                .select('StaffName Username Email Numberphone Tax Role StatusActive createdAt StatusActive creator')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec();

            const totalStaff = await staffModel.countDocuments({ StatusActive: false, ...searchFilter });
            const totalPages = Math.ceil(totalStaff / limit);
            return {
                metadata: {
                    staffs,
                    currentPage: page,
                    totalPages,
                    totalStaff,
                    limit,
                    search: searchQuery,
                    sort: sortField,
                    order: req.query.order || 'desc',
                }
            };
        } catch (error) {
            throw error;
        }
    }

    static async toggleStaffStatusActive(id, staffId, staffRole, staffName) {
        try {
            if (staffRole != 'ADMIN') {
                throw new BadRequestError('Bạn không có quyền truy cập');
            }
            const staff = await staffModel.findById(id);
            if (!staff) {
                throw new Error("Nhân viên không tồn tại!");
            }
            const newStatus = !staff.StatusActive;
            const actionDes = newStatus ? "Hồi phục" : "Xóa tài khoản";
            staff.StatusActive = newStatus;
            staff.creator.push({
                createdBy: staffId,
                createdName: staffName,
                description: actionDes
            })
            await staff.save();
            return staff;
        } catch (error) {
            throw error;
        }
    }

    static deleteStaff = async (req, res) => {
        try {
            const userRole = req.role;
            const { id } = req.params;
            if (userRole !== 'ADMIN') throw new AuthFailureError("Tài khoản bị giới hạn")
            await staffModel.findByIdAndDelete(id);
            return;
        } catch (error) {
            throw new BadRequestError(error);
        }
    }

    static LoginStaff = async (req, res) => {
        try {
            const { Email, Password } = req.body;
            const staff = await staffModel.findOne({ Email });

            if (!staff) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            const isMath = await bcrypt.compare(Password, staff.HashedPassword);

            if (!isMath) {
                throw new BadRequestError("Mật khẩu không chính xác");
            }

            const staffId = staff._id;
            const role = staff.Role;
            const staffName = staff.StaffName
            // console.log('role: ', role);
            const token = createToken({ staffId, Email, role, staffName }, req.res);

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

    static getProfile = async (req, res) => {
        try {
            const staffId = req.user;

            if (!staffId) {
                throw new BadRequestError("Thiếu thông tin tài khoản");
            }
            const profile = await staffModel.findById(staffId)
                .select('StaffName Username Email Password Numberphone Tax Role createdAt StaffPic')
                .exec();

            if (!profile) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            return profile;
        } catch (error) {
            throw error;
        }
    }

    static LogOutStaff = async (req, res) => {
        try {
            const staffId = req.user;

            if (!staffId) {
                throw new Error("Thiếu thông tin tài khoản");
            }

            // Xóa cookie chứa token
            res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });

            return { message: "Đăng xuất thành công" };
        } catch (error) {
            throw new Error("Lỗi khi đăng xuất: " + error.message);
        }
    }

}

module.exports = StaffService;

