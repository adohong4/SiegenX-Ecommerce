import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils'

const MyOrders = () => {
    axios.defaults.withCredentials = true;
    const { url } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${url}/v1/api/profile/user/order/get`);
            if (response.data.status === 200) {
                setOrders(response.data.metadata);
            }
        } catch (error) {
            toast.error('Lỗi khi kết nối với máy chủ!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="My-Order">
            <div className="container myorder-container">
                <div className="top-tittle-order">
                    <h2>Sản phẩm đã mua</h2>
                </div>
                {isLoading ? (
                    <div className="loading">
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="no-orders">
                        <p>Bạn chưa có sản phẩm nào.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-item">
                                <div className="order-items">
                                    {order.items.map((item) => (
                                        <div key={item.title} className="order-item-detail">
                                            {/* Hiển thị hình ảnh đầu tiên */}
                                            <img
                                                src={`http://localhost:9003/images/${item.images[0]}`}
                                                alt={item.title}
                                                className="item-image"
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div className="item-info">
                                                <p className="item-title">{item.title}</p>
                                                <p>{item.price.toLocaleString('vi-VN')} VNĐ</p>
                                                <p>x{item.quantity}</p>
                                                <p>Thành tiền: {formatCurrency(item.price * item.quantity)} VNĐ</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className='btn-buy-again'>Mua Lại</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
