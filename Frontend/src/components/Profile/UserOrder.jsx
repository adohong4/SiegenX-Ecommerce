import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

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
                    <h2>Đơn hàng của tôi</h2>
                </div>
                {isLoading ? (
                    <div className="loading">
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="no-orders">
                        <p>Bạn chưa có đơn hàng nào.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <table className="myorder-table">
                            <thead>
                                <tr>
                                    <th>Mã hóa đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Số lượng</th>
                                    <th>Thành tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Cập nhật đơn hàng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.date}</td>
                                        <td>{order.items.length} sản phẩm</td>
                                        <td>{order.amount.toLocaleString()} VND</td>
                                        <td className="status">
                                            <span
                                                className={`status-badge ${order.status
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-')}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="col-update status">
                                            <button
                                                className="btn-updates"
                                                onClick={() => fetchOrders()}
                                            >
                                                Cập nhật đơn hàng
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Cards */}
                        {/* <div className="orders-wrapper">
                            {orders.map((order) => (
                                <div key={order._id} className="order-card">
                                    <div className="order-detail">
                                        <p><strong>Mã hóa đơn:</strong> {order._id}</p>
                                        <p><strong>Ngày đặt:</strong> {order.date}</p>
                                        <p><strong>Số lượng:</strong> {order.items.length} sản phẩm</p>
                                        <p><strong>Thành tiền:</strong> {order.amount.toLocaleString()} VND</p>
                                        <p><strong>Trạng thái:</strong>
                                            <span
                                                className={`status-badge ${order.status
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-')}`}
                                            >
                                                {order.status}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="order-actions">
                                        <button
                                            className="btn-updates"
                                            onClick={() => fetchOrders()}
                                        >
                                            Cập nhật đơn hàng
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div> */}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
