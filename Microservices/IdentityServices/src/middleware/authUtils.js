const jwt = require('jsonwebtoken')
const identityModel = require('../models/identity.model')

// create token for user
const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// check token validity
const checkTokenLocalStorage = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await identityModel.findById(decoded.id);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: { id: user._id, email: user.email } });
    try {

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}

const checkTokenCookie = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
        }

        const user = await identityModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}

module.exports = { createToken, checkTokenLocalStorage, checkTokenCookie }