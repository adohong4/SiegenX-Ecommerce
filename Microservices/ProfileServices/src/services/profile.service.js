'use strict'

const profileModel = require("../models/profile.model");
const cloudinary = require('../config/cloudinary.config');
const fs = require('fs');
const bcrypt = require('bcrypt');

const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")

class ProfileService {

    static getProfile = async (userId) => {
        try {
            const profile = await profileModel.findById(userId);

            if (!profile) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            return profile;
        } catch (error) {
            throw error;
        }
    }

    static uploadImageProfile = async (req, res, next) => {
        try {
            let image_filename = "";
            if (req.file) {
                image_filename = req.file.path;
            } else {
                throw new Error("No file uploaded");
            }

            const userId = req.user._id;

            // Upload lên Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image_filename, {
                resource_type: 'auto'
            });

            // Cập nhật profile với URL từ Cloudinary
            const updatedProfile = await profileModel.findByIdAndUpdate(
                userId,
                { profilePic: uploadResponse.secure_url },
                { new: true }
            );

            // Xóa file local sau khi upload thành công
            fs.unlink(image_filename, (err) => {
                if (err) {
                    console.error('Failed to delete local file:', err);
                } else {
                    console.log('Local file deleted successfully');
                }
            });

            return updatedProfile;

        } catch (error) {
            throw error;
        }
    }

    static updateProfile = async ({ userId, password, fullName, dateOfBirth, numberPhone, gender }) => {
        try {
            const user = await profileModel.findById(userId);

            if (!user) {
                throw new BadRequestError("Tài khoản không tồn tại");
            }

            const updates = { fullName, dateOfBirth, numberPhone, gender };

            // Cập nhật mật khẩu nếu có
            if (password) {
                if (password.length < 8) {
                    throw new BadRequestError("Mật khẩu phải dài ít nhất 8 ký tự");
                }
                const salt = await bcrypt.genSalt(10);
                updates.password = await bcrypt.hash(password, salt);
            }

            // Xóa các trường không có giá trị
            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            // Cập nhật thông tin người dùng trong database
            const updatedUser = await profileModel.findByIdAndUpdate(userId, updates, { new: true });

            if (!updatedUser) throw new BadRequestError("Cập nhật không thành công");

            return { metadata: updatedUser };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProfileService;