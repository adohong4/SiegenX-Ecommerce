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
        <div className="my-orders">
        <div className="my-orders__filter">
            {['Tất cả', 'Chờ thanh toán', 'Đợi xác nhận', 'Đang chuẩn bị hàng', 'Đang giao hàng', 'Giao hàng thành công', 'Hoàn thành'].map((status) => (
                <button key={status} onClick={() => setFilter(status)} className={filter === status ? 'active' : ''}>
                    {status}
                </button>
            ))}
        </div>

        <div className="my-orders__search">
            <input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {isLoading ? (
            <p className="my-orders__loading">Đang tải dữ liệu...</p>
        ) : filteredOrders.length === 0 ? (
            <p className="my-orders__no-orders">Không có đơn hàng nào phù hợp.</p>
        ) : (
            <div className="my-orders__list">
                {filteredOrders.map((order) => (
                    <div key={order._id} className="my-orders__card">
                        <div className="my-orders__header">
                            <div className='my-orders__header-left'>
                                <span className="my-orders__brand">SIEGenX</span>
                                <span>{order.date}</span>
                            </div>
                            <div className='my-orders__header-right'>   
                                <span className="my-orders__status">
                                    <FontAwesomeIcon icon={faTruck} /> {order.status}
                                </span>
                                <span className="my-orders__payment">{order.payment ? 'HOÀN THÀNH' : 'CHỜ THANH TOÁN'}</span>
                            </div> 
                        </div>

                        <div className="my-orders__items">
                            {order.items.map((item) => (
                                <div key={item.title} className="my-orders__item-detail">
                                    <img src={`http://localhost:9003/images/${item.images[0]}`} alt={item.title} className="my-orders__image" />
                                    <div className="my-orders__info">
                                        <p className="my-orders__title">{item.title}</p>
                                        <p>Phân loại hàng: {item.category || 'Mặc định'}</p>
                                        <p>x{item.quantity}</p>
                                    </div>
                                    <p className="my-orders__price">₫{formatCurrency(item.price)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="my-orders__footer">
                            <p>Thành tiền: <span className="my-orders__total">₫{formatCurrency(order.items.reduce((sum, item) => sum + item.quantity * item.price, 0))}</span></p>
                            <div className="my-orders__actions">
                                <button onClick={() => navigate(`/san-pham/${order.items[0].product_slug}`)} className="my-orders__buy-again">Mua Lại</button>
                                <button onClick={() => navigate(`/lien-he`)} className="my-orders__contact">Liên Hệ</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
    );
};

export default MyOrders;
