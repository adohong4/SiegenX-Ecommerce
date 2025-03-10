
import React, { useEffect, useContext, useState, useCallback } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { debounce } from 'lodash'
import ReactPaginate from 'react-paginate';
import { StoreContext } from '../../context/StoreContext';
import ProductPopup from '../../components/Popup/ProductsPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBook, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { fakeProducts, stats } from "../../data/Enviroment";

const ProductTrash = () => {
    const { url } = useContext(StoreContext)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sort, setSort] = useState('Sort By');
    axios.defaults.withCredentials = true;

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearch = useCallback(
        debounce(() => {
            if (searchTerm.trim() === '') {
                setList(list);
            } else {
                const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());
                const filteredList = list.filter(product => removeAccents(product.title.toLowerCase()).includes(normalizedSearchTerm));
                setList(filteredList);
            }
        }, 300), //mili seconds
        [searchTerm, list, setList]
    );

    const removeProduct = async (productId) => {
        const response = await axios.delete(`${url}/v1/api/product/deleteProduct/${productId}`);  // delete
        if (response.data.status) {
            toast.success(response.data.message);
            await fetchList(currentPage);
        } else {
            toast.error('Error deleting product');
        }
    };

    const restoreProduct = async (productId) => {
        const response = await axios.delete(`${url}/v1/api/product/delete/${productId}`);  // soft delete
        if (response.data.status) {
            toast.success(response.data.message);
            await fetchList(currentPage);
        } else {
            toast.error('Error deleting product');
        }
    };

    const fetchList = async (page = 1, limit = 5) => {
        const response = await axios.get(`${url}/v1/api/product/trash/paginate?page=${page}&limit=${limit}`);
        if (response.data.message) {
            setList(response.data.metadata.products);

            setTotalProducts(response.data.metadata.totalProducts);
            setTotalPages(response.data.metadata.totalPages);
        } else {
            toast.error('Lỗi khi lấy danh sách sản phẩm');
        }
    };

    const sortedList = [...list]
        .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
        .sort((a, b) => {
            if (sort === 'Asc') return a.price - b.price;
            if (sort === 'Desc') return b.price - a.price;
            return 0;
        });

    useEffect(() => {
        if (searchTerm.trim()) {
            handleSearch();
        } else {
            fetchList(currentPage);
        }
    }, [currentPage, searchTerm]);

    const openPopup = (productId) => {
        setSelectedRow(productId);
        setIsPopupOpen(true);
        document.body.classList.add('popup-open');
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedRow(null);
        document.body.classList.remove('popup-open');
    };

    return (
        <div className='listproduct add flex-col'>
            <div className='top-list-tiltle'>
                <div className='col-lg-4 tittle-right'>
                </div>
                <div className='col-lg-8 list-left'>
                    <div className='search-right'>
                        <div className="sort-container">
                            <select id="sort" onChange={(e) => setSort(e.target.value)} value={sort}>
                                <option value="Sort By">Sắp xếp theo </option>
                                <option value="Asc">Tăng dần</option>
                                <option value="Desc">Giảm dần</option>
                            </select>
                        </div>

                        <div className="selected-container">
                            <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
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

            <div className="list-table">
                <div className="list-table-format title">
                    <b>Hình ảnh</b>
                    <b>Mã sản phẩm</b>
                    <b>Tên Sản Phẩm</b>
                    <b>Danh Mục</b>
                    <b>Trạng thái</b>
                    <b>Giá</b>
                    <b>Số Lượng</b>
                    <b>Tùy Chỉnh</b>
                </div>

                {sortedList.map((item, index) => (
                    <div key={index} className='list-table-format' style={{ cursor: 'pointer' }}>
                        <img src={`http://localhost:9003/images/${item.images[0]}`} alt="" />
                        <p className='id-product'>{item._id}</p>
                        <p className='name-product'>{item.title}</p>
                        <p className='category-product'>{item.category}</p>
                        <p className='quantity-product'>
                            {item.quantity <= 0 ? 'Hết hàng' : "Còn hàng"}
                        </p>
                        <p className='price-product'>{(item.price).toLocaleString()}</p>
                        <p className=''>{item.quantity}</p>
                        <div className='button-product'>
                            <button onClick={() => openPopup(item._id)} className="btn-info">
                                <FontAwesomeIcon icon={faBook} />
                            </button>
                            <button onClick={() => restoreProduct(item._id)} className="btn-info">
                                <FontAwesomeIcon icon={faRotateRight} />
                            </button>
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

            <ProductPopup
                isOpen={isPopupOpen}
                onClose={closePopup}
                productId={selectedRow}
            />

        </div>


    )
}

export default ProductTrash;
