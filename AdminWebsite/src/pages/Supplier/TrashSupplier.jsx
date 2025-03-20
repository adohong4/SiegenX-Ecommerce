import React, { useEffect, useContext, useState } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, List } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "../styles/styles.css";
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { RollbackOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
const { Search } = Input;

const TrashSuppliers = ({ trashSuppliers, setTrashSuppliers }) => {
    axios.defaults.withCredentials = true;
    const { url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [limit, setLimit] = useState(7);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const navigate = useNavigate();

    const fetchListSupplier = async (page = 1, limit = 7) => {
        try {
            const response = await axios.get(`${url}/v1/api/supplier/trash/paginate?page=${page}&limit=${limit}`);
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
    const handleDelete = async (key) => {
        try {
            const response = await axios.delete(`${url}/v1/api/supplier/delete/${key}`);
            fetchListSupplier(currentPage)
        } catch (error) {
            toast.error(error.response.data.message)
        }

    };

    const handleStore = async (key) => {
        await axios.delete(`${url}/v1/api/supplier/active/${key}`);
        fetchListSupplier(currentPage)
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
    const filteredData = list.filter(supplier =>
        supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Cột bảng
    const columns = [
        {
            title: "Tên nhà cung cấp", dataIndex: "supplierName", key: "supplierName",
            sorter: (a, b) => a.supplierName.localeCompare(b.code),
        },
        {
            title: "Số điện thoại", dataIndex: "numberPhone", key: "numberPhone",
            sorter: (a, b) => a.numberPhone.localeCompare(b.code),
        },
        {
            title: "Email", dataIndex: "email", key: "email",
            sorter: (a, b) => a.email.localeCompare(b.code),
        },
        {
            title: "Địa chỉ", dataIndex: "city", key: "city",
            sorter: (a, b) => a.city.localeCompare(b.code),
        },
        {
            title: "Mã số thuế", dataIndex: "taxCode", key: "taxCode",
            sorter: (a, b) => a.taxCode.localeCompare(b.code),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: 'center',
            render: (status) => (
                <span>{!status ? "Hoạt động" : "Không hoạt động"}</span>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            align: 'center',
            render: (text, record) => (
                <>
                    <Tooltip title="Hồi phục">
                        <Button onClick={() => handleStore(record._id)} style={{ marginRight: 8 }} icon={<RollbackOutlined />} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)} okText="Có" cancelText="Không">
                            <Button danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <div className="supplier-list-container" style={{ padding: 20 }}>
            <Input
                placeholder="Tìm kiếm nhân viên..."
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 20, width: "300px" }}
            />
            <Table
                columns={columns}
                dataSource={filteredData.map(item => ({ ...item, key: item._id }))}
                pagination={{ pageSize: limit, current: currentPage, total: totalItems, onChange: (page) => setCurrentPage(page) }}
            />

            {/* Popup Cập nhật */}
            <Modal title="Cập Nhật Nhà Cung Cấp" open={isModalOpen} onCancel={handleCancel} footer={null}>
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

export default TrashSuppliers;
