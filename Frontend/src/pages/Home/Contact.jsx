import React, { useState, useContext, } from 'react';
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import '../styles/styles.css';
import { motion } from "framer-motion";

const Contact = () => {

    const { url } = useContext(StoreContext)

    const [data, setData] = useState({
        username: '',
        email: '',
        phone: '',
        content: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newUrl = url;
        const response = await axios.post(`${newUrl}/v1/api/contact/add`, data);

        if (response.data) {
            setData({
                username: '',
                email: '',
                phone: '',
                content: ''
            })
            toast.success("Yêu cầu được gửi thành công")
        }
        else {
            toast.error("Gửi yêu cầu thất bại")
        }
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            <motion.div className='banner-contact' variants={fadeInUp}>
                <img src={assets.banner_contact} alt="Banner_Contact" />
            </motion.div>

            <motion.div className='section-contact' variants={fadeInUp}>
                <div className="container contact-container">
                    <motion.div className="contact-info" variants={fadeInUp}>
                        <h2>CÔNG TY CỔ PHẦN GIẢI PHÁP CÔNG NGHỆ SIEGENX</h2>
                        <p>SIEGENX tự hào là đơn vị tiên phong mang đến những giải pháp công nghệ đột phá, toàn diện...</p>
                        <motion.div className="contact-detail" variants={fadeInUp}>
                            <div className="contact-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Địa chỉ: Đi-38 khu đô thị Ciputra, đường Lê Văn Lương, Quận Thanh Xuân, Hà Nội</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-phone-alt"></i>
                                <span>Số điện thoại: 0243 6666 000</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <span>Email: siegenx.company@gmail.com</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div className="contact-form" variants={fadeInUp}>
                        <div className="title">
                            <h2>LIÊN HỆ</h2>
                            <p>SIEGENX sẽ liên hệ với bạn trong vòng 5 phút</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="group">
                                <div className="form-group">
                                    <label htmlFor="username">Họ tên</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        onChange={onChangeHandler} value={data.username}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        onChange={onChangeHandler} value={data.email}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    onChange={onChangeHandler} value={data.phone}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">Nội dung</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    onChange={onChangeHandler} value={data.content}
                                    required
                                ></textarea>
                            </div>
                            <div className='submit-form'>
                                <motion.button
                                    type="submit"
                                    className="btn"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Gửi
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div className='section-map' variants={fadeInUp}>
                <div className='container'>
                    <div className='contact-map'>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3414.8491051452497!2d105.78669357486109!3d20.981011980656426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acce612c766f%3A0xf1fff967689168e!2zxJDhuqFpIEjhu41jIEtp4bq_biBUcsO6YywgVGjGsMahbmcgU8ahbiBIw7JhIE7hu5lp!5e1!3m2!1svi!2s!4v1733567121494!5m2!1svi!2s"
                            width="100%" height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Contact;