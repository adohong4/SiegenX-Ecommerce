'use strict';

const jwt = require('jsonwebtoken')

// create token for user
const createToken = (user, res) => {
    const token = jwt.sign(
        { id: user.staffId, Username: user.Username, Email: user.Email, Role: user.role, StaffName: user.staffName },

        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
}

module.exports = { createToken }