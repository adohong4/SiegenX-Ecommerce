import React, { useState, useContext, useEffect } from "react";
import { StoreContext } from '../../context/StoreContext'
import { useNavigate, useSearchParams } from "react-router-dom";
import { assets } from '../../assets/assets';
import { formatCurrency } from '../../lib/utils'
import { toast } from 'react-toastify';
import axios from "axios";
import '../styles/styles.css';

const ProductRecommend = () => {
    const { url, fetchOrders, orders, } = useContext(StoreContext);
    const [recommend, setProductRecommend] = useState([]);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    useEffect(() => {
        fetchOrders();
    }, []);


    const fetchProductRecommend = async () => {
        if (!orders.length) return;
        const productIds = orders.flatMap(order => order.items.map(item => item._id));
        if (productIds.length > 0) {
            const data = {
                productIds: productIds,
                numRecommendations: 4
            };
            try {
                const response = await axios.post(`${url}/v1/api/product/recommend`, data, {
                    headers: { "Content-Type": "application/json" }
                });

                if (response.data?.status === 200) {
                    setProductRecommend(response.data.metadata);
                } else {
                    console.warn("API không trả về dữ liệu hợp lệ:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm gợi ý:", error);
            }
        }
    };

    useEffect(() => {
        if (orders.length) {
            fetchProductRecommend();
        }
    }, [orders]);

    if (!recommend || recommend.length === 0) {
        return null;
    }

    return (
        <div className="products-recommend">
            <h3>Gợi ý sản phẩm</h3>
            <div className="recommend-grid">
                {recommend.map((item, index) => (
                    <div key={index} className="recommend-card">
                        <img
                            src={item.images && item.images.length > 0 ? `http://localhost:9003/images/${item.images[0]}` : 'path/to/default-image.jpg'}
                            alt={item.nameProduct || 'Product Image'}
                            className="recommend-image"
                        />
                        <h3 className="recommend-title">{item.title || 'Product Title'}</h3>
                        <p className="recommend-price">{item.price ? formatCurrency(item.price) : 'Liên hệ'}</p>
                        <div className="recommend-actions">
                            <button className="productlist-price-btn">
                                LIÊN HỆ
                            </button>
                            <button
                                onClick={() => navigate(`san-pham/${item.product_slug}`)}
                                className="productlist-btn">
                                XEM NGAY
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductRecommend;
