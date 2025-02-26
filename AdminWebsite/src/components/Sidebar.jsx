import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Styles/Styles.css";
import { assets } from "../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt, faChevronDown, faPlusCircle, faListUl, faUserTie, faTruck,
  faUser, faBoxOpen, faHeadset, faChartBar, faInbox, faBarcode,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [isOpenOrder, setIsOpenOrder] = useState(false);
  const [isOpenContact, setIsOpenContact] = useState(false);

  // State để kiểm soát menu nào đang mở
  const [openMenus, setOpenMenus] = useState({
    sanPham: false,
    nhapHang: false,
    chienDich: false,
    nhaCungcap: false,
  });

  // Hàm toggle menu
  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu], // Đảo trạng thái của menu được click
    }));
  };

  return (
    <div className="section-sidebar">
      <div className="sidebar">
        <div className="logo-sidebar">
          <img className="logo" src={assets.logo_footer} alt="Logo" />
        </div>

        <div className="sidebar-options">
          <NavLink to="/dashboard" className="sidebar-option">
            <FontAwesomeIcon icon={faChartBar} />
            <p>Tổng quan</p>
          </NavLink>

          {/* Sản phẩm */}
          <div className="sidebar-dropdown">
            <div
              className="sidebar-option sidebar-main"
              onClick={() => toggleMenu("sanPham")}
            >
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faPlusCircle} />
                <p>Sản phẩm</p>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`sidebar-icon ${openMenus.sanPham ? "rotate" : ""}`}
              />
            </div>

            {openMenus.sanPham && (
              <ul className="sidebar-submenu">
                <li><NavLink to="/add" className="submenu-item">Thêm sản phẩm</NavLink></li>
                <li><NavLink to="/product" className="submenu-item">Danh sách sản phẩm</NavLink></li>
                <li><NavLink to="/product/trash" className="submenu-item">Thùng rác</NavLink></li>
              </ul>
            )}
          </div >

          {/* Tài khoản */}
          < div className="sidebar-dropdown" >
            <div className="sidebar-option sidebar-main" onClick={() => setIsOpenAccount(!isOpenAccount)}>
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faUser} />
                <p>Tài khoản</p>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className={`sidebar-icon ${isOpenAccount ? "rotate" : ""}`} />
            </div>
            {
              isOpenAccount && (
                <ul className="sidebar-submenu">
                  <li><NavLink to="/user" className="submenu-item">Danh sách tài khoản</NavLink></li>
                  <li><NavLink to="/user/trash" className="submenu-item">Thùng rác</NavLink></li>
                </ul>
              )
            }
          </div >

          {/* Hóa đơn */}
          < div className="sidebar-dropdown" >
            <div className="sidebar-option sidebar-main" onClick={() => setIsOpenOrder(!isOpenOrder)}>
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faBoxOpen} />
                <p>Hóa đơn</p>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className={`sidebar-icon ${isOpenOrder ? "rotate" : ""}`} />
            </div>
            {
              isOpenOrder && (
                <ul className="sidebar-submenu">
                  <li><NavLink to="/orders" className="submenu-item">Danh sách Hóa đơn</NavLink></li>
                  <li><NavLink to="/orders/trash" className="submenu-item">Thùng rác</NavLink></li>
                </ul>
              )
            }
          </div >

          {/* Liên hệ CSKH */}
          < div className="sidebar-dropdown" >
            <div className="sidebar-option sidebar-main" onClick={() => setIsOpenContact(!isOpenContact)}>
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faHeadset} />
                <p>Liên Hệ CSKH</p>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className={`sidebar-icon ${isOpenContact ? "rotate" : ""}`} />
            </div>
            {
              isOpenContact && (
                <ul className="sidebar-submenu">
                  <li><NavLink to="/contact" className="submenu-item">Danh sách liên hệ</NavLink></li>
                  <li><NavLink to="/contact/trash" className="submenu-item">Thùng rác</NavLink></li>
                </ul>
              )
            }
          </div >




          <div className="sidebar-dropdown">
            <div
              className="sidebar-option sidebar-main"
              onClick={() => toggleMenu("nhapHang")}
            >
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faInbox} />
                <p>Nhập Hàng</p>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`sidebar-icon ${openMenus.nhapHang ? "rotate" : ""}`}
              />
            </div>


            {
              openMenus.nhapHang && (
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink to="/nhap-hang" className="submenu-item">
                      Danh sách nhập hàng
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/trash" className="submenu-item">
                      Thùng rác
                    </NavLink>
                  </li>
                </ul>
              )
            }
          </div >
          <div className="sidebar-dropdown">
            <div
              className="sidebar-option sidebar-main"
              onClick={() => toggleMenu("nhaCungcap")}
            >
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faTruck} />
                <p>Nhà cung cấp</p>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`sidebar-icon ${openMenus.nhapHang ? "rotate" : ""}`}
              />
            </div>

            {openMenus.nhaCungcap && (
              <ul className="sidebar-submenu">
                <li>
                  <NavLink to="/add-supplier" className="submenu-item">
                    Thêm nhà cung cấp
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/supplier" className="submenu-item">
                    Danh sách nhà cung cấp
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/trash-supplier" className="submenu-item">
                    Thùng rác
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
          <div className="sidebar-dropdown">
            <div
              className="sidebar-option sidebar-main"
              onClick={() => toggleMenu("chienDich")}
            >
              <div className="dad-menu sidebar-title">
                <FontAwesomeIcon icon={faBarcode} />
                <p>Chiến dịch</p>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`sidebar-icon ${openMenus.chienDich ? "rotate" : ""}`}
              />
            </div>

            {openMenus.chienDich && (
              <ul className="sidebar-submenu">
                <li>
                  <NavLink to="/nhap-hang" className="submenu-item">
                    Thêm chiến dịch
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/product" className="submenu-item">
                    Danh sách chiến dịch
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/trash" className="submenu-item">
                    Thùng rác
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
          <NavLink to="/staff" className="sidebar-option">
            <FontAwesomeIcon icon={faUserTie} />
            <p>Nhân viên</p>
          </NavLink>
        </div >

        <div className="log-out-btn">
          <NavLink to="http://localhost:5173/" className="sidebar-option-logout">
            <p>Đăng xuất</p>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </NavLink>
        </div>
      </div >
    </div >
  );
};

export default Sidebar;
