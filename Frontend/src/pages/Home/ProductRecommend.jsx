import React, { useState, useContext, useEffect } from "react";
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from "react-router-dom";
import { formatCurrency } from '../../lib/utils';
import axios from "axios";
import { motion } from "framer-motion";
import '../styles/styles.css';

const ProductRecommend = () => {
    const { url, fetchOrders, orders } = useContext(StoreContext);
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

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
    };

    return (
        <motion.div 
            className="products-recommend"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={containerVariants}
        >
            <motion.h3 variants={fadeInUp}>SẢN PHẨM LIÊN QUAN</motion.h3>
            <motion.div className="recommend-grid" variants={containerVariants}>
                {recommend.map((item, index) => (
                    <motion.div 
                        key={index} 
                        className="recommend-card"
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img
                            src={item.images && item.images.length > 0 ? `http://localhost:9003/images/${item.images[0]}` : 'path/to/default-image.jpg'}
                            alt={item.nameProduct || 'Product Image'}
                            className="recommend-image"
                        />
                        <h3 className="recommend-title">{item.title || 'Product Title'}</h3>
                        <p className="recommend-price">{item.price ? formatCurrency(item.price) : 'Liên hệ'}</p>
                        <div className="recommend-actions">
                            <motion.button 
                                className="productlist-price-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                LIÊN HỆ
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(`san-pham/${item.product_slug}`)}
                                className="productlist-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                XEM NGAY
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

export default ProductRecommend;
