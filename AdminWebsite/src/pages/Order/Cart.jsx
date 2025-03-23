import React, { useEffect, useContext, useState, useRef } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { Table, Input, Popconfirm, Button, Pagination, Modal, Descriptions, Select } from "antd";
import { DeleteOutlined, BookFilled, EditFilled } from "@ant-design/icons";
import { formatHourDayTime, formatCurrency } from '../../lib/utils';
const Cart = () => {
    const { url, order_list, fetchOrder } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrder, setTotalOrder] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0); // Theo dõi tổng số trang
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingCampaign, setViewingCampaign] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const popupRef = useRef(null); // Tạo ref cho popup
    const [selectedType, setSelectedType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    axios.defaults.withCredentials = true;

    const handlePrint = () => {
        if (popupRef.current) {
            const printContent = popupRef.current.innerHTML;
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Hóa đơn</title>
                        <link rel="stylesheet" href="/path/to/your/print.css">
                        <style>
                            @media print {
                                body {
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    padding: 20px;
                                }
                                
                                #invoice-print-area {
                                    max-width: 600px;
                                    margin: auto;
                                    border: 2px solid black;
                                    padding: 20px;
                                    background: white;
                                    box-shadow: 0px 0px 10px gray;
                                }

                                h1 {
                                    text-align: center;
                                    font-size: 20px;
                                    margin-bottom: 10px;
                                }

                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin-top: 10px;
                                }

                                th, td {
                                    border: 1px solid black;
                                    padding: 10px;
                                    text-align: left;
                                }

                                th {
                                    background-color: #f2f2f2;
                                    font-weight: bold;
                                }

                                /* Ẩn nút in khi in */
                                #invoice-print-area>.ant-btn{
                                    display: none ;
                                }
                            }

                        </style>
                    </head>
                    <body>
                        <div id="invoice-print-area">
                            ${printContent}
                        </div>
                        <script>
                            window.onload = function() {
                                window.print();
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
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
            toast.success('Xóa thành công');
            fetchListpage(currentPage);
        }
    };

    const fetchListpage = async (page = 1, limit = 10) => {
        const response = await axios.get(`${url}/v1/api/profile/order/paginate?page=${page}&limit=${limit}`);
        if (response.data.message) {
            setList(response.data.metadata.order);
            setTotalOrder(response.data.metadata.totalOrder);
            // setTotalPages(response.data.metadata.totalPages);
        }
    };

    const showViewModal = (campaign) => {
        setViewingCampaign(campaign);
        setIsViewModalOpen(true);
    };

    useEffect(() => {
        fetchListpage(currentPage, limit);
    }, [currentPage, limit]);

    const filteredOrders = list.filter((order) => {
        const matchesSearchTerm =
            searchTerm === '' || // Nếu không có searchTerm, bỏ qua điều kiện này
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.address.fullname.toLowerCase().includes(searchTerm.toLowerCase());

        // Điều kiện lọc theo paymentMethod (selectedType)
        const matchesType = !selectedType || order.paymentMethod === selectedType;

        // Điều kiện lọc theo status (selectedStatus)
        const matchesStatus = !selectedStatus || order.status === selectedStatus;

        // Kết hợp tất cả các điều kiện
        return matchesSearchTerm && matchesType && matchesStatus;
    });

    const columns = [
        {
            title: "Mã hóa đơn", dataIndex: "_id", key: "_id",
            render: (text) => (
                text.length > 15 ? text.slice(0, 15) + '...' : text
            ),
            sorter: (a, b) => a._id.localeCompare(b._id)
        },
        {
            title: "Thời gian", dataIndex: "createdAt", key: "createdAt",
            render: (startDate, record) => formatHourDayTime(record.createdAt),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: "Khách hàng", dataIndex: "address", key: "address",
            render: (text, record) => `${record.address.fullname}`
        },
        { title: "Hình thức thanh toán", dataIndex: "paymentMethod", key: "paymentMethod", sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod) },
        {
            title: "Giá trị hóa đơn", dataIndex: "amount", key: "amount",
            render: (text, record) => formatCurrency(record.amount),
            sorter: (a, b) => a.amount - b.amount
        },
        {
            title: "Địa chỉ", dataIndex: "address", key: "address", render: (text, record) => {
                const { street, state, country, zipcode } = record.address;
                const addressParts = [street, state, country, zipcode].filter(part => part);
                const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Không có địa chỉ';
                return fullAddress.length > 30 ? `${fullAddress.slice(0, 20)}...` : fullAddress;
            }
        },
        {
            title: "Trạng thái", dataIndex: "status", key: "status",
            render: (text, record) => (
                <select
                    onChange={(event) => statusHandler(event, record._id)}
                    value={record.status}
                    style={{
                        backgroundColor: record.status === "Đợi xác nhận" ? "#2c3e50" :
                            record.status === "Đang chuẩn bị hàng" ? "#d35400" :
                                record.status === "Đang giao hàng" ? "#f39c12" :
                                    record.status === "Giao hàng thành công" ? "#27ae60" : "#ecf0f1",
                        color: ["Đợi xác nhận", "Đang chuẩn bị hàng", "Đang giao hàng", "Giao hàng thành công"].includes(record.status) ? "white" : "black",
                        width: "fit-content"
                    }}
                >
                    <option value="Đợi xác nhận">Đợi xác nhận</option>
                    <option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</option>
                    <option value="Đang giao hàng">Đang giao hàng</option>
                    <option value="Giao hàng thành công">Giao hàng thành công</option>
                </select>
            ),
        },

        {
            title: "Tùy chỉnh",
            key: "action",
            render: (_, record) => (
                <>
                    <Button type="primary" icon={<BookFilled />} onClick={() => showViewModal(record)} />
                    <Popconfirm title="Xóa hóa đơn này?" onConfirm={() => removeOrder(record._id)} okText="Xóa" cancelText="Hủy">
                        <Button type="primary" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </>
            ),
        },
    ];

    const columnsItem = [
        {
            title: 'Tên hàng', dataIndex: 'title', key: 'title',
            render: (text) => (
                text.length > 15 ? text.slice(0, 15) + '...' : text
            ),
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Đơn giá', dataIndex: 'price', key: 'price', render: (text, record) => formatCurrency(record.price) },
        {
            title: 'Thành tiền',
            dataIndex: '',
            key: 'total',
            render: (text, record) => formatCurrency(record.price * record.quantity)
        },
    ];

    const columnsCreator = [
        { title: 'Người tạo', dataIndex: 'createdName', key: 'createdName' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (text) => new Date(text).toLocaleString() },
    ];

    return (
        <div className='order-list-container'>
            <div className='col-12'>
                <div className='top-order-list col-6'>
                    <Input
                        placeholder="Tìm kiếm hóa đơn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='col-4'
                    />
                    <Select
                        placeholder="Hình thức thanh toán"
                        value={selectedType}
                        className='col-4'
                        onChange={(value) => setSelectedType(value)}
                        allowClear
                    >
                        <Option value="Thanh toán trực tuyến">Thanh toán trực tuyến</Option>
                        <Option value="Thanh toán khi nhận hàng">Thanh toán khi nhận hàng</Option>
                    </Select>
                    <Select
                        placeholder="Trạng thái"
                        value={selectedStatus}
                        className='col-4'
                        onChange={(value) => setSelectedStatus(value)}
                        allowClear
                    >
                        <Option value="Đợi xác nhận">Đợi xác nhận</Option>
                        <Option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</Option>
                        <Option value="Đang giao hàng">Đang giao hàng</Option>
                        <Option value="Giao hàng thành công">Giao hàng thành công</Option>
                    </Select>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredOrders.map((order, index) => ({ ...order, key: order._id || index }))}
                rowKey="key"
                pagination={false} // Ẩn phân trang mặc định của Table
            />
            <Pagination
                current={currentPage}
                total={totalOrder}
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

            {/* Modal thông tin hóa đơn */}
            <Modal
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={null}
            >
                {viewingCampaign && (
                    <>
                        <div ref={popupRef}>
                            <Descriptions title="Thông tin Đơn hàng" column={1} bordered className="custom-descriptions">
                                <Descriptions.Item label="Mã hóa đơn">: {viewingCampaign._id}</Descriptions.Item>
                                <Descriptions.Item label="Khách hàng">: {viewingCampaign.address.fullname}</Descriptions.Item>
                                <Descriptions.Item label="Đơn giá">: {formatCurrency(viewingCampaign.amount)}{' VNĐ'}</Descriptions.Item>
                                <Descriptions.Item label="Ngày đặt hàng">: {formatHourDayTime(viewingCampaign.createdAt)}</Descriptions.Item>
                                <Descriptions.Item label="Thanh toán">: {viewingCampaign.paymentMethod}</Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">: {viewingCampaign.status}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">:
                                    {viewingCampaign.address.street}, {viewingCampaign.address.precinct},{viewingCampaign.address.city},{viewingCampaign.address.province}
                                </Descriptions.Item>
                            </Descriptions>
                            <Table
                                columns={columnsItem}
                                dataSource={viewingCampaign.items?.map((item, index) => ({
                                    ...item,
                                    key: item.id || index
                                }))}
                                rowKey={(record) => record.key}
                                pagination={false}
                            />
                            <Button type="primary" onClick={handlePrint}>
                                In Đơn Hàng
                            </Button>
                        </div>
                        <div>
                            <h3>Lịch sử thay đổi</h3>
                            <Table
                                columns={columnsCreator}
                                dataSource={viewingCampaign.creator?.map((item, index) => ({
                                    ...item,
                                    key: `${item.createdBy || 'unknown'}-${index}`,
                                }))}
                                pagination={{ pageSize: 4 }}
                                rowKey={(record) => record.key}
                            />
                        </div>
                    </>
                )}
            </Modal>

        </div>
    );
};

export default Cart;