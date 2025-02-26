import React, { useState } from "react";
import { Table, Input, Button, Popconfirm, Modal, Form, Checkbox } from "antd";

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([
    { key: 1, name: "Nguyễn Văn A", email: "a@example.com", phone: "0123456789", role: "Quản lý", checked: false },
    { key: 2, name: "Trần Thị B", email: "b@example.com", phone: "0987654321", role: "Nhân viên", checked: false },
    { key: 3, name: "Lê Văn C", email: "c@example.com", phone: "0912345678", role: "Nhân viên", checked: false },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();

  const handleDelete = (key) => {
    setEmployees(employees.filter(employee => employee.key !== key));
  };

  const showEditModal = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setIsModalOpen(true);
  };

  const handleEditSubmit = () => {
    form.validateFields().then(values => {
      setEmployees(employees.map(emp => emp.key === editingEmployee.key ? { ...emp, ...values } : emp));
      setIsModalOpen(false);
    });
  };


  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Họ và Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Chức vụ", dataIndex: "role", key: "role" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.key)}>
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
   
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>DANH SÁCH NHÂN VIÊN</h2>
      <Input
        placeholder="Tìm kiếm nhân viên..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20, width: "300px" }}
      />
      <Table columns={columns} dataSource={filteredEmployees} pagination={{ pageSize: 5 }} />
      
      <Modal
        title="Chỉnh sửa nhân viên"
        open={isModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Họ và Tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Chức vụ" rules={[{ required: true, message: "Vui lòng nhập chức vụ" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeList;
