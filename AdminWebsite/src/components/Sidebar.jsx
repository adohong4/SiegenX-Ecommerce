import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Styles/Styles.css";
import { assets } from "../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt, faChevronDown, faPlusCircle, faListUl,
  faUser, faBoxOpen, faHeadset, faChartBar, faInbox, faBarcode,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [isOpenOrder, setIsOpenOrder] = useState(false);
  const [isOpenContact, setIsOpenContact] = useState(false);


  return (
    <div className="section-sidebar">
      <div className="sidebar">
        {/* Logo */}
        <div className="logo-sidebar">
          <img className="logo" src={assets.logo_footer} alt="Logo" />
        </div>

        {/* Danh mục menu */}
        <div className="sidebar-options">
          <NavLink to="/dashboard" className="sidebar-option">
            <FontAwesomeIcon icon={faChartBar} />
            <p>Tổng quan</p>
          </NavLink>

          {/* Sản phẩm */}
          <div className="sidebar-dropdown">
            <div className="sidebar-option sidebar-main" onClick={() => setIsOpen(!isOpen)}>
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faPlusCircle} />
                <p>Sản phẩm</p>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className={`sidebar-icon ${isOpen ? "rotate" : ""}`} />
            </div>
            {isOpen && (
              <ul className="sidebar-submenu">
                <li><NavLink to="/add" className="submenu-item">Thêm sản phẩm</NavLink></li>
                <li><NavLink to="/product" className="submenu-item">Danh sách sản phẩm</NavLink></li>
                <li><NavLink to="/product/trash" className="submenu-item">Thùng rác</NavLink></li>
              </ul>
            )}
          </div>

          {/* Tài khoản */}
          <div className="sidebar-dropdown">
            <div className="sidebar-option sidebar-main" onClick={() => setIsOpenAccount(!isOpenAccount)}>
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faUser} />
                <p>Tài khoản</p>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className={`sidebar-icon ${isOpenAccount ? "rotate" : ""}`} />
            </div>
            {isOpenAccount && (
              <ul className="sidebar-submenu">
                <li><NavLink to="/user" className="submenu-item">Danh sách tài khoản</NavLink></li>
                <li><NavLink to="/user/trash" className="submenu-item">Thùng rác</NavLink></li>
              </ul>
            )}
          </div>

          {/* Hóa đơn */}
          <div className="sidebar-dropdown">
            <div className="sidebar-option sidebar-main" onClick={() => setIsOpenOrder(!isOpenOrder)}>
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faBoxOpen} />
                <p>Hóa đơn</p>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className={`sidebar-icon ${isOpenOrder ? "rotate" : ""}`} />
            </div>
            {isOpenOrder && (
              <ul className="sidebar-submenu">
                <li><NavLink to="/orders" className="submenu-item">Danh sách Hóa đơn</NavLink></li>
                <li><NavLink to="/orders/trash" className="submenu-item">Thùng rác</NavLink></li>
              </ul>
            )}
          </div>

          {/* Liên hệ CSKH */}
          <div className="sidebar-dropdown">
            <div className="sidebar-option sidebar-main" onClick={() => setIsOpenContact(!isOpenContact)}>
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faHeadset} />
                <p>Liên Hệ CSKH</p>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className={`sidebar-icon ${isOpenContact ? "rotate" : ""}`} />
            </div>
            {isOpenContact && (
              <ul className="sidebar-submenu">
                <li><NavLink to="/contact" className="submenu-item">Danh sách liên hệ</NavLink></li>
                <li><NavLink to="/contact/trash" className="submenu-item">Thùng rác</NavLink></li>
              </ul>
            )}
          </div>


          <NavLink to="/nhap-hang" className="sidebar-option">
            <FontAwesomeIcon icon={faInbox} />
            <p>Nhập Hàng</p>
          </NavLink>

          <NavLink to="/campain" className="sidebar-option">
            <FontAwesomeIcon icon={faBarcode} />
            <p>Chiến dịch</p>
          </NavLink>
        </div>


        <div className="log-out-btn">
          <NavLink to="http://localhost:5173/" className="sidebar-option-logout">
            <p>Đăng xuất</p>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
