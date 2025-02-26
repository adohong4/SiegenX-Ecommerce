import React, { useEffect, useContext, useState, useCallback } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { formatDayTime, formatTime, formatHourDayTime } from '../../lib/utils'
import { toast } from 'react-toastify';
import { debounce } from 'lodash'
import ContactPopup from '../../components/Popup/ContactPopup';
import ReactPaginate from 'react-paginate';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faRotateRight, faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
    const { url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState({ name: 'asc', email: 'asc' });
    const [selectedRow, setSelectedRow] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    axios.defaults.withCredentials = true;

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleViewToggle = async (itemId) => {
        try {
            await axios.put(`${url}/v1/api/contact/isCheck/${itemId}`);
            const updatedList = list.map(item => {
                if (item._id === itemId) {
                    return { ...item, viewed: !item.viewed };
                }
                return item;
            });
            setList(updatedList);
        } catch (error) {
            toast.error("Lỗi khi cập nhật tình trạng");
            console.error(error);
        }
    };

    const fetchListcontact = async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${url}/v1/api/contact/paginate?page=${page}&limit=${limit}`);
            if (response.data.message) {
                let contacts = response.data.metadata.contact.map(contact => ({
                    ...contact,
                    viewed: contact.isCheck
                }));

                if (filterStatus !== "All") {
                    const isCheckValue = filterStatus === "true";
                    contacts = contacts.filter(contact => contact.isCheck === isCheckValue);
                }

                setList(contacts);
                setTotalItems(response.data.metadata.totalContact);
                setTotalPages(response.data.metadata.totalPages);
            }
        } catch (error) {
            toast.error('Xảy ra ngoại lệ khi lấy dữ liệu liên hệ');
            console.error(error);
        }
    };

    useEffect(() => {
        if (searchTerm.trim()) {
            handleSearch();
        } else {
            fetchListcontact(currentPage);
        }
    }, [currentPage, filterStatus, searchTerm]);

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
        }, 300),
        [searchTerm, list, setList]
    );

    const RestoreContact = async (id) => {
        const response = await axios.delete(`${url}/v1/api/contact/status/${id}`);
        if (response.data.status) {
            toast.success(response.data.message);
            fetchListcontact();
        }
    };

    const removeContact = async (id) => {
        try {
            const response = await axios.delete(`${url}/v1/api/contact/delete/${id}`);
            if (response.data.status) {
                toast.success(response.data.message);
                fetchListcontact();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sortBy = (field) => {
        const newOrder = sortOrder[field] === 'asc' ? 'desc' : 'asc';
        setSortOrder({ ...sortOrder, [field]: newOrder });
        const sortedList = [...list].sort((a, b) =>
            newOrder === 'asc' ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field])
        );
        setList(sortedList);
    };

    const openPopup = (contactId) => {
        setSelectedRow(contactId);
        setIsPopupOpen(true);
        document.body.classList.add('popup-open');
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedRow(null);
        document.body.classList.remove('popup-open');
    };
    return (
        <div className='contact-list-container'>
            <div className='top-list-tiltle'>

                <div className='col-lg-4 tittle-right'>
                </div>
                <div className='col-lg-8 list-left'>
                    <div className='search-right'>
                        <div className="selected-container">
                            <select id="isCheck" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="All">Danh mục liên hệ</option>
                                <option value='true'>Đã liên hệ</option>
                                <option value='false'>Chưa liên hệ</option>
                            </select>
                        </div>
                    </div>

                    <div className='search-left'>
                        <div className='search'>
                            <div className='search-CSKH'>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm..."
                                    className='search-input'
                                />
                                <button className='btn-search'>
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-list-table">
                <div className="table-header">
                    <div onClick={() => sortBy('username')} className="col-tk" style={{ cursor: 'pointer' }}>
                        Tên {sortOrder.username === 'asc' ? '↑' : '↓'}
                    </div>
                    <div onClick={() => sortBy('email')} className="col-email" style={{ cursor: 'pointer' }}>
                        Email {sortOrder.email === 'asc' ? '↑' : '↓'}
                    </div>
                    <div className="col-phone">SĐT</div>
                    <div className="col-content">Nội dung</div>
                    <div onClick={() => sortBy('createdAt')} className="col-time" style={{ cursor: 'pointer' }}>
                        Thời gian {sortOrder.date === 'asc' ? '↑' : '↓'}
                    </div>
                    <div className="col-check">Kiểm tra</div>
                    <div className="col-actions">Tùy chỉnh</div>
                </div>

                <div className="table-body">
                    {list.map((item) => (
                        <div
                            key={item._id}
                            className={`table-row ${item.viewed ? 'viewed' : ''}`}
                        >
                            <div>{item.username}</div>
                            <div>{item.email}</div>
                            <div>{item.phone}</div>
                            <div>{item.content}</div>
                            <div>{formatDayTime(item.createdAt)}</div>
                            <div className="col-check">
                                <button
                                    onClick={() => handleViewToggle(item._id)}
                                    className="btn-eye"
                                >
                                    <FontAwesomeIcon icon={item.viewed ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            <div className="col-actions">
                                <button onClick={(e) => { e.stopPropagation(); removeContact(item._id); }} className="btn-delete">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button onClick={() => RestoreContact(item._id)} className="btn-warn">
                                    <FontAwesomeIcon icon={faRotateRight} />
                                </button>
                                <button onClick={() => openPopup(item._id)} className="btn-info">
                                    <FontAwesomeIcon icon={faBook} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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

            <ContactPopup
                isOpen={isPopupOpen}
                onClose={closePopup}
                contactId={selectedRow}
            />
        </div>
    );
};

export default Contact;