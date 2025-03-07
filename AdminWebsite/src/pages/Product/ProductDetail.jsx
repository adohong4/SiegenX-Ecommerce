import React, { useEffect, useContext, useState } from 'react';
import { useParams } from "react-router-dom";
import { formatHourDayTime } from '../../lib/utils';
import { StoreContext } from '../../context/StoreContext';
import '../styles/styles.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { fetchProductId, product_id, updateProductId } = useContext(StoreContext);
    const [updatedProduct, setUpdatedProduct] = useState({});

    useEffect(() => {
        if (id) fetchProductId(id);
    }, [id]);

    useEffect(() => {
        setUpdatedProduct(product_id || {});
    }, [product_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index, event) => {
        if (event.target.files[0]) {
            const newImages = [...(updatedProduct.images || [])];
            newImages[index] = event.target.files[0].name;
            setUpdatedProduct(prev => ({ ...prev, images: newImages }));
        }
    };

    const handleSave = async () => {
        await updateProductId(id, updatedProduct);
        alert("Cập nhật thành công!");
    };

    if (!product_id) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="product-details-container">
            <div className="product-details-grid">
                <div className="product-images-section">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="image-wrapper">
                            <label className="image-upload-label">
                                <img
                                    src={`http://localhost:9003/images/${product_id.images?.[index] || 'default.jpg'}`}
                                    alt={`Sản phẩm ${index + 1}`}
                                    className="product-image"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(index, e)}
                                    className="upload-input"
                                />
                            </label>
                        </div>
                    ))}
                </div>


                <div className='product-info-section'>
                    <h2>{updatedProduct.title}</h2>
                    <div className='top-info'>
                        {/* Tách Tên Sản Phẩm ra dòng riêng */}
                        <div className="form-field col-12">
                            <label>Tên Sản Phẩm:</label>
                            <input type="text" name="title" value={updatedProduct.title || ''} onChange={handleChange} />
                        </div>

                        {/* Các trường còn lại */}
                        <div className="form-row">
                            {[['price', 'Giá'], ['quantity', 'Số Lượng']].map(([key, label]) => (
                                <div key={key} className="form-field col-6">
                                    <label>{label}:</label>
                                    <input type="text" name={key} value={updatedProduct[key] || ''} onChange={handleChange} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '0 10px' }}>
                        <label>Mô tả ngắn:</label>
                        <textarea name="recap" value={updatedProduct.recap || ''} onChange={handleChange} />
                    </div>
                    <div style={{ padding: '0 10px' }}>
                        <label>Mô tả chi tiết:</label>
                        <textarea name="description" value={updatedProduct.description || ''} onChange={handleChange} />
                    </div>
                    <div className='product-specs'>
                        <h2>Thông Số Kỹ Thuật</h2>
                        <div className="specs-list">
                            {['mainBoard', 'chip', 'cpu', 'gpu', 'ram', 'memory',
                                'version', 'ports', 'displaySize', 'pixelDensity',
                                'display', 'refreshRate'].map((field) => (
                                    <div className="specs-field" key={field}>
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
                    {product_id.creator && product_id.creator.length > 0 && (
                        <div className="history-section">
                            <h2>Lịch sử liên hệ</h2>
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Nhân viên</th>
                                        <th>Mô tả</th>
                                        <th>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product_id.creator.map((entry) => (
                                        <tr key={entry._id}>
                                            <td>{entry.createdName}</td>
                                            <td>{entry.description}</td>
                                            <td>{formatHourDayTime(entry.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Nút lưu */}
                    <div className="save-section">
                        <button className="save-btn" onClick={handleSave}>Lưu Thay Đổi</button>
                    </div>
                </div>



            </div>



        </div>
    );
};

export default ProductDetails;