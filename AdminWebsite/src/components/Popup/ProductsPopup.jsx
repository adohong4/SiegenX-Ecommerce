import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import { formatDayTime, formatHourDayTime } from '../../lib/utils';
import { StoreContext } from '../../context/StoreContext';

const ProductPopup = ({ isOpen, onClose, productId }) => {
    const { fetchProductId, product_id, updateProductId } = useContext(StoreContext);
    const [updatedProduct, setUpdatedProduct] = useState({});

    useEffect(() => {
        if (productId) fetchProductId(productId);
    }, [productId]);

    useEffect(() => {
        setUpdatedProduct(product_id || {});
    }, [product_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        await updateProductId(productId, updatedProduct);
        alert("update thành công")
        onClose();
    };

    const handleImageChange = (index, event) => {
        if (event.target.files[0]) {
            const newImages = [...(updatedProduct.images || [])];
            newImages[index] = event.target.files[0].name;
            setUpdatedProduct(prev => ({ ...prev, images: newImages }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-products-overlay" onClick={onClose}>
            <div className="popup-products-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>

                <h2 className="popup-title">Chỉnh Sửa Sản Phẩm</h2>

                <div className="product-images">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="image-container">
                            <img src={`http://localhost:9003/images/${updatedProduct.images?.[index] || 'default.jpg'}`} alt="" className="popup-image" />
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e)} className="image-upload-input" />
                        </div>
                    ))}
                </div>
                <div className='products-infor'>
                    <div className='form-products-left'>
                        <div className='form-product'>
                            {[['title', 'Tên Sản Phẩm'], ['price', 'Giá'], ['quantity', 'Số Lượng']].map(([key, label]) => (
                                <div key={key} className="form-group">
                                    <label>{label}:</label>
                                    <input type="text" name={key} value={updatedProduct[key] || ''} onChange={handleChange} />
                                </div>
                            ))}
                            <label>Mô Tả ngắn:</label>
                            <textarea name="description" value={updatedProduct.recap || ''} onChange={handleChange} />
                        </div>
                        <div className="form-products-group-des">
                            <label>Mô Tả:</label>
                            <textarea
                                name="description"
                                value={updatedProduct.description || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='technical-specs-right'>
                        <h3 className="technical-specs-title">Thông Số Kỹ Thuật</h3>
                        <div className="technical-specs">
                            {[
                                'mainBoard', 'chip', 'cpu', 'gpu', 'ram', 'memory',
                                'version', 'ports', 'displaySize', 'pixelDensity',
                                'display', 'refreshRate'
                            ].map((field) => (
                                <div className="form-products-group" key={field}>
                                    <label>{field}:</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={updatedProduct[field] || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* <div className="form-products-actions">
                    <button className="save-button" onClick={handleSave}>
                        Lưu Thay Đổi
                    </button>
                </div> */}
                {/* Bảng lịch sử hoạt động từ contact.creator */}
                {updatedProduct.creator && updatedProduct.creator.length > 0 && (
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
                                {updatedProduct.creator.map((entry) => (
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
        </div>
    );
};

export default ProductPopup;