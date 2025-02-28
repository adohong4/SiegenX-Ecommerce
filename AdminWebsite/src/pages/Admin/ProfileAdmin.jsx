import React, { useEffect, useContext, useState, useCallback } from 'react';
import "../styles/styles.css";
import axios from 'axios';
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { StoreContext } from '../../context/StoreContext';
import { formatHourDayTime } from '../../lib/utils'

const ProfileAdmin = () => {
    const { account_list, updateStaff } = useContext(StoreContext);
    const [isEditing, setIsEditing] = useState(false);

    const [editProfile, setEditProfile] = useState({ ...account_list });

    const handleChange = (e) => {
        setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateStaff(editProfile)
        setIsEditing(false);
        alert("Thông tin đã được cập nhật!");
    };

    const handleEdit = () => {
        setEditProfile({ ...account_list });
        setIsEditing(true);
    };

    return (
        <motion.div
            className="profile-admin-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="profile-admin-grid">
                {/* Cột 1 - Bảng hiển thị thông tin */}
                <div className="profile-admin-column">
                    <table className="profile-admin-table">
                        <tbody>
                            {[
                                ['Tên nhân viên', account_list.StaffName],
                                ['Tài khoản', account_list.Username],
                                ['Email', account_list.Email],
                                ['Mật khẩu', account_list.Password],
                                ['Số điện thoại', account_list.Numberphone],
                                ['Mã số thuế', account_list.Tax],
                                ['Chức vụ', account_list.Role ? "Nhân viên" : "N/A"],
                                ['Ngày tạo', formatHourDayTime(account_list.createdAt)],
                            ].map(([field, value]) => (
                                <tr key={field}>
                                    <td style={{ fontWeight: 'bold' }} className="field" >{field}</td>
                                    <td className="value">{value || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="profile-admin-actions">
                        {!isEditing && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="profile-admin-edit-btn"
                                onClick={handleEdit}
                            >
                                Chỉnh sửa
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Cột 2 - Form chỉnh sửa */}
                {isEditing && (
                    <div className="profile-admin-column">
                        {[
                            { label: "Họ tên", key: "StaffName" },
                            { label: "Tài khoản", key: "Username" },
                            { label: "Email", key: "Email" },
                            { label: "Mật khẩu", key: "Password" },
                            { label: "Số điện thoại", key: "Numberphone" },
                            { label: "Mã thuế", key: "Tax" },
                        ].map((field) => (
                            <div key={field.key} className="profile-admin-field" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold' }}>{field.label}:</span>
                                <input
                                    type="text"
                                    name={field.key} // Đặt name cho input để sử dụng trong handleChange
                                    value={editProfile[field.key]} // Sử dụng editProfile để hiển thị giá trị
                                    onChange={handleChange} // Sử dụng handleChange để cập nhật giá trị
                                    style={{ flex: 1, marginLeft: '10px' }}
                                />
                            </div>
                        ))}
                        <div className="profile-admin-actions">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="profile-admin-save-btn"
                                onClick={handleSave}
                            >
                                Lưu
                            </motion.button>
                        </div>
                    </div>
                )}

            </div>
        </motion.div>
    );
};

export default ProfileAdmin;
