import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../lib/utils'

const MyOrders = () => {
    axios.defaults.withCredentials = true;
    const { url } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('Tất cả');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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

    // Hàm lọc đơn hàng
    const filteredOrders = orders.filter(order => {
        // Lọc theo trạng thái
        let statusMatch = true;
        if (filter !== 'Tất cả') {
            if (filter === 'Chờ thanh toán') {
                statusMatch = !order.payment;
            } else if (filter === 'Hoàn thành') {
                statusMatch = order.payment;
            } else {
                statusMatch = order.status === filter;
            }
        }

        // Lọc theo tên sản phẩm (searchTerm)
        let searchMatch = true;
        if (searchTerm) {
            searchMatch = order.items.some(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return statusMatch && searchMatch;
    });

    return (
        <div className="My-Order" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div className="container myorder-container">
                {/* Filter */}
                <div className="filter-buttons" style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
                    <button onClick={() => setFilter('Tất cả')} style={{ backgroundColor: filter === 'Tất cả' ? '#26AA99' : '#eee', color: filter === 'Tất cả' ? 'white' : 'black', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Tất cả</button>
                    <button onClick={() => setFilter('Chờ thanh toán')} style={{ backgroundColor: filter === 'Chờ thanh toán' ? '#26AA99' : '#eee', color: filter === 'Chờ thanh toán' ? 'white' : 'black', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Chờ thanh toán</button>
                    <button onClick={() => setFilter('Đợi xác nhận')} style={{ backgroundColor: filter === 'Đợi xác nhận' ? '#26AA99' : '#eee', color: filter === 'Đợi xác nhận' ? 'white' : 'black', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Đợi xác nhận</button>
                    <button onClick={() => setFilter('Đang chuẩn bị hàng')} style={{ backgroundColor: filter === 'Đang chuẩn bị hàng' ? '#26AA99' : '#eee', color: filter === 'Đang chuẩn bị hàng' ? 'white' : 'black', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Đang chuẩn bị hàng</button>
                    <button onClick={() => setFilter('Đang giao hàng')} style={{ backgroundColor: filter === 'Đang giao hàng' ? '#26AA99' : '#eee', color: filter === 'Đang giao hàng' ? 'white' : 'black', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Đang giao hàng</button>
                    <button onClick={() => setFilter('Giao hàng thành công')} style={{ backgroundColor: filter === 'Giao hàng thành công' ? '#26AA99' : '#eee', color: filter === 'Giao hàng thành công' ? 'white' : 'black', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Giao hàng thành công</button>
                    <button onClick={() => setFilter('Hoàn thành')} style={{ backgroundColor: filter === 'Hoàn thành' ? '#26AA99' : '#eee', color: filter === 'Hoàn thành' ? 'white' : 'black', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Hoàn thành</button>
                </div>

                {/* Ô tìm kiếm */}
                <div className="search-box" style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                {isLoading ? (
                    <div className="loading" style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : filteredOrders.length === 0 ? ( // 3. Lọc danh sách đơn hàng
                    <div className="no-orders" style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Không có đơn hàng nào phù hợp.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="order-item" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '20px', background: 'white' }}>
                                <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                                    <p style={{ margin: '0', flex: '0', padding: '3px 5px', marginRight: '10px', background: '#26AA99', color: 'white' }}>SIEGenX</p>
                                    <p style={{ margin: '0', flex: '1' }}>{order.date}</p>
                                    <p style={{ margin: '0', color: '#26AA99', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}><FontAwesomeIcon icon={faTruck} style={{ marginRight: '4px' }} /> {order.status}</p>
                                    <p style={{ margin: '0', marginLeft: '10px', whiteSpace: 'nowrap' }}>{order.payment ? 'HOÀN THÀNH' : 'CHỜ THANH TOÁN'}</p>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item) => (
                                        <div key={item.title} className="order-item-detail" style={{ paddingBottom: '10px', marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', }}>
                                                <img
                                                    src={`http://localhost:9003/images/${item.images[0]}`}
                                                    alt={item.title}
                                                    className="item-image"
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        border: '1px solid #e1e1e1',
                                                        background: '#e1e1e1',
                                                        marginRight: '15px'
                                                    }}
                                                />
                                                <div className="item-info" style={{ flex: 1 }}>
                                                    <p className="item-title" style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.title}</p>
                                                    <p style={{ marginBottom: '5px', color: 'gray' }}>Phân loại hàng: {item.category || 'Mặc định'}</p>
                                                    <p style={{ marginBottom: '5px' }}>x{item.quantity}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ marginBottom: '5px', color: 'red' }}>₫{formatCurrency(item.price)}</p>
                                                    {/* <p style={{ textDecoration: 'line-through', color: 'gray', marginBottom: '5px' }}>{formatCurrency(item.price * 1.2)} VNĐ</p> */}
                                                </div>

                                            </div>

                                            <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginTop: '10px' }}>
                                                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                                                    <p style={{ marginBottom: '0' }}>Thành tiền: <span style={{ color: 'red' }}>₫{formatCurrency(item.quantity * item.price)}</span></p>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => navigate(`/san-pham/${item.product_slug}`)} style={{ backgroundColor: '#EC1313', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', marginRight: '10px' }}>Mua Lại</button>
                                                    <button onClick={() => navigate(`/lien-he`)} style={{ backgroundColor: 'white', color: '#f55', border: '1px solid #f55', padding: '8px 16px', cursor: 'pointer' }}>Liên Hệ</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
