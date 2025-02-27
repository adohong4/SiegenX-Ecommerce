import React from "react";
import { Table, Button, Popconfirm } from "antd";
import "../styles/styles.css";

const TrashSuppliers = ({ trashSuppliers, setTrashSuppliers, setSuppliers }) => {
    // Khôi phục nhà cung cấp
    const handleRestore = (key) => {
        const restoredSupplier = trashSuppliers.find(supplier => supplier.key === key);
        setSuppliers(prev => [...prev, restoredSupplier]); // Chuyển về danh sách chính
        setTrashSuppliers(trashSuppliers.filter(supplier => supplier.key !== key));
    };

    // Xóa vĩnh viễn nhà cung cấp
    const handleDeleteForever = (key) => {
        setTrashSuppliers(trashSuppliers.filter(supplier => supplier.key !== key));
    };

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
                    <Button onClick={() => handleRestore(record.key)} style={{ marginRight: 8 }}>Khôi phục</Button>
                    <Popconfirm title="Xóa vĩnh viễn?" onConfirm={() => handleDeleteForever(record.key)} okText="Có" cancelText="Không">
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="supplier-list-container">
            <h2>Thùng rác Nhà Cung Cấp</h2>
            <Table columns={columns} dataSource={trashSuppliers} />
        </div>
    );
};

export default TrashSuppliers;
