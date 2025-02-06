import React from 'react';
import '../Styles/Styles.css';
import { assets } from '../../assets/assets';

const handleSubmit = (event) => {
    event.preventDefault();
    const phone = event.target.phone.value;
    console.log("Số điện thoại đã nhập:", phone);
    // Xử lý thêm logic gửi dữ liệu tại đây
};


const Footer = () => {
    return (
        <footer className="footer">
            <div className='container footer-container'>
                <div className=" row footer-content">
                    <div className='top-tittle-footer'>
                        <div className='top-title-left'>
                            <h1>Luôn kết nối với SiegenX</h1>
                            <p>Hãy là người đầu tiên biết về các bộ sưu tập mới và ưu đãi độc quyền</p>
                        </div>
                        <div className='top-title-right'>
                            <div className="container">
                                <form>
                                    <input type="tel" id="phone" name="phone" placeholder="Số điện thoại" pattern="[0-9]{10,11}" />
                                    <button type="submit">Gửi</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className='body-footer'>
                        <div className="footer-info col-xxl-4">
                            <img src={assets.logo_footer} alt="" />
                            <h3>CÔNG TY CỔ PHẦN GIẢI PHÁP CÔNG NGHỆ SIEGENX</h3>
                            <p>Địa chỉ: D11-39 Khu đô thị Glaximeco, đường Lê Trọng Tấn, Q. Hà Đông, Tp. Hà Nội</p>
                        </div>

                        <div className='footer-chinhsach'>
                            <div className="footer-services">
                                <h4>DỊCH VỤ</h4>
                                <ul>
                                    <li>Sản phẩm</li>
                                    <li>Dự án</li>
                                    <li>Chính sách</li>
                                    <li>Tài khoản</li>
                                    <li>Tuyển dụng</li>
                                    <li>Liên hệ</li>
                                </ul>
                            </div>

                            <div className="footer-support">
                                <h4>HỖ TRỢ</h4>
                                <ul>
                                    <li>Sản phẩm</li>
                                    <li>Dự án</li>
                                    <li>Chính sách</li>
                                    <li>Tài khoản</li>
                                    <li>Tuyển dụng</li>
                                    <li>Liên hệ</li>
                                </ul>
                            </div>
                            <div className="footer-links">
                                <h4>LIÊN KẾT</h4>
                                <ul>
                                    <li>
                                        <a href="https://facebook.com/Siegenx" target="_blank">
                                            <i class="fa-brands fa-facebook"></i> Facebook
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://tiktok.com/Siegenx" target="_blank">
                                            <i class="fa-brands fa-tiktok"></i> Tiktok
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://zalo.com/Siegenx" target="_blank">
                                            <i class="fa-solid fa-comment"></i> Zalo
                                        </a>
                                    </li>
                                </ul>

                            </div>
                        </div>
                        <div className='footer-copy'>
                            <p>Copyright 2024 © <strong>Cung cấp bởi SigenX</strong></p>
                        </div>


                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;