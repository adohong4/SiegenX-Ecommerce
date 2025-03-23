import React, { useEffect, useContext, useState } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, Row, Col } from "antd";
import { PlusOutlined, } from "@ant-design/icons";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const SupplierList = () => {
    axios.defaults.withCredentials = true;
    const { url, supplier_list, fetchSupplierList } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

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
        fetchSupplierList();
    }, []);

    // Xóa nhà cung cấp (chuyển vào Trash)
    const handleDelete = async (key) => {
        await axios.delete(`${url}/v1/api/supplier/active/${key}`);
        fetchSupplierList();
    };

    // Mở Modal cập nhật
    const showEditModal = (record) => {
        setEditingSupplier(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    // Hủy cập nhật
    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    // Cập nhật nhà cung cấp
    const handleUpdate = async (key, values) => {
        try {
            const response = await axios.put(`${url}/v1/api/supplier/update/${key}`, values);
            if (response.data.status) {
                toast.success(response.data.message);
                setIsModalOpen(false);
                setEditingSupplier(null);
                fetchSupplierList();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }

    };

    // Tìm kiếm nhà cung cấp
    const filteredData = supplier_list?.filter(supplier =>
        supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Cột bảng
    const columns = [
        {
            title: "Tên nhà cung cấp", dataIndex: "supplierName", key: "supplierName",
            sorter: (a, b) => a.supplierName.localeCompare(b.supplierName),
        },
        {
            title: "Số điện thoại", dataIndex: "numberPhone", key: "numberPhone",
            sorter: (a, b) => a.numberPhone.localeCompare(b.numberPhone),
        },
        {
            title: "Email", dataIndex: "email", key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Địa chỉ", dataIndex: "city", key: "city",
            sorter: (a, b) => a.city.localeCompare(b.city),
        },
        {
            title: "Mã số thuế", dataIndex: "taxCode", key: "taxCode",
            sorter: (a, b) => a.taxCode.localeCompare(b.taxCode),
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
                    <Button onClick={() => navigate(record._id)} style={{ marginRight: 8 }} icon={<EyeOutlined />} />
                    <Button onClick={() => showEditModal(record)} style={{ marginRight: 8 }} icon={<EditOutlined />} />
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)} okText="Có" cancelText="Không">
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="supplier-list-container" style={{ padding: 20 }}>
            <h2>Danh Sách Nhà Cung Cấp</h2>
            <Input
                placeholder="Tìm kiếm nhân viên..."
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 20, width: "300px" }}
            />
            <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: 8 }} onClick={() => navigate("/add-supplier")}>
                Thêm mới chiến dịch
            </Button>
            <Table
                columns={columns}
                dataSource={filteredData.map(item => ({ ...item, key: item._id }))}
                pagination={{ pageSize: limit, current: currentPage, total: totalItems, onChange: (page) => setCurrentPage(page) }}
            />

            {/* Popup Cập nhật */}
            <Modal title="Cập Nhật Nhà Cung Cấp" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form form={form} layout="vertical" onFinish={(values) => handleUpdate(editingSupplier._id, values)}>
                    <Form.Item name="_id" hidden>
                        <Input />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="supplierName" label="Tên nhà cung cấp:"
                                rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp!" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="email" label="Email:"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email!" },
                                    { type: "email", message: "Email không hợp lệ!" }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="numberPhone" label="Số điện thoại">
                                <Input />
                            </Form.Item>
                            <Form.Item name="taxCode" label="Mã số thuế"
                                rules={[
                                    { required: true, message: "Vui lòng nhập mã số thuế!" },
                                    { pattern: /^[0-9]+$/, message: "Mã số thuế chỉ được chứa số!" },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item name="lane" label="Đường">
                                <Input />
                            </Form.Item>
                            <Form.Item name="area" label="Khu vực">
                                <Input />
                            </Form.Item>
                            <Form.Item name="city" label="Thành phố">
                                <Input />
                            </Form.Item>
                            <Form.Item name="addressOthers" label="Địa chỉ">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="description" label="Mô tả nhà cung cấp">
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
