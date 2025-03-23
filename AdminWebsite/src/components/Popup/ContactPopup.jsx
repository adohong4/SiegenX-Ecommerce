import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { StoreContext } from "../../context/StoreContext";
import { formatDayTime, formatHourDayTime } from '../../lib/utils';
import "../../pages/styles/styles.css";

const ContactPopup = ({ isOpen, onClose, contactId }) => {
    const { url } = useContext(StoreContext);
    const [contact, setContact] = useState(null);

    useEffect(() => {
        if (!contactId) {
            setContact(null);
            return; // Nếu không có ID, không gọi API
        }
        const fetchContactById = async () => {
            try {
                const response = await axios.get(`${url}/v1/api/contact/list/${contactId}`);
                if (response.data.message) {
                    setContact(response.data.metadata);
                }
            } catch (error) {
                toast.error('Xảy ra ngoại lệ khi lấy dữ liệu liên hệ');
                console.error(error);
            }
        };

        fetchContactById();
    }, [contactId]);

    if (!isOpen || !contact) return null;


    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content-cskh" onClick={(e) => e.stopPropagation()}>
                <button className="close-popup" onClick={onClose}>×</button>
                <div className="popup-header">
                    <h3>Chi tiết yêu cầu liên hệ</h3>
                </div>
                <div className="popup-body">
                    <div className="popup-info">
                        <label><strong>Tên:</strong></label>
                        <p>{contact.username}</p>
                    </div>
                    <div className="popup-info">
                        <label><strong>Email:</strong></label>
                        <p>{contact.email}</p>
                    </div>
                    <div className="popup-info">
                        <label><strong>SĐT:</strong></label>
                        <p>{contact.phone}</p>
                    </div>
                    <div className="popup-info">
                        <label><strong>Thời gian:</strong> </label>
                        <p>{contact.date}</p>
                    </div>
                    <div className="popup-info">
                        <label><strong>Nội dung:</strong></label>
                        <p>{contact.content}</p>
                    </div>

                    {/* Bảng lịch sử hoạt động từ contact.creator */}
                    {contact.creator && contact.creator.length > 0 && (
                        <>
                            <h5 className="creator-title">Lịch sử liên hệ</h5>
                            <table className="popup-table">
                                <thead>
                                    <tr>
                                        <th>Nhân viên</th>
                                        <th>Mô tả</th>
                                        <th>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contact.creator.map((entry) => (
                                        <tr key={entry._id}>
                                            <td>{entry.createdName}</td>
                                            <td>{entry.description}</td>
                                            <td>{formatHourDayTime(entry.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
                <div className="popup-footer">
                    <button onClick={onClose} className="popup-close-btn">Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default ContactPopup;
