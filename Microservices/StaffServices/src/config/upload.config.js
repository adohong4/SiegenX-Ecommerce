'use strict'

const multer = require('multer');

const storage = multer.diskStorage({
    destination: "upload",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 40 * 1024 * 1024 // Giới hạn 40MB
    },
})

module.exports = upload;