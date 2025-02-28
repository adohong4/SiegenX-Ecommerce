import React, { useEffect, useContext, useState } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, List } from "antd";
import "../styles/styles.css";
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const { Search } = Input;

const SupplierList = ({ trashSuppliers, setTrashSuppliers }) => {
    axios.defaults.withCredentials = true;
    const { url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [limit, setLimit] = useState(7);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const fetchListSupplier = async (page = 1, limit = 7) => {
        try {
            const response = await axios.get(`${url}/v1/api/supplier/paginate?page=${page}&limit=${limit}`);
            if (response.data.message) {
                setList(response.data.metadata.supplier); // Cập nhật với dữ liệu từ API
                setLimit(limit)
                setTotalItems(response.data.metadata.totalSupplier);
                setTotalPages(response.data.metadata.totalPages);
            }
        } catch (error) {
            console.error('Xảy ra ngoại lệ khi lấy dữ liệu liên hệ', error);
        }
    };

    useEffect(() => {
        fetchListSupplier(currentPage);
    }, [currentPage]);

    // Xóa nhà cung cấp (chuyển vào Trash)
    const handleDelete = (key) => {
        const deletedSupplier = list.find(supplier => supplier._id === key); // Sử dụng _id thay vì key
        setTrashSuppliers([...trashSuppliers, deletedSupplier]);  // Thêm vào Trash
        const updatedList = list.filter(supplier => supplier._id !== key);
        setList(updatedList);
    };

    // Mở Modal cập nhật
    const showEditModal = (record) => {
        setEditingSupplier(record);
        setIsModalOpen(true);
    };

    // Hủy cập nhật
    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    // Cập nhật nhà cung cấp
    const handleUpdate = (values) => {
        const updatedList = list.map(supplier =>
            supplier._id === editingSupplier._id ? { ...editingSupplier, ...values } : supplier
        );
        setList(updatedList);
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    // Tìm kiếm nhà cung cấp
    // const filteredData = list.filter(supplier =>
    //     supplier.StaffName.toLowerCase().includes(searchTerm.toLowerCase())
    // );


    // Cột bảng
    const columns = [
        { title: "Mã nhà cung cấp", dataIndex: "_id", key: "_id" },
        { title: "Tên nhà cung cấp", dataIndex: "supplierName", key: "supplierName" },
        { title: "Số điện thoại", dataIndex: "numberPhone", key: "numberPhone" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Địa chỉ", dataIndex: "city", key: "city" },
        { title: "Mã số thuế", dataIndex: "taxCode", key: "taxCode" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span>{!status ? "Hoạt động" : "Không hoạt động"}</span>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <>
                    <Button onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>Cập nhật</Button>
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)} okText="Có" cancelText="Không">
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="supplier-list-container">
            <h2>Danh Sách Nhà Cung Cấp</h2>
            <Search placeholder="Tìm kiếm nhà cung cấp"
                onSearch={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16, width: "300px" }} />
            <Table
                columns={columns}
                dataSource={list.map(item => ({ ...item, key: item._id }))}
                pagination={{ pageSize: limit, current: currentPage, total: totalItems, onChange: (page) => setCurrentPage(page) }}
            />

            {/* Popup Cập nhật */}
            <Modal title="Cập Nhật Nhà Cung Cấp" visible={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form layout="vertical" onFinish={handleUpdate} initialValues={editingSupplier}>
                    <Form.Item name="supplierName" label="Tên nhà cung cấp" rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="numberPhone" label="Số điện thoại">
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item name="city" label="Địa chỉ">
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SupplierList;
