import React, { useState } from "react";
import "../styles/styles.css";

const SupplierForm = () => {
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
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!formData.supplierName) {
            setError("Tên nhà cung cấp là bắt buộc.");
            setSuccess("");
            return;
        }
        setError("");
        setSuccess("Nhà cung cấp đã được thêm thành công!");

        setTimeout(() => {
            setSuccess("");
        }, 3000);
    };

    const handleCancel = () => {
        setFormData({
            supplierName: "",
            phone: "",
            email: "",
            address: "",
            taxCode: "",
            street: "",
            area: "",
            city: ""
        });
        setError("");
        setSuccess("");
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
            <div className="supplier-form-body">
                <div className="supplier-form-section col-6">
                    <h3>Thông tin chung</h3>
                    <div className="form-group">
                        <label>Tên nhà cung cấp *</label>
                        <input type="text" name="supplierName" placeholder="Nhập tên nhà cung cấp" value={formData.supplierName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="text" name="phone" placeholder="Nhập số điện thoại" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="Nhập email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ cụ thể</label>
                        <input type="text" name="address" placeholder="Nhập địa chỉ cụ thể" value={formData.address} onChange={handleChange} />
                    </div>
                </div>
                <div className="supplier-form-section col-6">
                    <h3>Địa chỉ</h3>
                    <div className="form-group">
                        <label>Mã số thuế</label>
                        <input type="text" name="taxCode" placeholder="Nhập mã số thuế" value={formData.taxCode} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Đường</label>
                        <input type="text" name="street" placeholder="Nhập tên đường" value={formData.street} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Khu vực</label>
                        <input type="text" name="area" placeholder="Nhập khu vực" value={formData.area} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Thành phố</label>
                        <input type="text" name="city" placeholder="Nhập thành phố" value={formData.city} onChange={handleChange} />
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
