import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success"); //Stripe
    const orderId = searchParams.get("orderId");
    const app_trans_id = searchParams.get("app_trans_id"); //Zalopay

    const { url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const verifyStripePayment = async () => {
        try {
            const response = await axios.post(`${url}/v1/api/profile/stripe/verify`, { success, orderId });
            if (response.data.success) {
                setMessage('Thanh toán Stripe thành công!');
                toast.success("Thanh toán Stripe thành công!")
                navigate("/user/orders");
            } else {
                setMessage('Thanh toán Stripe thất bại.');
                toast.error('Thanh toán Stripe thất bại.')
                navigate("/");
            }
        } catch (error) {
            console.error("Stripe verification error:", error);
            setMessage('Lỗi khi xác minh thanh toán Stripe.');
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const verifyZaloPayPayment = async () => {
        try {
            const response = await axios.post(`${url}/v1/api/online/zalopay/verify`, { app_trans_id, orderId });
            if (response.data.success) {
                setMessage('Thanh toán ZaloPay thành công!');
                toast.success("Thanh toán ZaloPay thành công!");
                navigate("/user/orders");
            } else {
                console.log("response: ", response.data.message);
                setMessage(`Thanh toán ZaloPay thất bại: ${response.data.message}`);
                toast.error('Thanh toán ZaloPay thất bại.');
                navigate("/");
            }
        } catch (error) {
            console.error("ZaloPay verification error:", error);
            setMessage('Lỗi khi xác minh thanh toán ZaloPay.');
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (app_trans_id && orderId) {
            verifyZaloPayPayment();
        } else if (success && orderId) {
            verifyStripePayment();
        } else {
            setLoading(false);
            setMessage('Không có thông tin thanh toán.');
            navigate("/");
        }
    }, [app_trans_id, success, orderId, navigate]);

    if (loading) {
        return (
            <div className='verify'>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className='verify'>
            <p>{message}</p>
        </div>
    );
};

export default Verify;
