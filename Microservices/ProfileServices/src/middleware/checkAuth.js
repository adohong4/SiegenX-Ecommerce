'use strict'
const jwt = require('jsonwebtoken')
const { Types } = require('mongoose');
const { asyncHandler } = require('../helpers/asyncHandler')

const authMiddleware = asyncHandler(async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
})

const checkTokenCookie = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        req.user = new Types.ObjectId(decoded.id);
        req.role = decoded.Role;
        req.staffName = decoded.StaffName;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
})

module.exports = {
    authMiddleware, checkTokenCookie
}
