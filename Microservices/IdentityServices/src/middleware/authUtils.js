'use strict';

const jwt = require('jsonwebtoken')
const identityModel = require('../models/identity.model')

// create token for user
const createToken = (payload, res) => {
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        // httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
}

module.exports = { createToken }