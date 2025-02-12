'use strict'

const profileModel = require("../models/profile.model");
const cloudinary = require('../config/cloudinary.config');
const fs = require('fs');

class ProfileService {

    static uploadImageProfile = async (req, res, next) => {
        try {
            let image_filename = "";
            if (req.file) {
                image_filename = req.file.path;
            } else {
                throw new Error("No file uploaded");
            }

            const userId = req.user._id;
            console.log("userId ", userId);

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

}

module.exports = ProfileService;