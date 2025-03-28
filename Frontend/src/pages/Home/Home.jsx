
import { assets } from '../../assets/assets';
import '../styles/styles.css'
import { StoreContext } from '../../context/StoreContext'
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    options,
    fadeUpVariants, fadeInScaleUp, staggerContainer, containerVariants, imageVariants, textVariants, partners
} from "../../data/data";

const handleOptionClick = (index) => setSelectedOption(index);

const Home = () => {
    const { product_list } = useContext(StoreContext);
    const [activeTab, setActiveTab] = useState("Giải pháp phòng học thông minh");
    const [selectedOption, setSelectedOption] = useState(0);
    const navigate = useNavigate();
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };
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
                <div className='container'>
                    <motion.h2
                        className="section-title"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
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
                            viewport={{ once: false, amount: 0.2 }}
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
                            viewport={{ once: false, amount: 0.2 }}
                        >
                            {product_list.slice(0, 4).map((product) => (
                                <motion.div
                                    className="product-card"
                                    key={product.product_slug}
                                    variants={fadeUpVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="product-img-container">
                                        <img src={`http://localhost:9003/images/${product.images[0]}`} alt={product.title} className="product-img" />
                                        <div className="cart-icon" onClick={(e) => { e.stopPropagation(); navigate("/san-pham") }}>
                                            <i className="fas fa-shopping-cart"></i>
                                        </div>
                                    </div>
                                    <h3 className="product-name">{product.nameProduct}</h3>
                                    <div className="product-actions">
                                        <button className="product-price-btn">LIÊN HỆ</button>
                                        <button className="product-btn" onClick={() => navigate(`/san-pham`)}>XEM NGAY</button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>


            <motion.section
                className="solutions"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={staggerContainer}
            >
                {/* Tiêu đề */}
                <motion.h2 className="solutions-title" variants={fadeUpVariants}>
                    GIẢI PHÁP CỦA CHÚNG TÔI
                </motion.h2>

                {/* Tabs */}
                <motion.div className="solutions-tabs" variants={fadeUpVariants}>
                    {["Giải pháp phòng học thông minh", "Giải pháp cho gian hàng", "Giải pháp phòng họp thông minh", "Giải pháp khác"].map(
                        (tab) => (
                            <motion.button
                                key={tab}
                                className={`solution-tab ${activeTab === tab ? "active" : ""}`}
                                onClick={() => handleTabClick(tab)}
                                whileHover={{ scale: 1.05 }}
                            >
                                {tab}
                            </motion.button>
                        )
                    )}
                </motion.div>

                {/* Hình ảnh giải pháp */}
                <motion.div className="solutions-images" variants={fadeUpVariants}>
                    <motion.div className="solution-item1" whileHover={{ scale: 1.05 }}>
                        <img src={assets.solution1} alt="Giải pháp 1" className="solution-img" />
                    </motion.div>
                    <motion.div className="solution-item2" whileHover={{ scale: 1.05 }}>
                        <img src={assets.solution2} alt="Giải pháp 2" className="solution-img" />
                        <motion.div className="solution-btn-container">
                            <motion.button
                                className="solution-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                XEM TẠI ĐÂY
                            </motion.button>
                        </motion.div>
                    </motion.div>
                    <motion.div className="solution-item3" whileHover={{ scale: 1.05 }}>
                        <img src={assets.solution3} alt="Giải pháp 3" className="solution-img" />
                    </motion.div>
                </motion.div>
            </motion.section>


            <motion.section
                id='section-banner-home'
                className="banner-home"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={staggerContainer}>
                <div className='container'>
                    <motion.div className='row' variants={fadeInScaleUp}>
                        <img src={assets.banner} alt="Banner Home" className='banner-home-img' />
                    </motion.div>
                </div>


            </motion.section>

            <motion.section id="cungcap-gp"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={containerVariants}>
                <div className='container'>
                    <div className="provide-container">
                        {/* Danh sách lựa chọn */}
                        <motion.div className="column column-options" variants={textVariants}>
                            <h2 className="title">CHÚNG TÔI CUNG CẤP CHO BẠN</h2>
                            <p className="subtitle">CÁC GIẢI PHÁP HIỂN THỊ, ÂM THANH TOÀN DIỆN</p>
                            <ul className="option-list">
                                {options.map((option, index) => (
                                    <motion.li
                                        key={index}
                                        className={`option ${selectedOption === index ? "active" : ""}`}
                                        onClick={() => handleOptionClick(index)}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <span className="option-number">{`0${index + 1}`}</span>
                                        <span className="option-text">{option.title}</span>
                                        {selectedOption === index && <span className="arrow">→</span>}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Nội dung hiển thị */}
                        <div className="column-content">
                            <motion.div className="content-image" variants={imageVariants}>
                                <img
                                    className="image-preview"
                                    src={options[selectedOption].image}
                                    alt={options[selectedOption].title}
                                />
                            </motion.div>
                            <motion.div className="content-description" variants={textVariants}>
                                <p>{options[selectedOption].description}</p>
                                <motion.button className="details-button" whileHover={{ scale: 1.1 }}>
                                    XEM CHI TIẾT
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </div>

            </motion.section>
            <section className="partners">
                <h2>ĐỐI TÁC CỦA CHÚNG TÔI</h2>
                <div className="partners-grid">
                    {partners.map((partner, index) => (
                        <img src={partner} alt={`Đối tác ${index + 1}`} key={index} />
                    ))}
                </div>
            </section>
        </>
    )
}

export default Home
