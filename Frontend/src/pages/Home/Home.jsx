import React from 'react'
import { assets } from '../../assets/assets';
import '../styles/styles.css'
import { product_list} from "../../data/Enviroment";   
import AOS from "aos";
import "aos/dist/aos.css"; // Import CSS của AOS
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const url2 = "https://example.com"; // url fakedata
const fadeUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, 
            delayChildren: 0.1 
        }
    }
};

const Home = () => {

    return (
        <>
            <section id='banner-gt'>
                <div className='img-banner'>
                    <div className='img-banner-right col-6'>
                        <div className='context'>
                            <h1>MÀN HÌNH LED</h1>
                            <h3>Giải pháp quảng cáo hiệu quả</h3>
                            <div className='context-btn'>
                                <div className='btn-xemthem-home'>
                                    <a href="#" className='btn-more-banner'>XEM TẠI ĐÂY</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='img-banner-left col-5'>
                        <img src={assets.img_banner_home} alt="Liên hệ" />
                    </div>
                </div>
            </section>
            <section id='after-banner-home'>
                <div className="banner-categories">
                    <div className="category" onClick={() => handleCategoryClick("Màn hình LED")}>
                        <img src={assets.category1} alt="Màn hình LED" />
                        <div className="category-overlay"></div>
                        <span className="category-text">Màn hình LED</span>
                    </div>
                    <div className="category" onClick={() => handleCategoryClick("Màn hình tương tác")}>
                        <img src={assets.category2} alt="Màn hình tương tác" />
                        <div className="category-overlay"></div>
                        <span className="category-text">Màn hình tương tác</span>
                    </div>
                    <div className="category" onClick={() => handleCategoryClick("Màn hình quảng cáo LCD")}>
                        <img src={assets.category3} alt="Màn hình quảng cáo LCD" />
                        <div className="category-overlay"></div>
                        <span className="category-text">Màn hình quảng cáo LCD</span>
                    </div>
                    <div className="category" onClick={() => handleCategoryClick("Quảng cáo 3D")}>
                        <img src={assets.category4} alt="Quảng cáo 3D" />
                        <div className="category-overlay"></div>
                        <span className="category-text">Quảng cáo 3D</span>
                    </div>
                    <div className="category" onClick={() => handleCategoryClick("KTV 5D")}>
                        <img src={assets.category5} alt="KTV 5D" />
                        <div className="category-overlay"></div>
                        <span className="category-text">KTV 5D</span>
                    </div>
                </div>
            </section>

            <section className="product-showcase">
            <motion.h2
                className="section-title"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariants}
            >
                SẢN PHẨM NỔI BẬT
            </motion.h2>

            <div className="product-content">
                {/* Cột banner */}
                <motion.div
                    className="product-banner"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <img src={assets.homeProduct} alt="Màn hình LED" className="banner-main-img" />
                </motion.div>

                {/* Cột sản phẩm */}
                <motion.div
                    className="product-grid"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {product_list.slice(0, 4).map((product) => (
                        <motion.div
                            className="product-card"
                            key={product.product_slug}
                            variants={fadeUpVariants}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Container hình ảnh và icon giỏ hàng */}
                            <div className="product-img-container">
                                <img src={`${url2}/images/${product.images[0]}`} alt={product.title} className="product-img" />
                                <div className="cart-icon" onClick={(e) => { e.stopPropagation(); navigate("/cart"); }}>
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                            </div>
                            {/* Thông tin sản phẩm */}
                            <h3 className="product-name">{product.nameProduct}</h3>
                            <div className="product-actions">
                                <button className="product-price-btn">{product.price ? `${product.price.toLocaleString()}đ` : "LIÊN HỆ"}</button>
                                <button className="product-btn">XEM NGAY</button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
        </>

    )
}

export default Home
