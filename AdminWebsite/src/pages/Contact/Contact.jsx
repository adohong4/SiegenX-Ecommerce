import React, { useEffect, useContext, useState, useCallback } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { formatDayTime, formatTime, formatHourDayTime } from '../../lib/utils'
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faTrash, faBook } from '@fortawesome/free-solid-svg-icons';
import { Table, Input, Popconfirm, Button, Pagination, Modal, Descriptions, Select } from "antd";
import { EyeFilled, EyeOutlined } from "@ant-design/icons";
import { fakeContacts, fakeCustomerData } from "../../data/Enviroment";

const Contact = () => {
    const { url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingAccount, setViewingAccount] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedView, setSelectedView] = useState("");
    axios.defaults.withCredentials = true;

    const handleViewToggle = async (itemId) => {
        await axios.put(`${url}/v1/api/contact/isCheck/${itemId}`);
        const updatedList = list.map(item => {
            if (item._id === itemId) {
                return { ...item, viewed: !item.viewed };
            }
            return item;
        });
        setList(updatedList);
    };

    const fetchListcontact = async (page = 1, limit = 5) => {
        try {
            const response = await axios.get(`${url}/v1/api/contact/pagination?page=${page}&limit=${limit}`);
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
        fetchListcontact(currentPage, limit);
    }, [currentPage, limit]);

    const removeContact = async (id) => {
        try {
            const response = await axios.delete(`${url}/v1/api/contact/status/${id}`);
            if (response.data.status) {
                toast.success(response.data.message);
                fetchListcontact(currentPage, limit);
            }
        } catch (error) {
            toast.error("Xảy ra ngoại lệ khi xóa thông tin");
        }
    };

    const showViewModal = (account) => {
        setViewingAccount(account);
        setIsViewModalOpen(true);
    };

    const filtered = list.filter((contact) => {
        // Điều kiện tìm kiếm theo email (searchTerm)
        const matchesSearchTerm =
            searchTerm === '' || // Nếu không có searchTerm, bỏ qua điều kiện này
            contact.email.toLowerCase().includes(searchTerm.toLowerCase());

        // Điều kiện lọc theo viewed (selectedView)
        const matchesView = selectedView === undefined || selectedView === '' || contact.viewed === selectedView;

        // Kết hợp tất cả các điều kiện
        return matchesSearchTerm && matchesView;
    });

    const columns = [
        {
            title: "Tên người dùng",
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            sorter: (a, b) => a.phone.localeCompare(b.phone),
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",

            with: '200px',
            render: (content) => content,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => formatDayTime(createdAt),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: "Kiểm tra",
            key: "viewed",
            render: (text, record) => (
                <button onClick={() => handleViewToggle(record._id)} className="btn-eye">
                    {record.viewed ? (
                        <>
                            <EyeOutlined style={{ color: "green", marginRight: 5 }} />
                            <span style={{ color: "green", fontSize: "11px" }}>Đã liên hệ</span>
                        </>
                    ) : (
                        <>
                            <EyeFilled style={{ color: "red", marginRight: 5 }} />
                            <span style={{ color: "red", fontSize: "11px" }}> Liên hệ</span>
                        </>
                    )}
                </button>
            ),
        },

        {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <>
                    <button onClick={() => showViewModal(record)} className="btn-info-contact" style={{ padding: "5px 10px" }}>
                        <FontAwesomeIcon icon={faBook} />
                    </button>
                    <Popconfirm title="Xóa tài khoản này?" onConfirm={(e) => { e.stopPropagation(); removeContact(record._id); }} okText="Xóa" cancelText="Hủy">
                        <button className="btn-delete-contact" style={{ padding: "5px 10px", color: "red" }}><FontAwesomeIcon icon={faTrash} /></button>
                    </Popconfirm>

                </>
            ),
        },
    ];

    const columnsCreator = [
        { title: 'Người tạo', dataIndex: 'createdName', key: 'createdName' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
    ];

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
            <div className='top-list-tiltle col-6'>

                <div className='col-lg-3 tittle-right'>
                    <Input
                        placeholder="Tìm kiếm liên hệ...."
                        style={{
                            width: 200,
                            marginRight: 8,
                            backgroundColor: '#ffff',
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='col-lg-3 list-left'>
                    <Select
                        placeholder="Danh mục liên hệ"
                        style={{ width: 300, marginRight: 8 }}
                        value={selectedView}
                        onChange={(value) => setSelectedView(value)}
                        allowClear
                    >
                        <Option value="true">Đã liên hệ</Option>
                        <Option value="false">Chưa liên hệ</Option>
                    </Select>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filtered.map((contact, index) => ({ ...contact, key: contact._id || index }))}
                rowKey="key"
                pagination={false} // Ẩn phân trang mặc định của Table
                rowClassName={(record) => (record.viewed ? "checked-row" : "")} // Thêm class nếu đã kiểm tra
            />

            <Pagination
                current={currentPage}
                total={totalItems}
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

            <Modal
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={null}
            >
                {viewingAccount && (
                    <div>
                        <Descriptions title="Thông tin tài khoản" column={1} bordered className="custom-descriptions">
                            <Descriptions.Item label="Họ và tên">{viewingAccount.username}</Descriptions.Item>
                            <Descriptions.Item label="Email">{viewingAccount.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{viewingAccount.phone}</Descriptions.Item>
                            <Descriptions.Item label="Nội dung">{viewingAccount.content}</Descriptions.Item>
                            <Descriptions.Item label="Kiểm tra">{viewingAccount.viewed === true ? 'Đã kiểm tra' : 'Chưa kiểm tra'}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian gửi">{formatDayTime(viewingAccount.createdAt)}</Descriptions.Item>
                        </Descriptions>
                        <h3>Lịch sử thay đổi</h3>
                        <Table
                            columns={columnsCreator}
                            dataSource={viewingAccount.creator?.map((item, index) => ({
                                ...item,
                                key: `${item.createdBy || 'unknown'}-${index}`,
                            }))}
                            pagination={{ pageSize: 3 }}
                            rowKey={(record) => record.key}
                        />
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default Contact;