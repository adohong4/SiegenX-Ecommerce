import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { formatDayTime, formatCurrency } from '../../lib/utils';

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { url, supplier_list } = useContext(StoreContext);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [invoiceStatus, setStatus] = useState("pending");
    const [invoice, setInvoice] = useState(null);
    const [createdDate, setCreatedDate] = useState("");
    const [partialPayment, setPartialPayment] = useState(0);
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchInvoiceId = async () => {
            try {
                const response = await axios.get(`${url}/v1/api/product/invoice/get/${id}`);
                setInvoice(response.data.metadata);
            } catch (error) {
                console.error("Lỗi khi lấy hóa đơn nhập:", error);
            }
        };
        fetchInvoiceId();
    }, [id, url]);

    useEffect(() => {
        if (invoice) {
            setSelectedSupplier(supplier_list.find(s => s._id === invoice.supplierId?.[0]?.supplierId) || null);
            setPaymentStatus(invoice.statusPayment);
            setStatus(invoice.status);
            setCreatedDate(invoice.inputDate ? invoice.inputDate.split("T")[0] : "");
            setSelectedProducts(invoice.productIds.map(prod => ({
                _id: prod.productId,
                nameProduct: prod.nameProduct,
                quantity: prod.count,
                price: prod.priceInput,
                tax: prod.tax * 100,
                images: [prod.imageProduct]
            })));
        }
    }, [invoice, supplier_list]);

    const calculateTotal = () => {
        return selectedProducts.reduce((total, product) => {
            return total + (product.quantity * product.price * (1 + product.tax / 100));
        }, 0);
    };

    const handlePushTheNumberOfProduct = async () => {
        try {
            console.log("Đầu");
            const response = await axios.put(`${url}/v1/api/product/invoice/push/${id}`);
            console.log("giữa");
            if (response.status === 200 || response.status === 201) {
                toast.success("Số lượng nhập kho thành công thành công!");
                navigate(-1);
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật đơn hàng!");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const handleSaveOrder = async () => {
        if (!selectedSupplier) {
            toast.error("Vui lòng chọn nhà cung cấp!");
            return;
        }
        if (selectedProducts.length === 0) {
            toast.error("Vui lòng thêm ít nhất một sản phẩm!");
            return;
        }

        const requestData = {
            statusPayment: paymentStatus,
            status: invoiceStatus,
            partialPayment: partialPayment
        };

        try {
            const response = await axios.put(`${url}/v1/api/product/invoice/update/${id}`, requestData);
            if (response.status === 200 || response.status === 201) {
                toast.success("Đơn hàng đã được cập nhật thành công!");
                navigate(-1);
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật đơn hàng!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật đơn hàng:", error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="create-import-order-container">
            <div className="create-import-order-header">
                <button onClick={() => navigate(-1)} className="create-import-order-back-button">← Quay lại</button>
            </div>

            {invoice?.valueInvoice > 0 && (
                <p className={`payment-status ${paymentStatus}`}>
                    Đơn nhập hàng
                    {paymentStatus === 'pending'
                        ? " chưa thanh toán"
                        : paymentStatus === 'partial payment'
                        ? " thanh toán một phần"
                        : " thanh toán thành công"}
                </p>
            )}


            {invoice?.valueInvoice > 0 && (
                <div className="create-import-order-summary col-12" style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>Tiền cần trả NCC: {formatCurrency(invoice.valueInvoice)}</div>
                <div style={{ flex: 1 }}>Đã trả: {formatCurrency(invoice.partialPayment)}</div>
                <div style={{ flex: 1 }}>Còn phải trả: {formatCurrency(invoice.valueInvoice - invoice.partialPayment)}</div>
            </div>
            
            )}

            <div className="create-import-order-grid">
                <div className="create-import-order-card col-9">
                    <h3>Sản phẩm</h3>
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
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProducts.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.nameProduct}</td>
                                        <td><img src={`http://localhost:9003/images/${product.images[0]}`} width="50" alt={product.nameProduct} /></td>
                                        <td>{product.quantity}</td>
                                        <td>{formatCurrency(product.price)} đ</td>
                                        <td>{product.tax}%</td>
                                        <td>{formatCurrency(product.quantity * product.price * (1 + product.tax / 100))} đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className='create-import-order-total'>
                        <div className="total-import-product">
                            <h3>Tổng giá trị đơn hàng: {formatCurrency(calculateTotal())}đ</h3>
                        </div>
                        <div>
                            <button onClick={handlePushTheNumberOfProduct}>Nhập hàng</button>
                        </div>
                    </div>
                    <div>
                        <h3>Lịch sử thay đổi</h3>
                        {invoice?.creator.length > 0 && (
                            <table className="create-import-order-table">
                                <thead>
                                    <tr>
                                        <th>Tên nhân viên</th>
                                        <th>Mô tả</th>
                                        <th>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.creator.map((creator) => (
                                        <tr key={creator._id}>
                                            <td>{creator.createdName}</td>
                                            <td>{creator.description}</td>
                                            <td>{formatDayTime(creator.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="create-import-order-card-right col-3">
                    <h3>Nhà cung cấp</h3>
                    {selectedSupplier ? (
                        <div className='nhacungcap-info'>
                            <p><strong>ID:</strong> {selectedSupplier._id}</p>
                            <p><strong>Tên:</strong> {selectedSupplier.supplierName}</p>
                            <p><strong>Email:</strong> {selectedSupplier.email}</p>
                            <p><strong>Điện thoại:</strong> {selectedSupplier.numberPhone}</p>
                        </div>
                    ) : <p>Chưa có nhà cung cấp</p>}

                    <div className="create-import-order-card">
                        <h3>Ngày tạo</h3>
                        <input type="date" className="create-import-order-input" value={createdDate} readOnly />
                    </div>
                    <div className="create-import-order-card">
                        <h3>Trạng thái thanh toán</h3>
                        <select
                            className="create-import-order-input"
                            value={paymentStatus}
                            onChange={(e) => {
                                if (paymentStatus !== "completed") {
                                    setPaymentStatus(e.target.value);
                                }
                            }}
                            disabled={paymentStatus === "completed"}
                        >
                            <option value="pending">Chưa thanh toán</option>
                            <option value="partial payment">Thanh toán một phần</option>
                            <option value="completed">Thanh toán thành công</option>
                        </select>
                    </div>
                    {paymentStatus === "partial payment" && (
                        <div className="partial-payment-input">
                            <label htmlFor="partialPayment">Số tiền trả thêm:</label>
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

                    <div className="create-import-order-card">
                        <h3>Trạng thái đơn hàng</h3>
                        <select className="create-import-order-input" value={invoiceStatus} onChange={(e) => setStatus(e.target.value)}>
                            <option value="completed">Vận chuyển thành công</option>
                            <option value="active">Đang vận chuyển</option>
                            <option value="paused">Tạm dừng</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="cancelled">Đã bị hủy</option>
                            <option value="failed">Không thành công</option>
                        </select>
                    </div>
                    <button className="btn-save" onClick={handleSaveOrder}>Cập nhật đơn hàng</button>
                </div>
            </div>

        </div>
    );
};

export default InvoiceDetail;