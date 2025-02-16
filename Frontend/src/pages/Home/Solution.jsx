import React from 'react'
import { assets } from '../../assets/assets';
import '../styles/styles.css';
import { useNavigate } from 'react-router-dom';
// import {navigateSolution} from "react-router-dom";


const Solution = () => {

    const navigate = useNavigate();

    return (
        <div className='allContent'>
            {/* <Notification /> */}
            <div className='sol-section-0'>
                <img src={assets.sol} alt="Solution" className='' />
            </div>

            <div>
                <div className='sol-content'>
                    <div className='sol-container'>
                        <section className='sol-section-1 sol-section'>
                            <div className='sol-sec1-left'>
                                <img src={assets.sol1} alt="sol-1 section" />
                            </div>
                            <div className='sol-sec1-right'>
                                <h3>Giải pháp phòng họp thông minh</h3>
                                <p>Giải pháp của SiegenX tập trung vào việc cung cấp các sản phẩm và dịch vụ công nghệ thông minh nhằm tối ưu hóa quy trình hoạt động và nâng cao hiệu quả kinh doanh cho doanh nghiệp.</p>
                                <button onClick={() => (navigate("/giai-phap/phong-hop-thong-minh"))} >Xem chi tiết</button>
                            </div>
                        </section>
                        <section className='sol-section-2 sol-section'>
                            <div className='sol-sec2-left'>
                                <h3>Giải pháp phòng học thông minh</h3>
                                <p>Giải pháp của SiegenX tập trung vào việc cung cấp các sản phẩm và dịch vụ công nghệ thông minh nhằm tối ưu hóa quy trình hoạt động và nâng cao hiệu quả kinh doanh cho doanh nghiệp.</p>
                                <button onClick={() => (navigate("/giai-phap/lop-hoc-thong-minh"))}>Xem chi tiết</button>
                            </div>
                            <div className='sol-sec2-right'>
                                <img src={assets.sol2} alt="sol-2 section" />
                            </div>
                        </section>
                        <section className='sol-section-3 sol-section'>
                            <div className='sol-sec1-left'>
                                <img src={assets.sol3} alt="sol-3" />  
                            </div>
                            <div className='sol-sec1-right'>
                                <h3>Giải pháp cho gian hàng</h3>
                                <p>Giải pháp của SiegenX tập trung vào việc cung cấp các sản phẩm và dịch vụ công nghệ thông minh nhằm tối ưu hóa quy trình hoạt động và nâng cao hiệu quả kinh doanh cho doanh nghiệp.</p>
                                <button onClick={() => (navigate("/giai-phap/giai-phap-gian-hang"))} >Xem chi tiết</button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Solution