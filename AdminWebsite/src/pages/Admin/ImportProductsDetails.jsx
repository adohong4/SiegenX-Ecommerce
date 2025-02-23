import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const suppliers = [
    { id: "NCC001", name: "Nhà cung cấp A", email: "a@supplier.com", phone: "0123456789" },
    { id: "NCC002", name: "Nhà cung cấp B", email: "b@supplier.com", phone: "0987654321" }
];

const products = [
    { id: "SP001", name: "Laptop Dell", image: "https://via.placeholder.com/50" },
    { id: "SP002", name: "Chuột Logitech", image: "https://via.placeholder.com/50" }
];

const CreateImportOrder = () => {
    const navigate = useNavigate();
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("Chờ đợi");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [createdDate, setCreatedDate] = useState("");

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setCreatedDate(today);
    }, []);

    const handleProductChange = (productId, field, value) => {
        setSelectedProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId ? { ...product, [field]: value } : product
            )
        );
    };

    const handleAddProduct = (product) => {
        if (!selectedProducts.find((p) => p.id === product.id)) {
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1, price: 0, discount: 0, tax: 10 }]);
        }
    };
    const handleSaveOrder = () => {
        if (!selectedSupplier) {
          alert("Vui lòng chọn nhà cung cấp!");
          return;
        }
        if (selectedProducts.length === 0) {
          alert("Vui lòng thêm ít nhất một sản phẩm!");
          return;
        }
        alert("Đơn hàng đã được thêm thành công!");
        navigate(-1);
      };
    
    const calculateTotal = () => {
        return selectedProducts.reduce((total, product) => {
            const totalPrice = (product.quantity * product.price) - product.discount + ((product.quantity * product.price) * (product.tax / 100));
            return total + totalPrice;
        }, 0);
    };

    return (
        <div className="create-import-order-container">
            <div className="create-import-order-header">
                <button onClick={() => navigate(-1)} className="create-import-order-back-button">← Quay lại</button>
            </div>

            <div className="create-import-order-grid">
                <div className="create-import-order-card create-import-order-span-2 col-9">
                    <h3>Sản phẩm</h3>
                    <select className="create-import-order-input" onChange={(e) => {
                        const product = products.find(p => p.id === e.target.value);
                        if (product) handleAddProduct(product);
                    }}>
                        <option value="">Chọn sản phẩm</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>

                    {selectedProducts.length > 0 && (
                        <table className="create-import-order-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ảnh</th>
                                    <th>Tên</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thuế</th>
                                    <th>Tổng</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody >
                                {selectedProducts.map(product => (
                                    <tr key={product.id} >
                                        <td>{product.id}</td>
                                        <td><img src={product.image} alt={product.name} width="50" /></td>
                                        <td>{product.name}</td>
                                        <td style={{display:'flex', gap:'10px', justifyContent:'center', alignItems:'center', marginTop:'10px'}}>
                                            <button onClick={() => handleProductChange(product.id, "quantity", Math.max(1, product.quantity - 1))} style={{color:'green'}}>-</button>
                                            {product.quantity}
                                            <button onClick={() => handleProductChange(product.id, "quantity", product.quantity + 1)} style={{color:'red'}}>+</button>
                                        </td>
                                        <td><input type="number" value={product.price} onChange={(e) => handleProductChange(product.id, "price", parseFloat(e.target.value))} style={{width:'fit-content', padding:' 0px 10px'}}/></td>                                        <td>
                                            <select value={product.tax} onChange={(e) => handleProductChange(product.id, "tax", parseFloat(e.target.value))} style={{width:'fit-content', padding:' 0px 10px'}}>
                                                <option value={5}>5%</option>
                                                <option value={10}>10%</option>
                                                <option value={15}>15%</option>
                                            </select>
                                        </td>
                                        <td className="col-2">{(product.quantity * product.price) + ((product.quantity * product.price) * (product.tax / 100))}đ</td>
                                        <td><FontAwesomeIcon icon={faTrash} onClick={() => setSelectedProducts(selectedProducts.filter(p => p.id !== product.id))} className="btn-delete-product-details"/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="total-import-product">
                        <h3>Tổng giá trị đơn hàng: {calculateTotal()}đ</h3>
                    </div>
                </div>

                <div className="create-import-order col-3">
                    <div className="create-import-order-card">
                        <h3>Nhà cung cấp</h3>
                        <select className="create-import-order-input" onChange={(e) => {
                            const supplier = suppliers.find(s => s.id === e.target.value);
                            setSelectedSupplier(supplier);
                        }}>
                            <option value="">Chọn nhà cung cấp</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                            ))}
                        </select>

                        {selectedSupplier && (
                            <div className="create-import-order-supplier-info">
                                <p><strong>ID:</strong> {selectedSupplier.id}</p>
                                <p><strong>Tên:</strong> {selectedSupplier.name}</p>
                                <p><strong>Email:</strong> {selectedSupplier.email}</p>
                                <p><strong>Điện thoại:</strong> {selectedSupplier.phone}</p>
                            </div>
                        )}
                    </div>

                    <div className="create-import-order-card">
                        <h3>Ngày tạo</h3>
                        <input type="date" className="create-import-order-input" value={createdDate} readOnly />
                    </div>
                    <div className="create-import-order-card">
                        <h3>Trạng thái thanh toán</h3>
                        <select className="create-import-order-input" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                            <option value="Chờ đợi">Chờ đợi</option>
                            <option value="Thanh toán 1 nửa">Thanh toán 1 nửa</option>
                            <option value="Thanh toán">Thanh toán</option>
                        </select>
                    </div>
                </div>

            </div>
            <button className="btn-save" onClick={handleSaveOrder}>Thêm đơn hàng</button>
        </div>
    );
};

export default CreateImportOrder;
