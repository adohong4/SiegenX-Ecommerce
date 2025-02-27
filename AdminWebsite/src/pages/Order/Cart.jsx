import React, { useEffect, useContext, useState, useRef } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { formatHourDayTime } from '../../lib/utils';
const Cart = () => {
    const { url, order_list, fetchOrder } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalPages, setTotalPages] = useState(0); // Theo dõi tổng số trang
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState({ 'address.fullname': 'asc', amount: 'asc' });
    const [selectedRow, setSelectedRow] = useState(null); // Lưu thông tin hàng được chọn
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Trạng thái mở/đóng popup
    const popupRef = useRef(null); // Tạo ref cho popup
    axios.defaults.withCredentials = true;

    const handlePrint = () => {
        if (popupRef.current) {
            const printContent = popupRef.current.innerHTML;
            const originalContent = document.body.innerHTML;
            // Chuyển nội dung popup vào body để in
            document.body.innerHTML = printContent;
            // Thực hiện in
            window.print();
            // Khôi phục nội dung ban đầu
            document.body.innerHTML = originalContent;
            window.location.reload(); // Reload lại trang sau khi in xong
        }
    };

    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            await fetchListpage();
            return;
        }

        try {
            const response = await axios.get(`${url}/v1/api/profile/order/id`, {
                params: { id: searchTerm, page: currentPage, limit: 10 }
            });

            if (response.data.status) {
                if (Array.isArray(response.data.data)) {
                    setList(response.data.data);
                    setTotalPages(response.data.pagination.totalPages); // Cập nhật tổng số trang
                    // toast.success(response.data.message);
                } else {
                    setList([]);
                    setTotalPages(0); // Đặt số trang về 0 nếu không có kết quả
                    toast.error("Không tìm thấy hóa đơn");
                }
            } else {
                setList([]);
                toast.error("Tìm kiếm thất bại");
            }
        } catch (error) {
            setList([]); // Gán giá trị rỗng khi xảy ra lỗi
            setTotalPages(0);
            // toast.error("Lỗi trong quá trình tìm kiếm");
        }
    };

    const statusHandler = async (event, orderId) => {
        const selectedValue = event.target.value;

        const response = await axios.put(url + "/v1/api/profile/order/update", {
            orderId,
            status: selectedValue
        });

        if (response.data.status) {
            fetchListpage();
        }
    };

    const removeOrder = async (id) => {
        const response = await axios.delete(`${url}/v1/api/profile/order/status/${id}`);
        if (response.data.status) {
            toast.success(response.data.message);
            fetchListpage(currentPage);
        }
    };

    const sortBy = (field) => {
        const newOrder = sortOrder[field] === 'asc' ? 'desc' : 'asc';
        setSortOrder({ ...sortOrder, [field]: newOrder });
        const sortedList = [...list].sort((a, b) => {
            const aValue = field.includes('.') ? field.split('.').reduce((o, i) => o[i], a) : a[field];
            const bValue = field.includes('.') ? field.split('.').reduce((o, i) => o[i], b) : b[field];
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return newOrder === 'asc' ? aValue - bValue : bValue - aValue;
            } else {
                return newOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
        });
        setList(sortedList);
    };

    const openPopup = (row) => {
        setSelectedRow(row);
        setIsPopupOpen(true);
        document.body.classList.add('popup-open');
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedRow(null);
        document.body.classList.remove('popup-open');
    };

    const fetchListpage = async (page = 1, limit = 10) => {
        const response = await axios.get(`${url}/v1/api/profile/order/paginate?page=${page}&limit=${limit}`);
        if (response.data.message) {
            setList(response.data.metadata.order);
            setTotalOrder(response.data.metadata.limit);
            setTotalPages(response.data.metadata.totalPages);
        }
    };

    useEffect(() => {
        if (searchTerm.trim()) {
            handleSearch();
        } else {
            fetchListpage(currentPage);
        }
    }, [currentPage, searchTerm]);

    return (
        <div className='order-list-container'>

            <div className='search'>
                <div className='search-CSKH'>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm ..."
                        className='search-input'
                    />
                    <button onClick={handleSearch} className='btn-search'>
                        Tìm kiếm
                    </button>
                </div>
            </div>

            <table className="order-list-table">
                <thead>
                    <tr className="table-header">
                        <th onClick={() => sortBy('_id')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                            Mã hóa đơn {sortOrder._id === 'asc' ? '↑' : '↓'}
                        </th>
                        <th onClick={() => sortBy('createdAt')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                            Thời gian {sortOrder.createdAt === 'asc' ? '↑' : '↓'}
                        </th>
                        <th onClick={() => sortBy('address.fullname')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                            Khách hàng {sortOrder['address.fullname'] === 'asc' ? '↑' : '↓'}
                        </th>
                        <th>Hình thức thanh toán</th>
                        <th onClick={() => sortBy('amount')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                            Giá trị hóa đơn {sortOrder.amount === 'asc' ? '↑' : '↓'}
                        </th>
                        <th style={{ cursor: 'pointer', textAlign: 'center' }}>Địa chỉ</th>
                        <th style={{ cursor: 'pointer', textAlign: 'center' }}>Trạng thái</th>
                        <th style={{ cursor: 'pointer', textAlign: 'center' }}>Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((item) => (
                        <tr key={item._id} className='table-row'>
                            <td>{item._id}</td>
                            <td>{formatHourDayTime(item.createdAt)}</td>
                            <td>{item.address.fullname}</td>
                            <td>{item.paymentMethod}</td>
                            <td>{(item.amount).toLocaleString()} đ</td>
                            <td>{item.address.street}, {item.address.state}, {item.address.country}, {item.address.zipcode}</td>
                            <td><select
                                onChange={(event) => statusHandler(event, item._id)}
                                value={item.status}
                                style={{
                                    backgroundColor: item.status === "Đợi xác nhận" ? "#2c3e50" :
                                        item.status === "Đang chuẩn bị hàng" ? "#d35400" :
                                            item.status === "Đang giao hàng" ? "#f39c12" :
                                                item.status === "Giao hàng thành công" ? "#27ae60" : "#ecf0f1",
                                    color: ["Đợi xác nhận", "Đang chuẩn bị hàng", "Đang giao hàng", "Giao hàng thành công"].includes(item.status) ? "white" : "black"
                                }}
                            >
                                <option value="Đợi xác nhận">Đợi xác nhận</option>
                                <option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</option>
                                <option value="Đang giao hàng">Đang giao hàng</option>
                                <option value="Giao hàng thành công">Giao hàng thành công</option>
                            </select></td>
                            <td className="btn-order" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", verticalAlign: "middle", padding: '15px 0px' }}>
                                <button onClick={(e) => { e.stopPropagation(); removeOrder(item._id); }} className='btn-delete'>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button type="button" onClick={() => openPopup(item)} className='btn-info'>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={(e) => setCurrentPage(e.selected + 1)}
                pageRangeDisplayed={5}
                pageCount={totalPages}
                previousLabel="<"
                renderOnZeroPageCount={null}
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
            />


            {isPopupOpen && selectedRow && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content-cskh" onClick={(e) => e.stopPropagation()}
                        ref={popupRef}>
                        <button className="close-popup" onClick={closePopup}>×</button>
                        <div className="popup-header">
                            <h3>Chi tiết hóa đơn</h3>
                        </div>
                        <div className="popup-body">
                            <div className="popup-info">
                                <label><strong>Mã hóa đơn:</strong></label>
                                <p>{selectedRow._id}</p>
                            </div>
                            <div className="popup-info">
                                <label><strong>Thời gian:</strong></label>
                                <p>{selectedRow.date}</p>
                            </div>
                            <div className="popup-info">
                                <label><strong>Khách hàng:</strong></label>
                                <p>{selectedRow.address?.fullname || 'Không có thông tin'}</p>
                            </div>
                            <div className="popup-info">
                                <label><strong>Hình thức thanh toán:</strong></label>
                                <p>{selectedRow.paymentMethod || 'Không có thông tin'}</p>
                            </div>
                            <div className="popup-info">
                                <label><strong>Giá trị đơn hàng:</strong></label>
                                <p>{(selectedRow.amount).toLocaleString()} VND</p>
                            </div>
                            <div className="popup-info" style={{ display: 'block' }}>
                                <label><strong>Địa chỉ:</strong></label>
                                <p>
                                    {selectedRow.address?.street}, {selectedRow.address?.state}, {selectedRow.address?.country}, {selectedRow.address?.zipcode}
                                </p>
                            </div>
                            <div className="popup-info" style={{ display: 'block' }}>
                                <label><strong>Sản phẩm đã mua:</strong></label>
                                {selectedRow.items && selectedRow.items.length > 0 ? (
                                    <table className="product-table">
                                        <thead>
                                            <tr>
                                                <th>Tên sản phẩm</th>
                                                <th>Số lượng</th>
                                                <th>Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedRow.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.nameProduct}</td>
                                                    <td style={{ textAlign: 'center' }} >{item.quantity}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.price.toLocaleString()} </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Không có sản phẩm nào.</p>
                                )}
                            </div>
                            <div className="popup-footer">
                                <div className="popup-printf">
                                    <button onClick={handlePrint} className="popup-print-btn">In hóa đơn</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Cart;