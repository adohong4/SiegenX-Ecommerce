
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { StoreContext } from '../../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBox, faShoppingCart, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { fakeFactors} from "../../data/Enviroment";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Factors = () => {
    // const { url } = useContext(StoreContext)

    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState([]);
    const [product, setProduct] = useState([]);
    const [contact, setContact] = useState([]);

    const fetchOrderCount = async () => {
        const response = await axios.get(`${url}/v1/api/profile/order/count`);
        if (response.data.status) {
            setOrders(response.data.metadata);
        }
    }

    const fetchProductCount = async () => {
        const response = await axios.get(`${url}/v1/api/product/count`);
        if (response.data.status) {
            setProduct(response.data.metadata);
        }
    }

    const fetchUserCount = async () => {
        const response = await axios.get(`${url}/v1/api/profile/admin/user/count`);
        if (response.data.status) {
            setUser(response.data.metadata);
        }
    }

    const fetchContactCount = async () => {
        const response = await axios.get(`${url}/v1/api/contact/count`);
        if (response.data.status) {
            setContact(response.data.metadata);
        }
    }



    // useEffect(() => {
    //     fetchProductCount();
    //     fetchOrderCount();
    //     fetchUserCount();
    //     fetchContactCount();
    // }, [url]);

    useEffect(() => {
        // Thay thế API call bằng dữ liệu giả
        setUser(fakeFactors.user);
        setProduct(fakeFactors.product);
        setOrders(fakeFactors.orders);
        setContact(fakeFactors.contact);
    }, []);


    return (
        <div className="user-factors-container">
            <div className='user-factors-title'>
                <h2>Thống kê</h2>
            </div>
            <div className="info-cards">
                <div className="info-card">
                    <FontAwesomeIcon icon={faUsers} className="info-icon" />
                    <div className='tt'>
                        <h3>Người dùng</h3>
                        <p>{user}</p>
                    </div>
                </div>
                <div className="info-card">
                    <FontAwesomeIcon icon={faBox} className="info-icon" />
                    <div className='tt'>
                        <h3>Sản phẩm</h3>
                        <p>{product}</p>
                    </div>
                </div>
                <div className="info-card">
                    <FontAwesomeIcon icon={faShoppingCart} className="info-icon" />
                    <div className='tt'>
                        <h3>Đơn hàng</h3>
                        <p>{orders}</p>
                    </div>

                </div>
                <div className="info-card">
                    <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
                    <div className='tt'>
                        <h3>Liên hệ</h3>
                        <p>{contact}</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Factors;
