import React, { useEffect, useContext, useState } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
// import { StoreContext } from '../../../context/StoreContext';
// import PopupUser from '../../../components/Popup/UserPopup/PopupUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { fakeListUser } from "../../data/Enviroment"; 
const ListUser = () => {
    // const { url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [totalUser, setTotalUser] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortNameOrder, setSortNameOrder] = useState('asc');
    const [sortEmailOrder, setSortEmailOrder] = useState('asc');

    const openUpdatePopup = (user) => {
        setCurrentUser(user);
        setIsPopupOpen(true);
        document.body.classList.add('popup-open');
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setCurrentUser(null);
        document.body.classList.remove('popup-open');
    };


    const fetchList = async (page = 1) => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/pagination?page=${page}&limit=10`);
            if (response.data.message) {
                setList(response.data.data);
                setTotalUser(response.data.pagination.limit);
                setTotalPages(response.data.pagination.totalPages);
            } else {
                toast.error('Lấy dữ liệu thất bại');
            }
        } catch (error) {
            toast.error('Lỗi khi lấy dữ liệu');
            console.error(error);
        }
    };

    // useEffect(() => {
    //     if (searchTerm.trim()) {
    //         // nofi = false
    //         handleSearch(); 
    //     } else {
    //         fetchList(currentPage); 
    //     }
    // }, [currentPage, searchTerm]); 


    //Fake data UseEffect cho ListUser
    useEffect(() => {
        setList(fakeListUser);
    }, []);


    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            await fetchList();
            return;
        }

        try {
            const response = await axios.get(`${url}/v1/api/profile/admin/users/email`, { 
                params: { email: searchTerm, page: currentPage, limit: 10} 
            });

            if (response.data.status) {
                if (Array.isArray(response.data.data)) {
                    setList(response.data.data);
                    setTotalPages(response.data.pagination.totalPages); // Cập nhật tổng số trang
                    // toast.success(response.data.message);
                } else {
                    setList([]);
                    setTotalPages(0); // Đặt số trang về 0 nếu không có kết quả
                    toast.error("Không tìm thấy người dùng");
                }
            } else {
                setList([]);
                toast.error("Tìm kiếm thất bại");
            }
        } catch (error) {
            console.log(response.data.status)
            setList([]); // Gán giá trị rỗng khi xảy ra lỗi
            setTotalPages(0);
            toast.error("Lỗi trong quá trình tìm kiếm");
        }
    };

    const removeUser = async (userId) => {
        try {
            const response = await axios.delete(`${url}/v1/api/profile/admin/deleteUser/${userId}`);
            if (response.data.status) {
                toast.success(response.data.message);
                await fetchList(currentPage);
            } else {
                toast.error('Error deleting user');
            }
        } catch (error) {
            toast.error('Error deleting user');
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = {
                username: currentUser.username,
                email: currentUser.email,
                password: currentUser.password ? currentUser.password : undefined,
            };
            const response = await axios.put(`${url}/v1/api/profile/admin/changeInfo/${currentUser._id}`, formData);
            if (response.data.status) {
                toast.success(response.data.message);
                await fetchList();
                closePopup();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Mật khẩu cần ít nhất 8 ký tự');
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const sortByName = () => {
        const newOrder = sortNameOrder === 'asc' ? 'desc' : 'asc';
        setSortNameOrder(newOrder);
        const sortedList = [...list].sort((a, b) =>
            newOrder === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username)
        );
        setList(sortedList);
    };

    const sortByEmail = () => {
        const newOrder = sortEmailOrder === 'asc' ? 'desc' : 'asc';
        setSortEmailOrder(newOrder);
        const sortedList = [...list].sort((a, b) =>
            newOrder === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)
        );
        setList(sortedList);
    };

    const handleInputChange = (e) => {
        setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
    };



    return (
        <div className="user-list-container">
            <div className='user-list-title'>
                <p>Tài khoản khách hàng</p>
            </div>
            <div className="search">
                <div className="search-CSKH">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="btn-search">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>

            <div className="user-list-table">
                <div className="table-header">
                    <div onClick={sortByName} className="col-tk" style={{ cursor: 'pointer' }}>
                        Tài Khoản {sortNameOrder === 'asc' ? '↑' : '↓'}
                    </div>
                    <div onClick={sortByEmail} className="col-email" style={{ cursor: 'pointer' }}>
                        Email {sortEmailOrder === 'asc' ? '↑' : '↓'}
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
                        <div>{item.createdAt}</div>
                        <div>{item.address.length}</div>
                        <div>{Object.keys(item.cartData).length}</div>
                        <div className="actions">
                            <button onClick={() => removeUser(item._id)} className="btn-delete">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button onClick={() => openUpdatePopup(item)} className="btn-update">
                                <FontAwesomeIcon icon={faPenToSquare} />
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

            {/* <PopupUser
                isOpen={isPopupOpen}
                onClose={closePopup}
                userData={currentUser}
                onChange={handleInputChange}
                onSave={handleUpdate}
            /> */}
        </div>
    );
};

export default ListUser;