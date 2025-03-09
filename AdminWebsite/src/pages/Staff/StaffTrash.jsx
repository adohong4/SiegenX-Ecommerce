import React, { useEffect, useContext, useState } from 'react';
import { Table, Input, Button, Popconfirm, Modal, Form, Checkbox, Select } from "antd";
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const EmployeeTrashList = () => {
    axios.defaults.withCredentials = true;
    const { url, deleteRestoreStaff, deleteStaff } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [limit, setLimit] = useState(7);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingEmployee, setViewingEmployee] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const fetchStaffList = async (page = 1, limit = 8) => {
        try {
            const response = await axios.get(`${url}/v1/api/staff/trash/paginate?page=${page}&limit=${limit}`);
            if (response.data.message) {
                setList(response.data.metadata.staffs);
                setLimit(limit)
                setTotalItems(response.data.metadata.totalStaff);
                setTotalPages(response.data.metadata.totalPages);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    useEffect(() => {
        fetchStaffList(currentPage);
    }, [currentPage]);

    const handleResore = async (id) => {
        await deleteRestoreStaff(id);
        fetchStaffList(currentPage);
    };

    const handleDelete = async (id) => {
        await deleteStaff(id);
        fetchStaffList(currentPage);
    };

    const showViewModal = (employee) => {
        setViewingEmployee(employee);
        setIsViewModalOpen(true);
    };

    const filteredEmployees = list.filter(employee =>
        employee.StaffName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { title: "Mã nhân viên", dataIndex: "_id", key: "_id" },
        { title: "Họ và Tên", dataIndex: "StaffName", key: "StaffName" },
        { title: "Tài khoản", dataIndex: "Username", key: "Username" },
        { title: "Email", dataIndex: "Email", key: "Email" },
        { title: "Số điện thoại", dataIndex: "Numberphone", key: "Numberphone" },
        { title: "Mã số thuế", dataIndex: "Tax", key: "Tax" },
        {
            title: "Chức vụ", dataIndex: "Role", key: "Role",
            render: (Role) => (
                <span>{Role == 'STAFF' ? "Nhân viên" : "Quản lý"}</span>
            )
        },
        {
            title: "Hành động",
            key: "actions",
            align: 'center',
            render: (_, record) => (
                <>
                    <Button onClick={() => showViewModal(record)} >Xem</Button>
                    <Popconfirm title="Bạn muốn phục hồi?" onConfirm={() => handleResore(record._id)}>
                        <Button type="primary" danger>Phục hồi</Button>
                    </Popconfirm>
                    <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)}>
                        <Button type="primary" danger>Xóa</Button>
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
        <div className='staff-container' style={{ padding: 20 }}>
            <h2>DANH SÁCH NHÂN VIÊN</h2>
            <Input
                placeholder="Tìm kiếm nhân viên..."
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 20, width: "300px" }}
            />
            <Table
                columns={columns}
                dataSource={filteredEmployees.map(item => ({ ...item, key: item._id }))}
                pagination={{ pageSize: limit }}
            />
            <Modal
                title="Thông tin nhân viên"
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={null}
            >
                {viewingEmployee && (
                    <div>
                        <p><strong>Họ và Tên:</strong> {viewingEmployee.StaffName}</p>
                        <p><strong>Tài khoản:</strong> {viewingEmployee.Username}</p>
                        <p><strong>Email:</strong> {viewingEmployee.Email}</p>
                        <p><strong>Số điện thoại:</strong> {viewingEmployee.Numberphone}</p>
                        <p><strong>Chức vụ:</strong> {viewingEmployee.Role === 'STAFF' ? 'Nhân viên' : 'Quản lý'}</p>
                        <p><strong>Mã số thuế:</strong> {viewingEmployee.Tax}</p>

                        <h3>Lịch sử thay đổi</h3>
                        <Table
                            columns={columnsCreator}
                            dataSource={viewingEmployee.creator?.map((item, index) => ({
                                ...item,
                                key: `${item.createdBy || 'unknown'}-${index}`,
                            }))}
                            pagination={false}
                            rowKey={(record) => record.key}
                        />
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default EmployeeTrashList;
