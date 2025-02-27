import React, { useEffect, useContext, useState } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
// import { StoreContext } from '../../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { fakeContacts, fakeCustomerData } from "../../data/Enviroment";

const Contact = () => {
    // const { url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState({ name: 'asc', email: 'asc' });
    const [selectedRow, setSelectedRow] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sort, setSort] = useState('Sort By');
    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    // const handleViewToggle = async (itemId) => {
    //     try {
    //         const updatedList = list.map(item => {
    //             if (item._id === itemId) {
    //                 return { ...item, viewed: !item.viewed };
    //             }
    //             return item;
    //         });

    //         setList(updatedList);

    //         await axios.put(`${url}/v1/api/contact/updateCheck/${itemId}`, {
    //             isCheck: updatedList.find(item => item._id === itemId).viewed
    //         });
    //     } catch (error) {
    //         toast.error("Lỗi khi cập nhật tình trạng");
    //     }
    // };



    // const fetchListcontact = async (page = 1) => {
    //     try {
    //         const response = await axios.get(`${url}/v1/api/contact/pagination?page=${page}&limit=20`);

    //         if (response.data.message) {
    //             const contacts = response.data.data.map(contact => ({
    //                 ...contact,
    //                 viewed: contact.isCheck // Thiết lập trạng thái viewed
    //             }));
    //             setList(contacts);
    //             setTotalItems(response.data.pagination.totalItems);
    //             setTotalPages(response.data.pagination.totalPages);
    //         } else {
    //             toast.error('Lỗi khi lấy dữ liệu liên hệ');
    //         }
    //     } catch (error) {
    //         toast.error('Xảy ra ngoại lệ khi lấy dữ liệu liên hệ');
    //         console.error(error);
    //     }
    // };

    // Fake data cho hàm handleViewToggle

    const handleViewToggle = (itemId) => {
        setList(prevList =>
            prevList.map(item =>
                item._id === itemId ? { ...item, viewed: !item.viewed } : item
            )
        );
    };


    // Hàm fetchList Fake data
    const fetchListcontact = (page = 1) => {
        setList(fakeContacts); // Sử dụng dữ liệu giả
        setTotalItems(fakeContacts.length);
        setTotalPages(1); // Vì là dữ liệu giả, chỉ có 1 trang
    };


    // let nofi = true;

    useEffect(() => {
        if (searchTerm.trim()) {
            // nofi = false
            handleSearch();
        } else {
            fetchListcontact(currentPage);
        }
    }, [currentPage, searchTerm]);

    // Hàm HandleSearch cho fake data
    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setList(fakeContacts);
        } else {
            const filteredList = fakeContacts.filter(contact =>
                contact.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setList(filteredList);
        }
    };

    // kết thúc fake data

    // const handleSearch = async () => {
    //     if (searchTerm.trim() === '') {
    //         await fetchListcontact(currentPage);
    //         return;
    //     }

    //     try {
    //         const response = await axios.get(`${url}/v1/api/contact/search`, {
    //             params: { query: searchTerm, page: currentPage, limit: 20 } // Cập nhật tham số
    //         });

    //         if (response.data.status) {
    //             if (Array.isArray(response.data.data)) {
    //                 const contacts = response.data.data.map(contact => ({
    //                     ...contact,
    //                     viewed: contact.isCheck // Thiết lập trạng thái viewed
    //                 }));
    //                 setList(contacts);
    //                 setTotalPages(response.data.pagination.totalPages); // Cập nhật tổng số trang
    //             } else {
    //                 setList([]);
    //                 setTotalPages(0); // Đặt số trang về 0 nếu không có kết quả
    //                 toast.error("Không tìm thấy liên hệ");
    //             }
    //         } else {
    //             setList([]);
    //         }
    //     } catch (error) {
    //         setList([]); // Gán giá trị rỗng khi xảy ra lỗi
    //         setTotalPages(0);
    //         toast.error("Lỗi trong quá trình tìm kiếm");
    //     }
    // };





    const removeContact = async (id) => {
        try {
            const response = await axios.delete(`${url}/v1/api/contact/delete/${id}`);

            console.log("xoa: ", response.data.message);

            if (response.data.status) {
                toast.success(response.data.message);
                fetchListcontact();

            } else {
                toast.error("Lỗi khi xóa thông tin liên hệ");
            }
        } catch (error) {
            toast.error("Xảy ra ngoại lệ khi xóa thông tin");
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
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };
    return (
        <div className='contact-list-container'>
            <section className="section-dashboard-contact">
                {fakeCustomerData.map((item, index) => (
                    <div key={index} className=" dashboard-body">
                        <p className="text-lg font-semibold">{item.title}</p>
                        <p className="text-2xl font-bold">{item.value.toString().padStart(2, "0")}</p>
                    </div>
                ))}
            </section>
            <div className='top-list-tiltle'>

                <div className='col-lg-4 tittle-right'>
                </div>
                <div className='col-lg-8 list-left'>
                    <div className='search-right'>
                        <div className="sort-container">
                            <select id="sort" onChange={handleSortChange} value={sort}>
                                <option value="Sort By">Sắp xếp theo </option>
                                <option value="Asc">Tăng dần</option>
                                <option value="Desc">Giảm dần</option>
                            </select>
                        </div>

                        <div className="selected-container">
                            <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="All">Danh mục sản phẩm</option>
                                <option value="Màn hình LED">Màn hình LED</option>
                                <option value="MH tương tác">MH tương tác</option>
                                <option value="MH quảng cáo LCD">MH quảng cáo LCD</option>
                                <option value="Quảng cáo 3D (OOH)">Quảng cáo 3D (OOH)</option>
                                <option value="KTV 5D">KTV 5D</option>
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
                                    placeholder="Search..."
                                    className='search-input'
                                />
                                <button className='btn-search'>
                                    Tìm kiếm
                                </button>
                                {/* <button onClick={handleSearch} className='btn-search'>
                    <i className="fas fa-search"></i>
                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='search'>
                <div className='search-CSKH'>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className='search-input'
                    />
                    <button onClick={handleSearch} className='btn-search'>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div> */}

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
                    <div onClick={() => sortBy('date')} className="col-time" style={{ cursor: 'pointer' }}>
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
                            <div>{item.date}</div>
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
                                <button onClick={() => openPopup(item)} className="btn-info">
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
                    onPageChange={handlePageClick}
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

            {isPopupOpen && selectedRow && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content-cskh" onClick={(e) => e.stopPropagation()}>
                        <button className="close-popup" onClick={closePopup}>×</button>
                        <div className="popup-header">
                            <h3>Chi tiết yêu cầu liên hệ</h3>
                        </div>
                        <div className="popup-body">
                            <div className="popup-info">
                                <label><strong>Tên:</strong></label>
                                <p>{selectedRow.username}</p>
                            </div>
                            <div className="popup-info">
                                <label><strong>Email:</strong></label>
                                <p>{selectedRow.email}</p>
                            </div>
                            <div className="popup-info">
                                <label><strong>SĐT:</strong></label>
                                <p>{selectedRow.phone}</p>
                            </div>
                            <div className="popup-info">
                                <label><strong>Thời gian:</strong></label>
                                <p>{selectedRow.date}</p>
                            </div>
                            <div className="popup-info">
                                <label><strong>Nội dung:</strong></label>
                                <p>{selectedRow.content}</p>
                            </div>
                        </div>
                        <div className="popup-footer">
                            <button onClick={closePopup} className="popup-close-btn">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contact;