// ZaloPayController.js

const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const orderModel = require('../models/order.model');
const userModel = require('../models/profile.model');

console.log(process.env.ENDPOINT)
const config = {
    app_id: process.env.APP_ID,
    key1: process.env.KEY1,
    key2: process.env.KEY2,
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    query_endpoint: "https://sb-openapi.zalopay.vn/v2/query",
};




class ZaloPayController {
    placeOrder = async (req, res) => {
        const userId = req.user;
        const frontend_url = process.env.URL_FRONTEND;

        try {
            const totalAmount = req.body.amount;
            const items = req.body.items.map(item => ({
                name: item.nameProduct,
                price: item.price,
                quantity: item.quantity
            }));

            items.push({
                name: "Phí vận chuyển",
                price: 50000,
                quantity: 1
            });

            const transID = Math.floor(Math.random() * 1000000);
            const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;

            const newOrder = new orderModel({
                userId: userId,
                items: req.body.items,
                amount: totalAmount,
                address: req.body.address,
                paymentMethod: "ZaloPay",
                app_trans_id: app_trans_id,
            });
            await newOrder.save();
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            const order = {
                app_id: config.app_id,
                app_trans_id: app_trans_id,
                app_user: userId,
                app_time: Date.now(),
                item: JSON.stringify(items),
                embed_data: JSON.stringify({
                    redirecturl: `${frontend_url}/verify?app_trans_id=${app_trans_id}&orderId=${newOrder._id}`,
                }),
                amount: totalAmount,
                description: `SIEGenX - Payment for the order #${transID}`,
                bank_code: '',
            };

            const data = config.app_id + '|' + order.app_trans_id + '|' + order.app_user + '|' +
                order.amount + '|' + order.app_time + '|' + order.embed_data + '|' + order.item;
            order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

            const result = await axios.post(config.endpoint, null, { params: order });

            if (result.data.return_code === 1) {
                res.json({ success: true, order_url: result.data.order_url });
            } else {
                console.error("ZaloPay error:", result.data);
                await orderModel.findByIdAndDelete(newOrder._id);
                res.json({ success: false, message: result.data.return_message || "Lỗi khi tạo đơn hàng ZaloPay" });
            }

        } catch (error) {
            console.error(error);
            res.json({ success: false, message: "Có lỗi xảy ra." });
        }
    }

    verifyOrder = async (req, res) => {
        const { orderId, app_trans_id } = req.body;
        // console.log("orderId: ", orderId);

        try {
            let postData = {
                app_id: config.app_id,
                app_trans_id: app_trans_id,
                orderId: orderId
            };


            let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
            postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

            let postConfig = {
                method: 'post',
                url: config.query_endpoint,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: qs.stringify(postData),
            };

            const result = await axios(postConfig);
            const zalopayResult = result.data;
            // console.log("ZaloPay query result:", zalopayResult);

            const order = await orderModel.findById(orderId);
            // console.log("order: ", order);
            if (!order) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
            }

            if (zalopayResult.return_code === 1 && !zalopayResult.is_processing) {
                // console.log("order._id: ", order._id);
                await orderModel.findByIdAndUpdate(order._id, { payment: true });
                return res.status(200).json({ success: true, message: 'Thanh toán thành công!' });
                // } else if (zalopayResult.return_code === 3 || zalopayResult.is_processing) {
                //     return res.status(200).json({ success: false, message: 'Đơn hàng đang được xử lý.' }); 
            } else {
                await orderModel.findByIdAndDelete(order._id);
                return res.status(200).json({ success: false, message: 'Thanh toán thất bại.' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xác minh.' });
        }
    }
}

module.exports = new ZaloPayController();
