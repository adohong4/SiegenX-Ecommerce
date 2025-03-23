import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBox, faShoppingCart, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { fakeFactors } from "../../data/Enviroment";
import { StoreContext } from '../../context/StoreContext';

const StatsCard = ({ maxCount, label }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev < maxCount) {
                    return prev + 1;
                } else {
                    clearInterval(interval);
                    return maxCount;
                }
            });
        }, 50);

        return () => clearInterval(interval);
    }, [maxCount]);

    return (
        <div className="stats-card">
            <p className="stats-number">{count} <span className="plus">+</span></p>
            <p className="stats-label">{label}</p>
        </div>
    );
};

const Factors = () => {
    const { product_list, users, order, contacts } = useContext(StoreContext);
    const [orders, setOrders] = useState(0);
    const [user, setUser] = useState(0);
    const [product, setProduct] = useState(0);
    const [contact, setContact] = useState(0);

    useEffect(() => {
        setUser(users?.length);
        setProduct(product_list?.length);
        setOrders(order?.length);
        setContact(contacts?.length);
    }, []);

    return (
        <div className="user-factors-container">
            <div className="info-cards col-12">
                <div className="info-card" style={{ background: "#6F42C1", color: "white" }}>
                    <FontAwesomeIcon icon={faUsers} className="info-icon" />
                    <StatsCard maxCount={user} label="Người dùng" />
                </div>
                <div className="info-card" style={{ background: "#3399FF", color: "white" }}>
                    <FontAwesomeIcon icon={faBox} className="info-icon" />
                    <StatsCard maxCount={product} label="Sản phẩm" />
                </div>
                <div className="info-card" style={{ background: "#F9B115", color: "white" }}>
                    <FontAwesomeIcon icon={faShoppingCart} className="info-icon" />
                    <StatsCard maxCount={orders} label="Đơn hàng" />
                </div>
                <div className="info-card" style={{ background: "#DC3545", color: "white" }}>
                    <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
                    <StatsCard maxCount={contact} label="Liên hệ" />
                </div>
            </div>
        </div>
    );
};

export default Factors;
