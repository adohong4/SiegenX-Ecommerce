import React, { useState } from "react";
import "../styles/styles.css";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ProfileAdmin = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profile, setProfile] = useState({
        name: "Nguyễn Văn A",
        username: "admin01",
        email: "admin@example.com",
        password: "123456",
        role: "Quản trị viên",
        taxCode: "1234567890",
    });

    const [editProfile, setEditProfile] = useState({ ...profile });

    const handleChange = (e) => {
        setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setProfile(editProfile);
        setIsEditing(false);
        alert("Thông tin đã được cập nhật!");
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
                            {Object.keys(profile).map((key) => (
                                <tr key={key}>
                                    <td className="profile-label">
                                        {key === "taxCode" ? "Mã số thuế" : key.charAt(0).toUpperCase() + key.slice(1)}
                                    </td>
                                    <td className="profile-value">
                                        {key === "password" ? "******" : profile[key]}
                                    </td>
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
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Cột 2 - Form chỉnh sửa */}
                {isEditing && (
                    <div className="profile-admin-column">
                        {Object.keys(profile).map((key) => (
                            <div key={key} className="profile-admin-field">
                                <label>
                                    {key === "taxCode" ? "Mã số thuế" : key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <div className="password-container">
                                    <input 
                                        type={key === "password" ? (showPassword ? "text" : "password") : "text"}
                                        name={key} 
                                        value={editProfile[key]} 
                                        onChange={handleChange} 
                                    />
                                    {key === "password" && (
                                        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    )}
                                </div>
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
