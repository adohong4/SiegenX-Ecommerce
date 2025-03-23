import React, { useEffect, useContext, useState } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Table, Input, Popconfirm, Button, Pagination, Modal, Descriptions, Form } from "antd";
import { DeleteOutlined, BookFilled, EditFilled } from "@ant-design/icons";
import { StoreContext } from '../../context/StoreContext';
import { formatDayTime, formatCurrency } from '../../lib/utils';

const ListUser = () => {
    const { url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [limit, setLimit] = useState(10);
    const [totalUser, setTotalUser] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingAccount, setViewingAccount] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createForm] = Form.useForm();
    const [form] = Form.useForm();
    axios.defaults.withCredentials = true;

    const fetchList = async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/account/paginate?page=${page}&limit=${limit}`);
            if (response.data.metadata) {
                setList(response.data.metadata.account);
                setTotalUser(response.data.metadata.totalAccount); // Cập nhật tổng số tài khoản
            } else {
                toast.error('Lấy dữ liệu thất bại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lấy dữ liệu');
        }
    };

    useEffect(() => {
        fetchList(currentPage, limit);
    }, [currentPage, limit]);

    const removeUser = async (userId) => {
        try {
            const response = await axios.delete(`${url}/v1/api/profile/account/active/${userId}`);
            if (response.data.status) {
                toast.success('Xóa tài khoản thành công');
                fetchList(currentPage, limit);
            }
        } catch (error) {
            toast.error('Xóa tài khoản thất bại');
        }
    };

    const handleEditSubmit = async () => {
        const values = await form.validateFields();

        const response = await axios.put(`${url}/v1/api/profile/account/update/${editingAccount._id}`, values);
        if (response.data.status) {
            toast.success(response.data.message);
            fetchList();
            setIsModalOpen(false);
            fetchStaffList();
        }

    };

    const showEditModal = (account) => {
        setEditingAccount(account);
        form.setFieldsValue(account);
        setIsModalOpen(true);
    };

    const showViewModal = (account) => {
        setViewingAccount(account);
        setIsViewModalOpen(true);
    };

    const filteredUsers = list.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
        { title: "Tài khoản", dataIndex: "username", key: "username", sorter: (a, b) => a.username.localeCompare(b.username) },
        { title: "Email", dataIndex: "email", key: "email", sorter: (a, b) => a.email.localeCompare(b.email) },
        { title: "Giới tính", dataIndex: "gender", key: "gender" },
        { title: "Số lượng đơn hàng", align: "center", dataIndex: "cartData", key: "cartData", render: (cartData) => Object.keys(cartData).length },
        { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", render: (createdAt) => formatDayTime(createdAt) },
        {
            title: "Tùy chỉnh",
            align: "center",
            key: "action",
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        icon={<BookFilled />}
                        onClick={() => showViewModal(record)}
                        style={{ backgroundColor: "#1890ff", borderColor: "#1890ff", color: "white" }}
                        title="Xem chi tiết"
                    />

                    <Button
                        type="primary"
                        icon={<EditFilled />}
                        onClick={() => showEditModal(record)}
                        style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16", color: "white" }}
                        title="Chỉnh sửa"
                    />

                    <Popconfirm
                        title="Xóa tài khoản này?"
                        onConfirm={() => removeUser(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            type="primary"
                            icon={<DeleteOutlined />}
                            style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "white" }}
                            title="Xóa tài khoản"
                        />
                    </Popconfirm>
                </>


            ),
        },
    ];

    const columnsCreator = [
        { title: 'Người tạo', dataIndex: 'createdName', key: 'createdName' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (text) => new Date(text).toLocaleString() },
    ];

    return (
        <div className="user-list-container">
            <Input
                placeholder="Tìm kiếm tài khoản..."
                style={{ width: 200, marginBottom: 16 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Table
                columns={columns}
                dataSource={filteredUsers.map((user, index) => ({ ...user, key: user._id || index }))}
                rowKey="key"
                pagination={false}
            />
            <Pagination
                current={currentPage}
                total={totalUser}
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
                            <Descriptions.Item label="Họ và tên">{viewingAccount.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Tài khoản">{viewingAccount.username}</Descriptions.Item>
                            <Descriptions.Item label="Email">{viewingAccount.email}</Descriptions.Item>
                            <Descriptions.Item label="Giới tính">{viewingAccount.gender}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{viewingAccount.numberPhone}</Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo tài khoản">{formatDayTime(viewingAccount.createdAt)}</Descriptions.Item>
                            <Descriptions.Item label="Cập nhật gần nhất ">{formatDayTime(viewingAccount.updatedAt)}</Descriptions.Item>
                        </Descriptions>

                        {/* <h3>Lịch sử thay đổi</h3>
                        <Table
                            columns={columnsCreator}
                            dataSource={viewingAccount.creator?.map((item, index) => ({
                                ...item,
                                key: `${item.createdBy || 'unknown'}-${index}`,
                            }))}
                            pagination={{ pageSize: 4 }}
                            rowKey={(record) => record.key}
                        /> */}
                    </div>
                )}
            </Modal>

            <Modal
                title="Chỉnh sửa tài khoản"
                open={isModalOpen}
                onOk={handleEditSubmit}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="username" label="Tài khoản"
                        rules={[
                            { pattern: /^[^\s]+$/, message: "Tài khoản không được chứa khoảng trắng" },
                            { pattern: /^[a-zA-Z0-9]+$/, message: "Tài khoản chỉ được chứa chữ cái và số" }
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ListUser;
