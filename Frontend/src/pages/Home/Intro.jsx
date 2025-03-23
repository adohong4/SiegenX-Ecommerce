import React, { useState } from "react";

// import AboutUs from '../../components/Introduce/AboutUs/AboutUs'
// import Culture from '../../components/Introduce/Culture/Culture'
// import Economic from '../../components/Introduce/Economic/Economic'
import { assets } from '../../assets/assets';
import '../styles/styles.css';
import { motion } from "framer-motion";

const cultureData = [
    { image: assets.vision, title: "Tầm nhìn", description: "Trở thành nhà cung cấp giải pháp toàn diện trong lĩnh vực chuyển đổi số..." },
    { image: assets.mission, title: "Sứ mệnh", description: "SIEGenX luôn mang đến sản phẩm chất lượng cao với giá thành hợp lý..." },
    { image: assets.currency, title: "Giá trị cốt lõi", description: "Tiêu Chí dưới đây sẽ là những giá trị mà tập thể lãnh đạo và nhân viên..." },
    { image: assets.eco, title: "Môi trường làm việc", description: "Chuyên nghiệp - Năng động - Sáng tạo - Đam mê - Thử thách - Trách nhiệm..." },
    { image: assets.bulb, title: "Thiết lập kinh doanh", description: "SIEGenX mong muốn trở thành sản phẩm được yêu thích và trân trọng..." },
    { image: assets.rocket, title: "Tiềm năng sáng tạo", description: "SIEGenX mong muốn trở thành sản phẩm được yêu thích và trân trọng..." }
];


const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const tabVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Introduce = () => {
    const [activeTab, setActiveTab] = useState('tech');
    const tabImages = {
        tech: assets.techImage,
        meeting: assets.meetingImage,
        advertising: assets.advertisingImage,
        ktv: assets.ktvImage,
        architecture: assets.architectureImage
    };


    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    return (
        <main className="Intro-page">
            <div className='banner-top-img'>
                <img src={assets.introduce} alt="Liên hệ" />
            </div>

                <motion.section
                    className="section_1_forme"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={containerVariants}
                >
                    <div className='container'>
                        <div className="row row_intro">
                            <motion.div
                                className="row_intro_feft col-6"
                                variants={imageVariants}
                            >
                                <img src={assets.forme} alt="" />
                            </motion.div>

                            <motion.div
                                className="row_intro_right col-6"
                                variants={imageVariants}
                            >
                                <img src={assets.about1} alt="" />
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    className='section-vanhoa'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={containerVariants}
                >
                    <div className="container">
                    <div className="culture-container">
                        <motion.div
                            className='culture-top-title'
                            variants={textVariants}
                        >
                            <h2 className="culture-title">VĂN HÓA DOANH NGHIỆP</h2>
                            <p className="culture-title-p">
                                SIEGenX., JSC tự hào là một trong doanh nghiệp hàng đầu cung cấp giải pháp tương tác thông tin tại Việt Nam.
                            </p>
                        </motion.div>

                        <div className='culture-body-row'>
                            <div className='main-body-vanhoa'>
                                <motion.div
                                    className="culture-items"
                                    variants={staggerVariants}
                                >
                                    {cultureData.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="culture-item"
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <img src={item.image} alt={item.title} />
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                    </div>
                </motion.section>




                <motion.section
                    className='section-linhvuc'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                >            
                <div className='container'>
                    <div className="economic-activity container">
                        <motion.h2
                            className="culture-title text-center mb-4"
                            variants={tabVariants}
                        >
                            LĨNH VỰC KINH DOANH
                        </motion.h2>

                        <div className="row">
                            {/* Tabs (Vertical Buttons) */}
                            <div className="col-md-4 col-xxl-4 col-tab-left-linhvuc">
                                <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                    {["tech", "meeting", "advertising", "ktv", "architecture"].map((tab, index) => (
                                        <motion.button
                                            key={tab}
                                            className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                            onClick={() => handleTabClick(tab)}
                                            type="button"
                                            role="tab"
                                            aria-controls={`v-pills-${tab}`}
                                            aria-selected={activeTab === tab}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {["Giải pháp công nghệ toàn diện", "Giải pháp phòng họp thông minh", "Giải pháp quảng cáo 3D ngoài trời", "KTV 5D", "Kiến trúc điêu khắc đương đại"][index]}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="col-md-8 col-xxl-8 col-tab-right-linhvuc">
                                <motion.div
                                    className="tab-content tab-gt"
                                    id="v-pills-tabContent"
                                    variants={tabVariants}
                                >
                                    {["tech", "meeting", "advertising", "ktv", "architecture"].map((tab) => (
                                        <motion.div
                                            key={tab}
                                            className={`tab-pane fade ${activeTab === tab ? 'show active' : ''}`}
                                            role="tabpanel"
                                            aria-labelledby={`v-pills-${tab}-tab`}
                                            initial="hidden"
                                            animate={activeTab === tab ? "visible" : "hidden"}
                                            variants={tabVariants}
                                        >
                                            {activeTab === tab && (
                                                <motion.img
                                                    src={assets.economic}
                                                    alt={tab}
                                                    className="img-fluid rounded"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.button
                                    className="btn btn-primary mt-3"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Xem chi tiết
                                </motion.button>
                            </div>
                        </div>
                    </div>
                    </div>
                </motion.section>
        </main>
    )
}

export default Introduce