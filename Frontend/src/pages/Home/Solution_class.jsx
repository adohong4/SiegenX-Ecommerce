import React from 'react'
import { assets } from '../../assets/assets';
import '../styles/styles.css';


const ClassRoomSolution = () => {
    return (
        <div className='chitietgiaphap'>
            <div className="section-1 section-banner">
                <img src={assets.class1} alt="class1" />
            </div>
            <section className='section-2 giupgichoban'>
                <div className="container col-12">
                    <div className='sec-2-left col-6'>
                        <img src={assets.class2} alt="class2" />
                    </div>
                    <div className='sec-2-right col-6'>
                        <div className='text-sec-2'>
                            <h1>GIẢI PHÁP NÀY GIÚP GÌ CHO BẠN</h1>
                            <p>
                                Giải pháp phòng học thông minh mang lại nhiều lợi ích thiết thực cho giáo viên và học sinh.
                                Nó tạo ra một môi trường học tập tương tác, giúp tăng cường sự hứng thú và động lực học tập.
                                Với các thiết bị hiện đại như màn hình tương tác và máy chiếu, nội dung bài giảng trở nên hấp dẫn và dễ tiếp thu hơn.
                            </p>
                            <p>
                                Cuối cùng, giải pháp này hỗ trợ việc theo dõi và đánh giá quá trình học tập, giúp giáo viên nhận biết sự tiến bộ của học sinh
                                và điều chỉnh phương pháp giảng dạy phù hợp. Tất cả những điều này góp phần nâng cao chất lượng giáo dục một cách rõ rệt.
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
                            <img src={assets.class4} alt="class4" />
                            <h3>DÀNH CHO TRƯỜNG HỌC</h3>
                            <p>Tăng tính tương tác linh hoạt giữa các thành viên, không giới hạn không gian, thời gian.</p>
                        </div>

                        <div className='col-3'>
                            <img src={assets.class5} alt="class5" />
                            <h3>DÀNH CHO GIÁO VIÊN</h3>
                            <p>Hệ thống an toàn thông tin luôn được đảm bảo, không giới hạn không gian, thời gian và khoảng cách địa lý.</p>
                        </div>


                        <div className='col-3'>
                            <img src={assets.class6} alt="class6" />
                            <h3>DÀNH CHO HỌC SINH</h3>
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
                            <img src={assets.class7} alt="class7" />
                        </div>

                        <div className='sec-4-child-right col-6'>
                            <h2>NHỮNG TIẾT HỌC NHÀM CHÁN, NHỮNG BÀI HỌC KHÔNG THẤY KẾT QUẢ</h2>
                            <div className='sol-box'>
                                <i className="fa-solid fa-check"></i>
                                <p><strong>Phương pháp giảng dạy truyền thống: </strong>
                                    một chiều, quá tập trung vào lý thuyết khiến học sinh dễ cảm thấy mệt mỏi và mất tập trung
                                </p>
                            </div>

                            <div className='sol-box'>
                                <i className="fa-solid fa-check"></i>
                                <p><strong>Cơ sở vật chất lạc hậu: </strong>
                                    thiếu các thiết bị hỗ trợ hiện đại cũng hạn chế khả năng tương tác và tạo ra những bài học sinh động</p>
                            </div>

                            <div className='sol-box'>
                                <i className="fa-solid fa-check"></i>
                                <p><strong>Thiếu sự tương tác: </strong>
                                    Các hoạt động nhóm, thảo luận, thực hành ít được khuyến khích,
                                    khiến học sinh trở nên thụ động và thiếu cơ hội phát triển kỹ năng mềm.</p>
                            </div>

                            <div className='sol-box'>
                                <i className="fa-solid fa-check"></i>
                                <p><strong>Môi trường học tập nhàm chán: </strong>
                                    Phòng học thiếu sáng tạo, trang thiết bị lạc hậu, không gian học tập hạn chế,
                                    khiến học sinh cảm thấy bức bách và không thoải mái.</p>
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