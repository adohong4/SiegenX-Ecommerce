import React, { useEffect, useContext, useState, useCallback } from 'react';
import "../styles/styles.css";
import { formatDayTime, formatCurrency } from '../../lib/utils'
import { debounce } from 'lodash'
import ReactPaginate from 'react-paginate';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faInfoCircle, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

const ImportOrders = () => {
    const { url, deleteSoftInvoice, deleteInvoice } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [initialList, setInitialList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [sortOrder, setSortOrder] = useState({ name: 'asc', email: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    axios.defaults.withCredentials = true;

    const fetchInvoiceList = async (page = 1, limit = 8) => {
        try {
            const response = await axios.get(`${url}/v1/api/product/invoice/trash/paginate?page=${page}&limit=${limit}`);
            if (response.data.message) {
                setList(response.data.metadata.invoice);
                setInitialList(response.data.metadata.invoice);
                setTotalItems(response.data.metadata.totalInvoice);
                setTotalPages(response.data.metadata.totalPages);
            }
        } catch (error) {
            console.error('Xảy ra ngoại lệ khi lấy dữ liệu liên hệ');
        }
    };

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSoftDeletion = async (id) => {
        deleteSoftInvoice(id);
        fetchInvoiceList();
    }

    const handleDelete = async (id) => {
        deleteInvoice(id);
        fetchInvoiceList();
    }

    const handleSearch = useCallback(
        debounce(() => {
            if (searchTerm.trim() === '') {
                setList(initialList);
            } else {
                const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());
                const filteredList = initialList.filter(invoice =>
                    removeAccents(invoice.invoiceId.toLowerCase()).includes(normalizedSearchTerm)
                );
                setList(filteredList);
            }
        }, 300),
        [searchTerm, initialList]
    );

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

    useEffect(() => {
        fetchInvoiceList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (searchTerm.trim()) {
            handleSearch();
        } else {
            setList(initialList);
        }
    }, [searchTerm, initialList]);


    return (
        <div className="nhap-hang-page">
            <h1>THÙNG RÁC</h1>
            <div className="header">
                <div className='search-invoice'>
                    <input type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className='search-input' />
                </div>
            </div>

            <div className="table-container">
                <table className="order-table">
                    <thead>
                        <tr>
                            <th onClick={() => sortBy('invoiceId')} className="col-tk" style={{ cursor: 'pointer' }}>
                                Mã đơn nhập {sortOrder.invoiceId === 'asc' ? '↑' : '↓'}
                            </th>
                            <th onClick={() => sortBy('inputDate')} className="col-tk" style={{ cursor: 'pointer' }}>
                                Ngày nhập {sortOrder.inputDate === 'asc' ? '↑' : '↓'}
                            </th>
                            <th>Trạng thái thanh toán</th>
                            <th>Trạng thái nhập</th>
                            <th>Nhà cung cấp</th>
                            <th>Nhân viên tạo</th>
                            <th onClick={() => sortBy('valueInvoice')} className="col-tk" style={{ cursor: 'pointer' }}>
                                Giá trị {sortOrder.valueInvoice === 'asc' ? '↑' : '↓'}
                            </th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((order) => (
                            <tr key={order.id}>
                                <td>{order.invoiceId}</td>
                                <td>{formatDayTime(order.inputDate)}</td>
                                <td>
                                    {order.statusPayment === 'pending' ? 'Chờ xử lý' :
                                        order.statusPayment === 'partial payment' ? 'Thanh toán một phần' :
                                            order.statusPayment === 'completed' ? 'Hoàn thành' : ''}
                                </td>
                                <td>
                                    {order.statusInput === 'not imported' ? 'Chưa nhập' :
                                        order.statusInput === 'imported' ? 'Đã nhập' : ''}
                                </td>
                                <td>{order.supplierId[0].nameSupplier}</td>
                                <td>{order.creator[0].createdName}</td>
                                <td>{formatCurrency(order.valueInvoice)} đ</td>
                                <td>
                                    {order.status === 'active' ? "Hoạt động" :
                                        order.status === 'paused' ? "Tạm dừng" :
                                            order.status === 'completed' ? "Đã hoàn thành" :
                                                order.status === 'pending' ? "Đang chờ xử lý" :
                                                    order.status === 'cancelled' ? "Đã bị hủy" :
                                                        order.status === 'failed' ? "Không thành công" :
                                                            order.status === 'draft' ? "Đang ở dạng nháp" : ""}
                                </td>
                                <td className="actions">
                                    <button className="btn btn-info" onClick={() => handleSoftDeletion(order._id)}>
                                        <FontAwesomeIcon icon={faRotateRight} />
                                    </button>
                                    <button className="btn btn-danger">
                                        <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(order._id)} className="icon" />
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination-container">
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
            </div>
        </div>
    );
};

export default ImportOrders;
