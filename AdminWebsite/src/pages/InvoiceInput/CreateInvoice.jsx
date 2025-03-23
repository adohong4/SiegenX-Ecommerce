import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDayTime, formatCurrency } from '../../lib/utils'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const CreateImportOrder = () => {
    const { url, product_list, supplier_list } = useContext(StoreContext);
    const navigate = useNavigate();
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [createdDate, setCreatedDate] = useState(""); const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [partialPayment, setPartialPayment] = useState(0);
    const [valueInvoice, setValueInvoice] = useState(0);
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setCreatedDate(today);
    }, []);

    useEffect(() => {
        setValueInvoice(calculateTotal()); // Cập nhật giá trị hóa đơn khi danh sách sản phẩm thay đổi
    }, [selectedProducts]);

    // Xử lý tìm kiếm
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim() === "") {
            setFilteredProducts([]);
        } else {
            const filtered = product_list.filter(product =>
                product.nameProduct.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    const handleProductChange = (productId, field, value) => {
        setSelectedProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === productId ? { ...product, [field]: value } : product
            )
        );
    };

    const handleAddProduct = (product) => {
        if (!selectedProducts.find((p) => p._id === product._id)) {
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1, price: 0, tax: 10 }]);
        }
        setSearchTerm("");
        setFilteredProducts([]);
    };

    const handleSaveOrder = async () => {
        const requestData = {
            statusPayment: paymentStatus,
            supplierId: {
                supplierId: selectedSupplier._id
            },
            productIds: selectedProducts.map(product => ({
                productId: product._id,
                count: product.quantity,
                priceInput: product.price,
                tax: product.tax / 100
            })),
            partialPayment: partialPayment,
            valueInvoice: valueInvoice
        };

        try {
            const response = await axios.post(`${url}/v1/api/product/invoice/create`, requestData);
            if (response.status === 201 || response.status === 200) {
                toast.success("Đơn hàng đã được thêm thành công!");
                navigate(-1);
            } else {
                toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            alert(error.response.data.message);
        }
    };


    const calculateTotal = () => {
        return selectedProducts.reduce((total, product) => {
            const totalPrice = (product.quantity * product.price) + ((product.quantity * product.price) * (product.tax / 100));
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
                    <input
                        type="text"
                        className="create-import-order-input"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {filteredProducts.length > 0 && (
                        <ul className="search-suggestions">
                            {filteredProducts.map(product => (
                                <li key={product._id} onClick={() => handleAddProduct(product)}>
                                    <img src={`http://localhost:9003/images/${product.images[0]}`} width="50" alt={product.nameProduct} />
                                    {product.nameProduct}
                                </li>
                            ))}
                        </ul>
                    )}

                    {selectedProducts.length > 0 && (
                        <table className="create-import-order-table">
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Ảnh</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thuế</th>
                                    <th>Tổng</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProducts.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.nameProduct}</td>
                                        <td><img src={`http://localhost:9003/images/${product.images[0]}`} width="50" alt={product.nameProduct} /></td>
                                        <td style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", height:"80px"}}>
                                            <button onClick={() => handleProductChange(product._id, "quantity", Math.max(1, product.quantity - 1))} style={{ color: "green" }}>-</button>
                                            <span>{product.quantity}</span>
                                            <button onClick={() => handleProductChange(product._id, "quantity", product.quantity + 1)} style={{ color: "red" }}>+</button>
                                        </td>
                                        <td><input type="number" value={product.price} onChange={(e) => handleProductChange(product._id, "price", parseFloat(e.target.value))} style={{ width: "fit-content", padding: "5px" }} /></td>
                                        <td style={{display:"flex", height:"80px", alignItems:"center"}}>
                                            <input type="number" value={product.tax} min="0" max="100"
                                                onChange={(e) => handleProductChange(product._id, "tax", parseFloat(e.target.value))}
                                                style={{ width: "50px", padding: "5px", textAlign: "right" }}
                                            />%
                                        </td>
                                        <td className="col-2">{formatCurrency(product.quantity * product.price + (product.quantity * product.price * (product.tax / 100)))} đ</td>
                                        <td><FontAwesomeIcon icon={faTrash} onClick={() => setSelectedProducts(selectedProducts.filter((p) => p._id !== product._id))} className="btn-delete-product-details" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}
                    <div className="total-import-product">
                        <h3>Tổng giá trị đơn hàng: {formatCurrency(valueInvoice)}đ</h3>
                    </div>
                </div>

                <div className="create-import-order col-3">
                    <div className="create-import-order-card">
                        <h3>Nhà cung cấp</h3>
                        <select className="create-import-order-input" onChange={(e) => {
                            const supplier = supplier_list.find(s => s._id === e.target.value);
                            setSelectedSupplier(supplier);
                        }}>
                            <option value="">Chọn nhà cung cấp</option>
                            {supplier_list.map(supplier => (
                                <option key={supplier._id} value={supplier._id}>{supplier.supplierName}</option>
                            ))}
                        </select>

                        {selectedSupplier && (
                            <div className="create-import-order-supplier-info">
                                <p><strong>ID:</strong> {selectedSupplier._id}</p>
                                <p><strong>Tên:</strong> {selectedSupplier.supplierName}</p>
                                <p><strong>Email:</strong> {selectedSupplier.email}</p>
                                <p><strong>Điện thoại:</strong> {selectedSupplier.numberPhone}</p>
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
                            <option value="pending">Chưa xử lý</option>
                            <option value="partial payment">Thanh toán một phần</option>
                            <option value="completed">Đã thanh toán</option>
                        </select>
                        {paymentStatus === "partial payment" && (
                            <div className="partial-payment-input">
                                <label htmlFor="partialPayment">Số tiền đã thanh toán:</label>
                                <input
                                    type="number"
                                    id="partialPayment"
                                    value={partialPayment}
                                    onChange={(e) => setPartialPayment(parseFloat(e.target.value))}
                                    placeholder="Nhập số tiền"
                                    className="create-import-order-input"
                                />
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <button className="btn-save" onClick={handleSaveOrder}>Thêm đơn hàng</button>
        </div>
    );
};

export default CreateImportOrder;
