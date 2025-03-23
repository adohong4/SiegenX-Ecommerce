import React, { useContext, useState, useRef } from 'react';
import "../styles/styles.css";
import { assets } from '../../assets/assets';
import { motion } from "framer-motion";
import { StoreContext } from '../../context/StoreContext';
import { formatHourDayTime } from '../../lib/utils';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileAdmin = () => {
    axios.defaults.withCredentials = true;
    const { url, account_list, updateStaff } = useContext(StoreContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editProfile, setEditProfile] = useState({ ...account_list });
    const fileInputRef = useRef(null);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profile', file);
            try {
                const response = await axios.post(`${url}/v1/api/staff/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success(response.data.message);
                setEditProfile({ ...editProfile, StaffPic: response.data.imageUrl });


            } catch (error) {
                toast.error(error.response?.data?.message || 'Upload ảnh thất bại'); // Xử lý lỗi tốt hơn
            }
        }
    };

    const handleSave = () => {
        updateStaff(editProfile);
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
            {/* Upload Ảnh */}
            <div className="profile-auth col-6" style={{ textAlign: "center" }}>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="imageStaff-upload-input col-9"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />
                <img
                    className="logo profile-pic col-3"
                    src={account_list.StaffPic || assets.staffImage}
                    alt="avt"
                    onClick={() => fileInputRef.current.click()}
                    style={{ cursor: "pointer" }}
                />
                <p style={{ fontSize: "14px", color: "#555", marginBottom: "0px" }}>
                    Hãy click để thay đổi hình ảnh
                </p>
            </div>

            <div className="profile-admin-grid">
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
                                    <td style={{ fontWeight: 'bold' }} className="field">{field}</td>
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
                                    name={field.key}
                                    value={editProfile[field.key]}
                                    onChange={(e) => setEditProfile({ ...editProfile, [e.target.name]: e.target.value })}
                                    style={{ flex: 1 }}
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
