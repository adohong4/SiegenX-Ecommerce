'use strict';

require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/identity.model');
const { createToken } = require("../middleware/authUtils")

const client_id = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(client_id);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id,
    });
    const payload = ticket.getPayload();
    return payload;
}

class GGController {
    async login(req, res) {
        const { token } = req.body;
        //console.log('Received token: ', token);
        try {
            const payload = await verify(token);

            // Tìm kiếm người dùng trong cơ sở dữ liệu
            let user = await userModel.findOne({ email: payload.email });

            // Nếu người dùng chưa tồn tại, tạo mới
            if (!user) {
                user = new userModel({
                    email: payload.email,
                    username: payload.name, // Dùng name thay vì username nếu payload có key name
                    password: '',
                    role: 'USER'
                });
                await user.save();
            }

            const tokenPayload = {
                userId: user._id,
                email: user.email,
                role: user.role,
            };

            const appToken = createToken(tokenPayload, req.res);

            // Trả về thông tin người dùng
            return res.status(200).json({
                status: true,
                message: 'Đăng nhập thành công',
                metadata: {
                    token: appToken,
                    user,
                },
            });
        } catch (error) {
            console.error('Google login error:', error);
            return res.status(500).json({
                status: false,
                message: 'Đăng nhập thất bại. Vui lòng thử lại.',
                error: error.message,
            });
        }
    }
}

module.exports = new GGController();
