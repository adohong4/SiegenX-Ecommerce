import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import '../Styles/Styles.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown user state
    const [activeLink, setActiveLink] = useState('/');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    const handleLogout = () => {
        Cookies.remove('jwt'); // Xóa token từ cookie
        navigate('/');
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen); // Toggle trạng thái dropdown
    };

    const token = Cookies.get('jwt');

    return (
        <header id='header' className="nav-header">
            <div className="container">
                {/* Desktop Navbar */}
                <div className="pc-display col-12">
                    <div className="top-row-header">
                        <div
                            className="navbar-brand header-logo"
                            onClick={() => navigate('/')}
                        >
                            <img src={assets.logo} alt="SiegenX Logo" style={{ height: '60px' }} />
                        </div>
                    </div>
                    <div className="mid-row-header">
                        <div className="mid-row-header-1">
                            <div className="mid-left">
                                <ul>
                                    <li>SiegenX</li>
                                    <li>SiegenX Object</li>
                                    <li>SiegenX LED</li>
                                </ul>
                            </div>
                            <div className="mid-right">
                                <div className="search-bar">
                                    <input type="text" placeholder="Tìm kiếm" />
                                    <button className="search-button"><i className="fas fa-search"></i></button>
                                </div>

                                {/* <div className='icons'>
                                    <span className="icon-user" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
                                        <i className="fas fa-user"></i>
                                    </span>
                                    <span className="icon-cart" onClick={() => navigate('/cart')}>
                                        <i className="fas fa-shopping-cart"></i>
                                    </span>
                                </div> */}

                                <div className="icons">
                                    {!token ? (
                                        <button
                                            className="btn btn-signin btn-primary"
                                            onClick={() => navigate('/login')}
                                        >
                                            Đăng Nhập
                                        </button>
                                    ) : (
                                        <div className="dropdown">
                                            <span className="icon-user" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
                                                <i className="fas fa-user"></i>
                                            </span>
                                            <span className="icon-cart" onClick={() => navigate('/cart')}>
                                                <i className="fas fa-shopping-cart"></i>
                                                {/* <div className={getTotalCartAmount() === 0 ? "none" : "dot"}></div>  */}
                                            </span>

                                            {isDropdownOpen && (
                                                <ul className="dropdown-menu">
                                                    <li onClick={() => { navigate('/user/orders'); setIsDropdownOpen(false); }}>
                                                        Hóa đơn
                                                    </li>
                                                    <li onClick={() => { navigate('/user/profile'); setIsDropdownOpen(false); }}>
                                                        Cá Nhân
                                                    </li>
                                                    <li onClick={() => { handleLogout(); setIsDropdownOpen(false); }}>
                                                        Đăng xuất
                                                    </li>
                                                </ul>
                                            )}
                                        </div>

                                    )}

                                </div>
                            </div>
                        </div>
                        <div className="mid-row-header-2">
                            <div className="nav-bar-header-left">
                                <ul>
                                    {[
                                        { path: '/', label: 'Trang Chủ' },
                                        { path: '/gioi-thieu', label: 'Giới Thiệu' },
                                        { path: '/san-pham', label: 'Sản Phẩm' },
                                        { path: '/giai-phap', label: 'Giải Pháp' },
                                        { path: '/lien-he', label: 'Liên Hệ' },
                                    ].map((item) => (
                                        <li key={item.path}>
                                            <div
                                                className={`navbar-item ${activeLink === item.path ? 'active' : ''}`}
                                                onClick={() => navigate(item.path)}
                                            >
                                                {item.label}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="nav-bar-header-right">
                                <div className="hotline">
                                    <p>
                                        <span className="label-hotline">Hotline</span>
                                        <span className="sdt">
                                            <a href="https://zalo.me/0982848203">0982848203</a>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navbar */}
                <div className="mobile-display">
                    <div
                        className="hamburger"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div
                        className="navbar-brand"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src={assets.logo}
                            alt="SiegenX Logo"
                            className="logo"
                        />
                    </div>
                    <div className="nav-icons">
                        <i
                            className="fas fa-shopping-cart"
                            onClick={() => navigate('/cart')}
                        ></i>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="menu-content">
                        <div className="search-bar">
                            <input type="text" placeholder="Tìm kiếm" />
                            <button>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                        <ul>
                            <li onClick={() => handleNavigate('/')}>Trang Chủ</li>
                            <li onClick={() => handleNavigate('/gioi-thieu')}>Giới Thiệu</li>
                            <li onClick={() => handleNavigate('/san-pham')}>Sản Phẩm</li>
                            <li onClick={() => handleNavigate('/giai-phap')}>Giải Pháp</li>
                            <li onClick={() => handleNavigate('/lien-he')}>Liên Hệ</li>
                        </ul>
                        {!token ? (
                            <button
                                className="btn btn-signin"
                                onClick={() => handleNavigate('/login')}
                            >
                                Đăng Nhập
                            </button>
                        ) : (
                            <ul>
                                <li onClick={() => handleNavigate('/user/orders')}>Đơn Hàng</li>
                                <li onClick={() => handleNavigate('/user/profile')}>Tài Khoản</li>
                                <li onClick={handleLogout}>Đăng Xuất</li>
                            </ul>
                        )}
                    </div>
                )}
                <div className="notification-container col-12">
                    <p className="notification-text"><em>SIEGENX MEMBER DAYS!</em> - Ngày hội thành viên Siegenx - Ưu đãi lên đến 50%</p>
                    <button className="cta-button">XEM NGAY</button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;