import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ProductPopup = ({ product, onClose, url, onUpdate }) => {
    if (!product) return null;

    const [updatedProduct, setUpdatedProduct] = useState({ ...product });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            await onUpdate(updatedProduct);  // Gọi hàm cập nhật sản phẩm
            onClose();
        } catch (error) {
            console.error('Error updating product:', error);  // Log lỗi để dễ debug
            toast.error('Cập nhật sản phẩm thất bại!');
        }
    };

    const images = updatedProduct.images || [];
    const imageSrcs = [
        images[0] ? `${url}/images/${images[0]}` : 'default-image-path.jpg',
        images[1] ? `${url}/images/${images[1]}` : 'default-image-path.jpg',
        images[2] ? `${url}/images/${images[2]}` : 'default-image-path.jpg'
    ];

    const handleImageChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const newImages = [...updatedProduct.images];
            newImages[index] = file.name; // Update with file name or a path after upload
            setUpdatedProduct((prev) => ({
                ...prev,
                images: newImages
            }));
        }
    };

    return (
        <div className="popup-products-overlay" onClick={onClose}>
            <div className="popup-products-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>

                <h2 className="popup-title">Chỉnh Sửa Sản Phẩm</h2>

                <div className="product-images">
                    {imageSrcs.map((src, index) => (
                        <div key={index} className="image-container">
                            <img src={src} alt={`Product Image ${index + 1}`} className="popup-image" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(index, e)}
                                className="image-upload-input"
                            />
                        </div>
                    ))}
                </div>
                <div className='products-infor'>
                    <div className='form-products-left'>
                        <div className="form-products">
                            <div className="form-products-group">
                                <label>Tên Sản Phẩm:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={updatedProduct.title || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-products-group">
                                <label>Danh Mục:</label>
                                <select
                                    name="category"
                                    value={updatedProduct.category || ''}
                                    onChange={handleChange}
                                >
                                    <option value="Màn hình LED">Màn hình LED</option>
                                    <option value="MH tương tác">MH tương tác</option>
                                    <option value="MH quảng cáo LCD">MH quảng cáo LCD</option>
                                    <option value="Quảng cáo 3D (OOH)">Quảng cáo 3D (OOH)</option>
                                    <option value="KTV 5D">KTV 5D</option>
                                </select>
                            </div>

                            <div className="form-products-group">
                                <label>Giá:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={updatedProduct.price || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-products-group">
                                <label>Số Lượng:</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={updatedProduct.quantity || ''}
                                    onChange={handleChange}
                                />
                            </div>

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
                <div className="form-products-actions">
                    <button className="save-button" onClick={handleSave}>
                        Lưu Thay Đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPopup;