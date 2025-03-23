import React from 'react'
import { assets } from '../../assets/assets';
import '../styles/styles.css';



const ClassRoomSolution = () => {
    return (
        <div className='chitietgiaphap'>
            <div className="section-1 section-banner">
                <img src={assets.phonghop0} alt="class1" />
            </div>
            <section className='section-2 giupgichoban'>
                <div className="container col-12">
                    <div className='sec-2-left col-6'>
                        <img src={assets.phonghop1} alt="class2" />
                    </div>
                    <div className='sec-2-right col-6'>
                        <div className='text-sec-2'>
                            <h1>GIẢI PHÁP NÀY GIÚP GÌ CHO BẠN</h1>
                            <p>
                                Giải pháp phòng họp thông minh mang đến nhiều lợi ích thiết thực cho doanh nghiệp,
                                giúp nâng cao hiệu quả làm việc và tạo ra trải nghiệm hội họp chuyên nghiệp.
                                Với khả năng điều khiển tự động các thiết bị trong phòng như đèn, máy lạnh, màn hình và hệ thống âm thanh,
                                người dùng có thể dễ dàng chuẩn bị và quản lý cuộc họp chỉ với một vài thao tác đơn giản.
                            </p>
                            <p>
                                Hơn nữa, phòng họp không giấy tờ giúp tiết kiệm chi phí in ấn và bảo vệ môi trường,
                                trong khi các thiết bị hiện đại như màn hình lớn và hệ thống hội nghị truyền hình hỗ trợ giao tiếp rõ ràng, mượt mà,
                                kết nối dễ dàng từ xa. Giải pháp này không chỉ nâng cao hiệu suất công việc mà còn tạo ra không gian làm việc hiện đại, thân thiện,
                                và chuyên nghiệp.
                            </p>
                            <div className='button'>
                                <a href="/lien-he" className='btn-sec-2'><span>LIÊN HỆ</span></a>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            <section className='section-3 danhchoai'>
                <div className="container">
                    <h1>GIẢI PHÁP NÀY DÀNH CHO AI</h1>
                    <p>SIEGenX tự hào là một trong doanh nghiệp hàng đầu cung cấp giải pháp tương tác thông minh tại Việt Nam</p>
                    <div className='section-3-child'>
                        <div className='col-3'>
                            <img src={assets.phonghop2} alt="class4" />
                            <h3>DÀNH CHO DOANH NGHIỆP</h3>
                            <p>Tăng tính tương tác linh hoạt giữa các thành viên, không giới hạn không gian, thời gian.</p>
                        </div>

                        <div className='col-3'>
                            <img src={assets.phonghop2} alt="class5" />
                            <h3>DÀNH CHO CHÍNH PHỦ</h3>
                            <p>Hệ thống an toàn thông tin luôn được đảm bảo, không giới hạn không gian, thời gian và khoảng cách địa lý.</p>
                        </div>


                        <div className='col-3'>
                            <img src={assets.phonghop3} alt="class6" />
                            <h3>DÀNH CHO HỘI NGHỊ KHÁC</h3>
                            <p>Giúp dễ dàng theo dõi toàn bộ nội dung, diễn biến cuộc họp.</p>
                        </div>
                    </div>
                </div>
            </section>


            <section className='section-4 thuctrang'>
                <div className="container">
                    <h1>THỰC TRẠNG CHUNG</h1>
                    <div className='section-4-child'>
                        <div className='sec-4-child-left col-6'>
                            <img src={assets.phonghop5} alt="class7" />
                        </div>

                        <div className='sec-4-child-right col-6'>
                            <h2>NHỮNG GIỜ HỌP NHÀM CHÁN VÀ KHÔNG HIỆU QUẢ</h2>
                            <div className='sol-box'>
                                    <i className="fa-solid fa-check"></i>
                                    <p><strong>Trước cuộc họp: </strong>
                                        Vận hành phức tạp nhiều thiết bị dẫn đến hiệu quả công việc thấp.
                                    </p>
                                </div>

                                <div className='sol-box'>
                                    <i className="fa-solid fa-check"></i>
                                    <p><strong>Trong cuộc họp: </strong>Khó thu nhập và ghi chép dữ liệu khi họp, khó đảm
                                        bảo tính chính xác và toàn vẹn của dữ liệu. </p>
                                </div>

                                <div className='sol-box'>
                                    <i className="fa-solid fa-check"></i>
                                    <p><strong>Sau cuộc họp: </strong>Khó truy vấn dữ liệu diễn ra trong cuộc họp đồng thời nguy cơ rò rỉ thông tin cao.</p>
                                </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='meet-section-5 spnoibat'>
                {/* <a href="/"><span>LIÊN HỆ</span></a> */}
                <div className='container'>
                    <h1>THIẾT BỊ & SẢN PHẨM</h1>
                    <div className="spnoibat-row">
                        <div className="sp-col col-3">
                            <div className='sp'>
                                <img src={assets.productClass1} alt="productclass1" className='col-10' />
                                <a href="/" className='buy'><i className="fa-solid fa-cart-shopping col-2"></i></a>
                                <h5>Màn Hình Tương Tác Thông Minh SIEGenX 75inch 4k SGX -1T75</h5>
                                <div className='btn-sp'>
                                    <a href="/lien-he" className='btn-lienhe'>
                                        <span>LIÊN HỆ</span></a>
                                    <a href="/san-pham" className='btn-xemngay'>
                                        <span>XEM NGAY</span></a>
                                </div>
                            </div>
                        </div>
                        <div className="sp-col col-3">
                            <div className="sp">
                                <img src={assets.productClass2} alt="productclass2" />
                                <a href="/" className='buy'><i className="fa-solid fa-cart-shopping"></i></a>
                                <h5>Màn Hình Tương Tác Thông Minh SIEGenX 75inch 4k SGX -1T75</h5>
                                <div className='btn-sp'>
                                    <a href="/lien-he" className='btn-lienhe'>
                                        <span>LIÊN HỆ</span></a>
                                    <a href="/san-pham" className='btn-xemngay'>
                                        <span>XEM NGAY</span></a>
                                </div>
                            </div>
                        </div>
                        <div className="sp-col col-3">
                            <div className="sp">
                                <img src={assets.productClass3} alt="productclass3" />
                                <a href="/" className='buy'><i className="fa-solid fa-cart-shopping"></i></a>
                                <h5>Màn Hình Tương Tác Thông Minh SIEGenX 75inch 4k SGX -1T75</h5>
                                <div className='btn-sp'>
                                    <a href="/lien-he" className='btn-lienhe'>
                                        <span>LIÊN HỆ</span></a>
                                    <a href="/san-pham" className='btn-xemngay'>
                                        <span>XEM NGAY</span></a>
                                </div>
                            </div>
                        </div>
                        <div className="sp-col col-3">
                            <div className="sp">
                                <img src={assets.productClass4} alt="productclass4" />
                                <a href="/" className='buy'><i className="fa-solid fa-cart-shopping"></i></a>
                                <h5>Màn Hình Tương Tác Thông Minh SIEGenX 75inch 4k SGX -1T75</h5>
                                <div className='btn-sp'>
                                    <a href="/lien-he" className='btn-lienhe'>
                                        <span>LIÊN HỆ</span></a>
                                    <a href="/san-pham" className='btn-xemngay'>
                                        <span>XEM NGAY</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section id='section-lh-gp' className='section-lienhe'>
                <div className='section-lh-left col-6'>
                    <img src={assets.meeting10} alt="meeting10" />
                </div>
                <div className='section-lh-right col-6'>
                    <div className='lienhe-form'>
                        <h2>LIÊN HỆ ĐĂNG KÝ</h2>
                        <div className='form-lienhe'>
                            <form action="" className='sol-form'>
                                <div className='topform'>
                                    <input className='sol-input' type="text" placeholder='Họ tên' name='sol-name' />
                                    <input className='sol-input' type="text" placeholder='Số điện thoại' name='sol-sdt' />
                                </div>
                                <div className='bottomform'>
                                    <textarea className="sol-input" name="sol-des" placeholder='Nội dung'></textarea>
                                </div>
                                <div className='btn-send-lh'>
                                    <input className='sol-input' type="submit" value="Gửi đi" name='sol-submit' />
                                </div>
                            </form>
                        </div>
                    </div>
                    


                </div>

            </section>
        </div >
    )
}

export default ClassRoomSolution