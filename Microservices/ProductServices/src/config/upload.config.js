'use strict'

const multer = require("multer");
const sharp = require('sharp');
const fs = require('fs').promises;

const storage = multer.diskStorage({
    destination: "upload",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 40 * 1024 * 1024
    },
})

const convertToWebp = async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();

    try {
        await Promise.all(req.files.map(async (file) => {
            const webpPath = file.path.replace(/\.[^/.]+$/, ".webp");
            //convert to .webp
            await sharp(file.path)
                .webp({ quality: 80 })
                .toFile(webpPath);

            try {
                await fs.unlink(file.path);
                console.log(`Deleted original file: ${file.path}`);
            } catch (err) {
                if (err.code === 'EPERM') {
                    console.warn(`Không thể xóa tệp gốc do EPERM: ${file.path}`);
                } else {
                    throw err;
                }
            }

            file.path = webpPath;
            file.filename = file.filename.replace(/\.[^/.]+$/, ".webp");
        }));
        next();
    } catch (error) {
        console.error('Error in convertToWebp:', error);
        next(error);
    }
};

module.exports = { upload, convertToWebp };