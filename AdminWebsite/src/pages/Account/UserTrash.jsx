import React, { useEffect, useContext, useState, useCallback } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { debounce } from 'lodash'
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { StoreContext } from '../../context/StoreContext';
import PopupUser from '../../components/Popup/PopupUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { formatDayTime } from '../../lib/utils';

const ListUser = () => {
    const { url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [totalUser, setTotalUser] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState({ name: 'asc', email: 'asc' });
    axios.defaults.withCredentials = true;

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const fetchList = async (page = 1, limit = 6) => {
        const response = await axios.get(`${url}/v1/api/profile/account/trash/paginate?page=${page}&limit=${limit}`);
        if (response.data.message) {
            setList(response.data.metadata.account);
            setTotalUser(response.data.metadata.limit);
            setTotalPages(response.data.metadata.totalPages);
        } else {
            toast.error('Lấy dữ liệu thất bại');
        }
    };

    useEffect(() => {
        if (searchTerm.trim()) {
            handleSearch();
        } else {
            fetchList(currentPage);
        }
    }, [currentPage, searchTerm]);

    const handleSearch = useCallback(
        debounce(() => {
            if (searchTerm.trim() === '') {
                setList(list);
            } else {
                const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());
                const filteredList = list.filter(contact =>
                    removeAccents(contact.username.toLowerCase()).includes(normalizedSearchTerm) ||
                    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setList(filteredList);
            }
        }, 300), //mili seconds
        [searchTerm, list, setList]
    );

    const removeUser = async (userId) => {
        const response = await axios.delete(`${url}/v1/api/profile/account/delete/${userId}`);
        if (response.data.status) {
            toast.success(response.data.message);
            await fetchList(currentPage);
        }
    };

    const restoreAccount = async (userId) => {
        const response = await axios.delete(`${url}/v1/api/profile/account/active/${userId}`);
        if (response.data.status) {
            toast.success('Hồi phục thành công');
            await fetchList(currentPage);
        }
    };

    const sortBy = (field) => {
        const newOrder = sortOrder[field] === 'asc' ? 'desc' : 'asc';
        setSortOrder({ ...sortOrder, [field]: newOrder });
        const sortedList = [...list].sort((a, b) =>
            newOrder === 'asc' ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field])
        );
        setList(sortedList);
    };

    return (
        <div className="user-list-container">
            <div className="search">
                <div className="search-CSKH">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="btn-search">
                        Tìm kiếm
                    </button>
                </div>
            </div>

            <div className="user-list-table">
                <div className="table-header">
                    <div onClick={() => sortBy('username')} className="col-tk" style={{ cursor: 'pointer' }}>
                        Tài Khoản {sortOrder.username === 'asc' ? '↑' : '↓'}
                    </div>
                    <div onClick={() => sortBy('email')} className="col-email" style={{ cursor: 'pointer' }}>
                        Email {sortOrder.email === 'asc' ? '↑' : '↓'}
                    </div>
                    <div className="col-date">Ngày tạo</div>
                    <div className="col-address">Số lượng địa chỉ</div>
                    <div className="col-sl">Số lượng đơn hàng</div>
                    <div className="col-chucnang">Chức năng</div>
                </div>
                {list.map((item, index) => (
                    <div key={index} className="table-row">
                        <div>{item.username}</div>
                        <div>{item.email}</div>
                        <div>{formatDayTime(item.createdAt)}</div>
                        <div>{item.address.length}</div>
                        <div>{Object.keys(item.cartData).length}</div>
                        <div className="actions">
                            <button onClick={() => removeUser(item._id)} className="btn-delete-user">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button onClick={() => restoreAccount(item._id)} className="btn-update-user">
                                <FontAwesomeIcon icon={faRotateRight} />
                            </button>

                            <button className="btn-info">
                                <FontAwesomeIcon icon={faBook} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
    );
};

export default ListUser;