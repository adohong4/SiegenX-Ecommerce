import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "../styles/styles.css";
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const SupplierForm = () => {
    axios.defaults.withCredentials = true;
    const { url, product_list } = useContext(StoreContext);
    const [formData, setFormData] = useState({
        supplierName: "",
        phone: "",
        email: "",
        address: "",
        taxCode: "",
        street: "",
        area: "",
        city: ""
    });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/v1/api/supplier/create`, formData);
            if (response.data.status) {
                setSuccess(response.data.message);
                handleCancel();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Đã xảy ra lỗi khi tạo mới nhà cung cấp.");
            }
        }
    };


    const handleCancel = () => {
        setFormData({
            supplierName: "", description: "",
            numberPhone: "", lane: "", addressOthers: "",
            email: "", address: "", taxCode: "", street: "", area: "", city: ""
        });
    };

    return (
        <div className="supplier-page-container">
            {(error || success) && (
                <div className="popup-overlay fade-in">
                    <div className={`popup-container ${success ? "success" : "error"}`}>
                        <p>{error || success}</p>
                        <button onClick={() => { setError(""); setSuccess(""); }}>Đóng</button>
                    </div>
                </div>
            )}
            <div>
                <button className="btn-restore" onClick={() => navigate("/supplier")}>← Quay lại</button>
            </div>
            <div className="supplier-form-body">
                <div className="supplier-form-section col-6">
                    <h3>Thông tin chung</h3>
                    <div className="form-group">
                        <label>Tên nhà cung cấp:</label>
                        <input type="text" name="supplierName" placeholder="Nhập tên nhà cung cấp" value={formData.supplierName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" placeholder="Nhập email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input type="text" name="numberPhone" placeholder="Nhập số điện thoại" value={formData.numberPhone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Mô tả nhà cung cấp:</label>
                        <input type="text" name="description" placeholder="Nhập mô tả" value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Mã số thuế:</label>
                        <input type="text" name="taxCode" placeholder="Mã số thuế" value={formData.taxCode} onChange={handleChange} />
                    </div>
                </div>
                <div className="supplier-form-section col-6">
                    <h3>Địa chỉ</h3>
                    <div className="form-group">
                        <label>Đường:</label>
                        <input type="text" name="lane" placeholder="Nhập tên đường" value={formData.lane} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Khu vực:</label>
                        <input type="text" name="area" placeholder="Nhập khu vực" value={formData.area} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Thành phố:</label>
                        <input type="text" name="city" placeholder="Nhập thành phố" value={formData.city} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ khác:</label>
                        <input type="text" name="addressOthers" placeholder="Nhập mã số thuế" value={formData.addressOthers} onChange={handleChange} />
                    </div>
                </div>
            </div>
            <div className="form-footer">
                <button className="btn-save" onClick={handleSubmit}>Lưu</button>
                <button className="btn-cancel" onClick={handleCancel}>Hủy</button>
            </div>
        </div>
    );
};

export default SupplierForm;
