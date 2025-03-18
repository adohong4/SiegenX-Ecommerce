
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Table, Input, Popconfirm, Button, Pagination, Modal, Descriptions, Form, Select } from "antd";
import { debounce } from 'lodash'
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBook, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { fakeProducts, stats } from "../../data/Enviroment";
import { formatDayTime, formatCurrency } from '../../lib/utils';

const ListProduct = () => {
    const { url } = useContext(StoreContext)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(5);
    const [totalProducts, setTotalProducts] = useState(0);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sort, setSort] = useState('Sort By');
    const [selectedType, setSelectedType] = useState("");
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const { Option } = Select;

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
        console.log(productId)
        const response = await axios.delete(`${url}/v1/api/product/delete/${productId}`);
        if (response.data.status) {
            toast.success(response.data.message);
            await fetchList(currentPage);
        } else {
            toast.error('Error deleting product');
        }
    };

    const fetchList = async (page = 1, limit = 5) => {
        const response = await axios.get(`${url}/v1/api/product/paginate?page=${page}&limit=${limit}`);
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
        fetchList(currentPage, limit);
    }, [currentPage, limit]);

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

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const filtered = list.filter((product) => {
        return (
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedType ? product.category === selectedType : true)
        )
    });

    const columns = [
        {
            title: "Hình ảnh", key: "image",
            render: (text, record) => (
                <img src={`http://localhost:9003/images/${record.images[0]}`} alt="" style={{ width: '50px', height: '50px' }} />
            ),
        },
        {
            title: "Mã sản phẩm", dataIndex: "_id", key: "_id",
            render: (text) => (
                text.length > 15 ? text.slice(0, 15) + '...' : text
            ),
            sorter: (a, b) => a._id.localeCompare(b._id)
        },
        {
            title: "Tên sản phẩm", dataIndex: "title", key: "title",
            render: (text) => (
                text.length > 15 ? text.slice(0, 15) + '...' : text
            ),
            sorter: (a, b) => a.title.localeCompare(b.title)
        },
        {
            title: "Danh mục", dataIndex: "category", key: "category",
            sorter: (a, b) => a.category.localeCompare(b.category)
        },
        {
            title: "Trạng thái",
            key: "quantity",
            render: (text, record) => (
                <p style={{ color: record.quantity <= 0 ? 'red' : 'green' }}>
                    {record.quantity <= 0 ? 'Hết hàng' : 'Còn hàng'}
                </p>
            ),
        },
        {
            title: "Giá", dataIndex: "price", key: "price",
            render: (price) => formatCurrency(price),
            sorter: (a, b) => {
                return formatCurrency(a.price).localeCompare(formatCurrency(b.price));
            },
        },
        {
            title: "Số lượng", dataIndex: "quantity", key: "quantityCount",
            sorter: (a, b) => a.quantity.localeCompare(b.quantity)
        },
        {
            title: "Tồn kho", dataIndex: "quantity", key: "quantityCount",
            sorter: (a, b) => a.quantity.localeCompare(b.quantity)
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (text, record) => (
                <div className='button-product'>
                    <button onClick={() => handleProductClick(record._id)} className="btn-info">
                        <FontAwesomeIcon icon={faBook} />
                    </button>
                    <button onClick={() => removeProduct(record._id)} className='cursor1'>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
        },
    ];


    return (
        <div className='listproduct add flex-col'>
            <div className='dashboard-product'>
                <div className="das-body">
                    {stats.map((stat, index) => (
                        <div key={index} className="box">
                            <FontAwesomeIcon icon={stat.icon} className="stat-icon" />
                            <div className="stat-box">
                                <p className="label">{stat.label}</p>
                                <p className="value">{stat.animatedValue} </p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            <div className='top-list-tiltle'>
                <div className='col-lg-4 tittle-right'>
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        style={{ width: 200, marginBottom: 16 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='col-lg-8 list-left'>
                    <div className='search-right'>
                        <Select
                            placeholder="Danh mục sản phẩm"
                            style={{ width: 200, marginRight: 8, borderRadius: '7px', border: '1px solid rgb(134, 134, 134, 0.6)', }}
                            value={selectedType}
                            onChange={(value) => setSelectedType(value)}
                            allowClear
                        >
                            <Option value="Màn hình LED">Màn hình LED</Option>
                            <Option value="MH tương tác">MH tương tác</Option>
                            <Option value="MH quảng cáo LCD">MH quảng cáo LCD</Option>
                            <Option value="Quảng cáo 3D (OOH)">Quảng cáo 3D (OOH)</Option>
                            <Option value="KTV 5D">KTV 5D</Option>
                        </Select>
                    </div>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filtered.map((contact, index) => ({ ...contact, key: contact._id || index }))}
                rowKey="key"
                pagination={false} // Ẩn phân trang mặc định của Table
            />
            <Pagination
                current={currentPage}
                total={totalProducts}
                pageSize={limit}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger
                pageSizeOptions={['5', '10', '20', '30']}
                onShowSizeChange={(current, size) => {
                    setLimit(size);
                    setCurrentPage(1);
                }}
                style={{ marginTop: 16, textAlign: 'right' }}
            />
        </div>
    )
}

export default ListProduct;
