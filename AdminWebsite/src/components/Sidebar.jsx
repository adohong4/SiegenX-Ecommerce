import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Styles/Styles.css";
import { assets } from "../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faChevronDown,
  faPlusCircle,
  faListUl,
  faUser,
  faBoxOpen,
  faHeadset,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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

          <div className="sidebar-dropdown">
            <div
              className="sidebar-option sidebar-main"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faPlusCircle} />
                <p>Sản phẩm</p>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`sidebar-icon ${isOpen ? "rotate" : ""}`}
              />
            </div>

            {/* Menu con */}
            {isOpen && (
              <ul className="sidebar-submenu">
                <li>
                  <NavLink to="/add" className="submenu-item">
                    Thêm sản phẩm
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/product" className="submenu-item">
                    Danh sách sản phẩm
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/delete/product" className="submenu-item">
                    Thùng rác
                  </NavLink>
                </li>
              </ul>
            )}
          </div>

            <NavLink to="/user" className="sidebar-option">
                <FontAwesomeIcon icon={faUser} />
                <p>Tài Khoản</p>
            </NavLink>

            <NavLink to="/orders" className="sidebar-option">
                <FontAwesomeIcon icon={faBoxOpen} />
                <p>Hóa Đơn</p>
            </NavLink>

            <NavLink to="/contact" className="sidebar-option">
                <FontAwesomeIcon icon={faHeadset} />
                <p>Liên Hệ CSKH</p>
            </NavLink>

            <NavLink to="/contact" className="sidebar-option">
                <FontAwesomeIcon icon={faHeadset} />
                <p>Nhập Hàng</p>
            </NavLink>
          
            <NavLink to="/contact" className="sidebar-option">
                <FontAwesomeIcon icon={faHeadset} />
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
