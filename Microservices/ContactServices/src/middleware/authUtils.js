const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

// create token for user
const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
    );
}

// check token validity
const checkToken = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

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

module.exports = {
    createToken, checkToken
}