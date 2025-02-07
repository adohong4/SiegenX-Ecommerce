import React from 'react'
import { assets } from '../../assets/assets';
import '../styles/styles.css'
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
            </section></>
    )
}

export default Home
