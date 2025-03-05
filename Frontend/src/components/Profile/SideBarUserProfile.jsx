import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom"; // Import Outlet
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSignOutAlt, faChevronDown, faPlusCircle, faListUl, faUserTie, faTruck,
    faUser, faBoxOpen, faHeadset, faChartBar, faInbox, faBarcode,
} from "@fortawesome/free-solid-svg-icons";

const SidebarUserProfile = () => {
    const [openMenus, setOpenMenus] = useState({
        profile: false,
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
                <div className="sidebar-dropdown">
                    {/* Tài khoản của tôi */}
                    <div className="sidebar-dropdown">
                        <div
                            className="sidebar-option sidebar-main"
                            onClick={() => toggleMenu("profile")}
                        >
                            <div className="dad-menu sidebar-title">
                                <FontAwesomeIcon icon={faUserTie} />
                                <p>Tài khoản của tôi</p>
                            </div>
                            {/* Thêm icon dropdown, có thể style để xoay khi mở/đóng */}
                            <FontAwesomeIcon icon={faChevronDown} className={openMenus.profile ? "rotate-down" : ""} />
                        </div>
                        {openMenus.profile && (
                            <ul className="sidebar-submenu">
                                <li><NavLink to="/user/profile" className="submenu-item" >Hồ sơ</NavLink></li>
                                <li><NavLink to="/user/address" className="submenu-item" >Địa chỉ</NavLink></li>
                                <li><NavLink to="/user/change-password" className="submenu-item" >Đổi mật khẩu</NavLink></li>
                            </ul>
                        )}
                    </div>

                    {/* Đơn mua */}
                    <NavLink to="/user/orders" className="sidebar-dropdown"> {/* Chuyển thành NavLink */}
                        <div className="dad-menu sidebar-title">
                            <FontAwesomeIcon icon={faInbox} />
                            <p>Đơn mua</p>
                        </div>
                    </NavLink>
                </div>
            </div>

            {/* Thêm Outlet để hiển thị các component con */}
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default SidebarUserProfile;
