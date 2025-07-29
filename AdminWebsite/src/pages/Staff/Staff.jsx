import React, { useEffect, useContext, useState } from 'react';
import { Table, Input, Button, Popconfirm, Modal, Form, Checkbox, Select, notification } from "antd";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const EmployeeList = () => {
  axios.defaults.withCredentials = true;
  const { url, updateStaffById, deleteRestoreStaff } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [limit, setLimit] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [form] = Form.useForm();

  const fetchStaffList = async (page = 1, limit = 8) => {
    try {
      const response = await axios.get(`${url}/v1/api/staff/paginate?page=${page}&limit=${limit}`);
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

  const handleDelete = async (id) => {
    await deleteRestoreStaff(id);
    fetchStaffList(currentPage);
  };

  const showEditModal = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    const values = await form.validateFields();
    console.log(editingEmployee._id);

    await updateStaffById(editingEmployee._id, values);
    setIsModalOpen(false);
    fetchStaffList();
  };

  const showViewModal = (employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleCreateEmployee = async () => {
    try {
      const values = await createForm.validateFields();
      await axios.post(`${url}/v1/api/staff/add`, values);
      setIsCreateModalOpen(false);
      fetchStaffList();
      createForm.resetFields();
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
    }
  };

  const filteredEmployees = list.filter(employee =>
    employee.StaffName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Mã nhân viên", dataIndex: "_id", key: "_id",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Họ và Tên", dataIndex: "StaffName", key: "StaffName",
      sorter: (a, b) => a.StaffName.localeCompare(b.StaffName),
    },
    {
      title: "Tài khoản", dataIndex: "Username", key: "Username",
      sorter: (a, b) => a.Username.localeCompare(b.Username),
    },
    {
      title: "Email", dataIndex: "Email", key: "Email",
      sorter: (a, b) => a.Email.localeCompare(b.Email),
    },
    {
      title: "Số điện thoại", dataIndex: "Numberphone", key: "Numberphone",
      sorter: (a, b) => a.Numberphone.localeCompare(b.Numberphone),
    },
    {
      title: "Mã số thuế", dataIndex: "Tax", key: "Tax",
      sorter: (a, b) => a.Tax.localeCompare(b.Tax),
    },
    {
      title: "Chức vụ", dataIndex: "Role", key: "Role",
      render: (Role) => (
        <span>{Role == 'STAFF' ? "Nhân viên" :
          Role == 'SHIPPER' ? 'Vận chuyển' : "Quản lý"}</span>
      )
    },
    {
      title: "Hành động",
      key: "actions",
      align: 'center',
      render: (_, record) => (
        <>
          <Button onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Button onClick={() => showViewModal(record)} style={{ marginRight: 8 }}>Xem</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)}>
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const columnsCreator = [
    { title: 'Người tạo', dataIndex: 'createdName', key: 'createdName' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
  ];

  return (
    <div className='staff-container' style={{ padding: 20 }}>
      <h2>DANH SÁCH NHÂN VIÊN</h2>
      <Input
        placeholder="Tìm kiếm nhân viên..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20, width: "300px", marginRight: 20 }}
      />
      <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>Thêm nhân viên</Button>

      <Table
        columns={columns}
        dataSource={filteredEmployees.map(item => ({ ...item, key: item._id }))}
        pagination={{ pageSize: limit }}
      />

      {/* Modal tạo mới nhân viên */}
      <Modal
        title="Thêm nhân viên mới"
        open={isCreateModalOpen}
        onOk={handleCreateEmployee}
        onCancel={() => setIsCreateModalOpen(false)}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="StaffName" label="Họ và Tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Username" label="Tài khoản"
            rules={[
              { required: true, message: "Vui lòng nhập tài khoản" },
              { pattern: /^[^\s]+$/, message: "Tài khoản không được chứa khoảng trắng" },
              { pattern: /^[a-zA-Z0-9]+$/, message: "Tài khoản chỉ được chứa chữ cái và số" }
            ]}>
            <Input />
          </Form.Item>
          <Form.Item name="Email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="Role" label="Chức vụ" rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}>
            <Select placeholder="Chọn chức vụ">
              <Select.Option value="STAFF">Nhân viên</Select.Option>
              <Select.Option value="ADMIN">Quản lý</Select.Option>
              <Select.Option value="SHIPPER">Vận chuyển</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="Tax" label="Mã số thuế">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal cập nhật nhân viên */}
      <Modal
        title="Chỉnh sửa nhân viên"
        open={isModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="StaffName" label="Họ và Tên">
            <Input />
          </Form.Item>
          <Form.Item name="Username" label="Tài khoản"
            rules={[
              { pattern: /^[^\s]+$/, message: "Tài khoản không được chứa khoảng trắng" },
              { pattern: /^[a-zA-Z0-9]+$/, message: "Tài khoản chỉ được chứa chữ cái và số" }
            ]}>
            <Input />
          </Form.Item>
          <Form.Item name="Password" label="Mật khẩu">
            <Input />
          </Form.Item>
          <Form.Item name="Numberphone" label="Số điện thoại" rules={[{ pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Role" label="Chức vụ">
            <Select placeholder="Chọn chức vụ">
              <Select.Option value="STAFF">Nhân viên</Select.Option>
              <Select.Option value="ADMIN">Quản lý</Select.Option>
              <Select.Option value="SHIPPER">Vận chuyển</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thông tin nhân viên */}
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

export default EmployeeList;
