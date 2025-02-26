import React, { useState } from "react";
import { Table, Button, Popconfirm, Modal, Form, Input } from "antd";
import "../styles/styles.css";

const { Search } = Input;

const SupplierList = ({ trashSuppliers, setTrashSuppliers }) => {
    const [suppliers, setSuppliers] = useState([
        { key: "1", name: "Công ty A", phone: "0123456789", email: "a@gmail.com", address: "Hà Nội" },
        { key: "2", name: "Công ty B", phone: "0987654321", email: "b@gmail.com", address: "TP HCM" },
    ]);
    
    const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    // Xóa nhà cung cấp (chuyển vào Trash)
    const handleDelete = (key) => {
        const deletedSupplier = suppliers.find(supplier => supplier.key === key);
        setTrashSuppliers([...trashSuppliers, deletedSupplier]);  // Thêm vào Trash
        const updatedSuppliers = suppliers.filter(supplier => supplier.key !== key);
        setSuppliers(updatedSuppliers);
        setFilteredSuppliers(updatedSuppliers);
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
        const updatedSuppliers = suppliers.map(supplier =>
            supplier.key === editingSupplier.key ? { ...editingSupplier, ...values } : supplier
        );
        setSuppliers(updatedSuppliers);
        setFilteredSuppliers(updatedSuppliers);
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    // Tìm kiếm nhà cung cấp
    const handleSearch = (value) => {
        const filteredData = suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuppliers(filteredData);
    };

    // Cột bảng
    const columns = [
        { title: "Tên nhà cung cấp", dataIndex: "name", key: "name" },
        { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Địa chỉ", dataIndex: "address", key: "address" },
        {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <>
                    <Button onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>Cập nhật</Button>
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.key)} okText="Có" cancelText="Không">
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="supplier-list-container">
            <h2>Danh Sách Nhà Cung Cấp 1</h2>
            <Search placeholder="Tìm kiếm nhà cung cấp" onSearch={handleSearch} style={{ marginBottom: 16, width: "300px" }} />
            <Table columns={columns} dataSource={filteredSuppliers} />
            
            {/* Popup Cập nhật */}
            <Modal title="Cập Nhật Nhà Cung Cấp" visible={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form layout="vertical" onFinish={handleUpdate} initialValues={editingSupplier}>
                    <Form.Item name="name" label="Tên nhà cung cấp" rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp!" }]}>                        
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại">
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ">
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
