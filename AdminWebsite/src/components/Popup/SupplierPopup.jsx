import React from "react";
import "../Styles/Styles.css";

const SupplierPopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <div className="popup-supplier-body">
                    <div className="popup-supplier-right col-12">
                        <div className="popup-content">
                            <h3>Thông tin chung</h3>
                            <div className="form-group">
                                <label>Tên nhà cung cấp *</label>
                                <input type="text" placeholder="Nhập tên nhà cung cấp" />
                            </div>
                            <div className="abc">
                                <div className="form-row col-12" style={{flexWrap:'nowrap', columnGap:'0px', justifyContent:'space-between'}}>
                                    <div className="form-group col-5">
                                        <label>Mã nhà cung cấp</label>
                                        <input type="text" placeholder="Nhập mã nhà cung cấp" />
                                    </div>
                                    <div className="form-group col-5">
                                        <label>Số điện thoại</label>
                                        <input type="text" placeholder="Nhập số điện thoại" />
                                    </div>
                                </div>
                                <div className="form-row col-12" style={{flexWrap:'nowrap', columnGap:'0px' , justifyContent:'space-between'}}>
                                    <div className="form-group col-5">
                                        <label>Email</label>
                                        <input type="email" placeholder="Nhập email" />
                                    </div>
                                    <div className="form-group col-5">
                                        <label>Số fax</label>
                                        <input type="text" placeholder="Số fax" />
                                    </div>

                                </div>
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ cụ thể</label>
                                <input type="text" placeholder="Nhập địa chỉ cụ thể" />
                            </div>
                        </div>

                    </div>
                    {/* <div className="supplier-left col-6">
                        <h3>Địa chỉ</h3>
                        <div className="form-group">
                            <label>Quốc gia</label>
                            <select>
                                <option>Vietnam</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Khu vực</label>
                                <select>
                                    <option>Chọn khu vực</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Phường xã</label>
                                <select>
                                    <option>Chọn phường xã</option>
                                </select>
                            </div>
                        </div>

                    </div> */}
                </div>
                <div className="popup-footer">
                    <button className="btn-save">Lưu</button>
                    <button className="btn-cancel" onClick={onClose}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default SupplierPopup;
