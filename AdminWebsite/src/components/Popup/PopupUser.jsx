import React from 'react';
import "../Styles/Styles.css"

const Popup = ({ isOpen, onClose, userData, onChange, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="user-popup-overlay">
            <div className="user-popup-content">
                <button className="user-close-popup" onClick={onClose}>
                    &times;
                </button>
                <h3>Update User</h3>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="username"
                        value={userData?.username || ''} // Điền giá trị từ userData vào input
                        onChange={onChange}
                        className="user-popup-input"
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData?.email || ''} // Điền giá trị từ userData vào input
                        onChange={onChange}
                        className="user-popup-input"
                        readOnly
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={userData?.password || ''} // Điền giá trị từ userData vào input
                        onChange={onChange}
                        className="user-popup-input"
                    />
                </div>
                <button onClick={onSave} className="user-popup-btn-save">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Popup;