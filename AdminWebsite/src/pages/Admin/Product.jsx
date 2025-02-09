
import React, { useEffect, useContext, useState } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
// import { StoreContext } from '../../../context/StoreContext';
// import ProductPopup from '../../components/Popup/ProductsPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { fakeProducts } from "../../data/Enviroment"; 

const ListProduct = () => {
    // const { url, url2, product_list } = useContext(StoreContext)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // Theo dõi tổng số trang
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sort, setSort] = useState('Sort By');


    const handleRowClick = (product) => {
        setSelectedProduct(product); // Truyền toàn bộ sản phẩm vào state
        setIsPopupVisible(true);
    };


    const handlePageClick = (event) => {
        const newPage = +event.selected + 1;
        setCurrentPage(newPage);

        // Phân biệt giữa tìm kiếm và hiển thị toàn bộ danh sách
        if (searchTerm.trim()) {
            handleSearch(newPage);
        } else {
            fetchList(newPage);
        }
    };


    // Hàm xóa sản phẩm
    // const removeProduct = async (productId) => {
    //     const response = await axios.delete(`${url}/v1/api/product/delete/${productId}`);
    //     if (response.data.status) {
    //         toast.success(response.data.message);
    //         await fetchList(currentPage);
    //     } else {
    //         toast.error('Error deleting product');
    //     }
    // };

    // Fake data cho hàm xóa sản phẩm
    const removeProduct = async (productId) => {
        setList((prevList) => prevList.filter(product => product._id !== productId));
        toast.success("Sản phẩm đã được xóa!");
    };
    

    // const handleSearch = async () => {
    //     if (searchTerm.trim() === '') {
    //         await fetchList(page); // Quay lại danh sách đầy đủ nếu không nhập gì
    //         return;
    //     }

    //     try {
    //         const response = await axios.get(`${url}/v1/api/products/title`, {
    //             params: { title: searchTerm, page: currentPage, limit: 10 },
    //         });

    //         if (response.data.status) {
    //             if (Array.isArray(response.data.data)) {
    //                 setList(response.data.data);
    //                 setTotalPages(response.data.pagination.totalPages); // Cập nhật tổng số trang
    //                 // toast.success(response.data.message);
    //             } else {
    //                 console.log(response.data.status)
    //                 setList([]);
    //                 setTotalPages(0); // Đặt số trang về 0 nếu không có kết quả
    //                 toast.error("Không tìm thấy sản phẩm");
    //             }
    //         } else {
    //             console.log(response.data.status)
    //             setList([]);
    //             setTotalPages(0);
    //             toast.error("Tìm kiếm thất bại");
    //         }
    //     } catch (error) {
    //         setList([]);
    //         setTotalPages(0);
    //         toast.error("Lỗi trong quá trình tìm kiếm");
    //     }
    // };


    // const handleUpdateProduct = async (updatedProduct) => {
    //     try {
    //         const response = await axios.put(`${url}/v1/api/product/update/${updatedProduct._id}`, updatedProduct);

    //         if (response.data.status) {
    //             setList((prevList) =>
    //                 prevList.map((product) =>
    //                     product._id === updatedProduct._id ? updatedProduct : product
    //                 )
    //             );
    //             fetchList(currentPage);
    //             toast.success(response.data.message);
    //         } else {
    //             toast.error(error);
    //         }
    //     } catch (error) {
    //         toast.error(error);
    //     }
    // };


    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const sortedList = [...list]
        .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
        .sort((a, b) => {
            if (sort === 'Asc') {
                return a.price - b.price;
            } else if (sort === 'Desc') {
                return b.price - a.price;
            }
            return 0;
        });

    // const fetchList = async (page = 1) => {
    //     const response = await axios.get(`${url}/v1/api/product/pagination?page=${page}&limit=10`);
    //     if (response.data.message) {
    //         setList(response.data.data);
    //         setList(fakeProducts);
    //         setTotalPages(response.data.pagination.totalPages);
    //     } else {
    //         toast.error('Lỗi khi lấy danh sách sản phẩm');
    //     }
    // };

    // Fake data cho fetchList

    const fetchList = async (page = 1) => {
        setTimeout(() => {
            setList(fakeProducts);
            setTotalPages(1);
        }, 500);
    };

    useEffect(() => {
        if (searchTerm.trim()) {
            // nofi = false
            handleSearch(); // Nếu có từ khóa tìm kiếm, thực hiện tìm kiếm
        } else {
            fetchList(currentPage); // Nếu không, tải danh sách mặc định
        }
    }, [currentPage, searchTerm]); // Thêm searchTerm vào dependency

    return (
        <div className='listproduct add flex-col'>
            <div className='top-list-tiltle'>
                <div className='col-lg-6 tittle-right'>
                    <p>SẢN PHẨM</p>
                </div>
                <div className='col-lg-6 list-left'>
                    <div className='search-right'>
                        <div className="sort-container">
                            <select id="sort" onChange={handleSortChange} value={sort}>
                                <option value="Sort By">Sắp xếp</option>
                                <option value="Asc">Tăng dần</option>
                                <option value="Desc">Giảm dần</option>
                            </select>
                        </div>

                        <div className="selected-container">
                            <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="All">Lọc</option>
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
                                {/* <button onClick={handleSearch} className='btn-search'>
                                    <i className="fas fa-search"></i>
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="list-table">
                <div className="list-table-format title">
                    <b>Hình ảnh</b>
                    <b>Mã sản phẩm</b>
                    <b>Tên Sản Phẩm</b>
                    <b>Danh Mục</b>
                    <b>Giá</b>
                    <b>Số Lượng</b>
                    <b>Tùy Chỉnh</b>
                </div>

                {sortedList.map((item, index) => (
                    <div key={index} className='list-table-format' onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                        {/* <img src={`${url2}/images/${item.images[0]}`} alt="" /> */}
                        <p> Đây là ảnh fake data</p>
                        <p className='id-product'>{item._id}</p>
                        <p className='name-product'>{item.title}</p>
                        <p className='category-product'>{item.category}</p>
                        <p className='price-product'>{(item.price).toLocaleString()}</p>
                        <p className=''>{item.quantity}</p>
                        <div className='button-product'>
                            <button onClick={() => removeProduct(item._id)} className='cursor1' >
                                <FontAwesomeIcon icon={faTrash} />
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


            {isPopupVisible && (
                <ProductPopup
                    product={selectedProduct}
                    onClose={() => setIsPopupVisible(false)}
                    url={url}
                    onUpdate={handleUpdateProduct}
                />
            )}
        </div>


    )
}

export default ListProduct;
