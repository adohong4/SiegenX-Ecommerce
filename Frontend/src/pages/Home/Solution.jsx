import React from 'react'
import { assets } from '../../assets/assets';
import '../styles/styles.css';
import { useNavigate } from 'react-router-dom';
// import {navigateSolution} from "react-router-dom";
import { motion } from 'framer-motion';

const Solution = () => {

    const navigate = useNavigate();
    const sectionVariants = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };
    const sectionVariants_1= {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };
    return (
        <div className='allContent'>
            {/* <Notification /> */}
            <div className='sol-section-0'>
                <img src={assets.sol} alt="Solution" className='' />
            </div>

            <div>
                <div className='sol-content'>
                        <>
                            <motion.section className='sol-section-1 sol-section'  initial="hidden"  whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={sectionVariants}>
                            <div className='container'>
                                <div className='sol-sec1-left'>
                                    <motion.img src={assets.sol1} alt="sol-1 section" />
                                </div>
                                <div className='sol-sec1-right'>
                                    <h3>Giải pháp phòng học thông minh</h3>
                                    <p>Giải pháp của SiegenX tập trung vào việc cung cấp các sản phẩm và dịch vụ công nghệ thông minh nhằm tối ưu hóa quy trình hoạt động và nâng cao hiệu quả kinh doanh cho doanh nghiệp.</p>
                                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => navigate("/giai-phap/lop-hoc-thong-minh")}>
                                        Xem chi tiết
                                    </motion.button>
                                </div>
                            </div>
                            </motion.section>

                            <motion.section className='sol-section-2 sol-section' initial="hidden"  whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={sectionVariants_1}>
                                <div className='container'>
                                <div className='sol-sec2-left'>
                                    <h3>Giải pháp phòng họp thông minh</h3>
                                    <p>Giải pháp của SiegenX tập trung vào việc cung cấp các sản phẩm và dịch vụ công nghệ thông minh nhằm tối ưu hóa quy trình hoạt động và nâng cao hiệu quả kinh doanh cho doanh nghiệp.</p>
                                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => navigate("/giai-phap/phong-hop-thong-minh")}>
                                        Xem chi tiết
                                    </motion.button>
                                </div>
                                <div className='sol-sec2-right'>
                                    <motion.img src={assets.sol2} alt="sol-2 section"  />
                                </div>
                                </div>
                            </motion.section>

                            <motion.section className='sol-section-3 sol-section' initial="hidden"  whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={sectionVariants}>
                            <div className='container'>
                                <div className='sol-sec1-left'>
                                    <motion.img src={assets.sol3} alt="sol-3"  />
                                </div>
                                <div className='sol-sec1-right'>
                                    <h3>Giải pháp cho gian hàng</h3>
                                    <p>Giải pháp của SiegenX tập trung vào việc cung cấp các sản phẩm và dịch vụ công nghệ thông minh nhằm tối ưu hóa quy trình hoạt động và nâng cao hiệu quả kinh doanh cho doanh nghiệp.</p>
                                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => navigate("/giai-phap/giai-phap-gian-hang")}>
                                        Xem chi tiết
                                    </motion.button>
                                </div>
                                </div>  
                            </motion.section>
                        </>
                    </div>
                </div>
            </div>
    )
}

export default Solution