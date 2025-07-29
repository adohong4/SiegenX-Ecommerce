import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { url } = useContext(StoreContext);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Cấu hình cho các loại thanh toán
    const paymentConfigs = {
        stripe: {
            key: 'success',
            endpoint: '/v1/api/profile/stripe/verify',
            successMessage: 'Thanh toán Stripe thành công!',
            errorMessage: 'Thanh toán Stripe thất bại.',
            verifyParams: ['success', 'orderId'],
        },
        zalopay: {
            key: 'app_trans_id',
            endpoint: '/v1/api/online/zalopay/verify',
            successMessage: 'Thanh toán ZaloPay thành công!',
            errorMessage: 'Thanh toán ZaloPay thất bại.',
            verifyParams: ['app_trans_id', 'orderId'],
        },
    };

    // Hàm xử lý xác minh thanh toán chung
    const verifyPayment = async (config, params) => {
        try {
            const response = await axios.post(`${url}${config.endpoint}`, params);
            if (response.data.success) {
                setMessage(config.successMessage);
                toast.success(config.successMessage);
                navigate('/user/orders');
            } else {
                const errorMsg = `${config.errorMessage}: ${response.data.message || 'Lỗi không xác định'}`;
                setMessage(errorMsg);
                toast.error(config.errorMessage);
                navigate('/');
            }
        } catch (error) {
            console.error(`${config.key} verification error:`, error);
            const errorMsg = `Lỗi khi xác minh thanh toán ${config.key}.`;
            setMessage(errorMsg);
            toast.error(errorMsg);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const orderId = searchParams.get('orderId');

        // Tìm loại thanh toán dựa trên tham số có trong searchParams
        const paymentType = Object.keys(paymentConfigs).find((type) =>
            searchParams.get(paymentConfigs[type].key)
        );

        if (!paymentType || !orderId) {
            setLoading(false);
            setMessage('Không có thông tin thanh toán.');
            navigate('/');
            return;
        }

        // Tạo object params cho API từ searchParams
        const params = paymentConfigs[paymentType].verifyParams.reduce((acc, param) => {
            acc[param] = searchParams.get(param);
            return acc;
        }, {});

        verifyPayment(paymentConfigs[paymentType], params);
    }, [searchParams, navigate, url]);

    if (loading) {
        return (
            <div className="verify">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="verify">
            <p>{message}</p>
        </div>
    );
};

export default Verify;