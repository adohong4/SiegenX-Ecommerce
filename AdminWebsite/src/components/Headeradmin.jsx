import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import "./Styles/Styles.css";
import { assets } from '../assets/assets';
import { motion } from "framer-motion";
import { StoreContext } from '../context/StoreContext';
import Cookies from 'js-cookie';

const Sidebar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { account_list, updateStaff } = useContext(StoreContext);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        Cookies.remove('token');
    };

    return (
        <div className="section-header-admin">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="header-admin"
            >
                <motion.div
                    className='header-admin-left'
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                    >
                        Xin chào {account_list.StaffName} !
                    </motion.p>
                </motion.div>
                <motion.div
                    className='header-admin-right'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="profile-container">
                        <img
                            className="logo profile-pic"
                            src={account_list.StaffPic || assets.avt}
                            alt="avt"
                            onClick={toggleMenu}
                        />
                        {menuOpen && (
                            <div className="profile-menu">
                                <NavLink to="/profile-admin">Thông tin</NavLink>
                                <NavLink to="/admin-login" onClick={handleLogout}>Đăng Xuất</NavLink>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Sidebar;
