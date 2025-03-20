import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { formatDayTime, formatCurrency } from '../../lib/utils'
import { StoreContext } from '../../context/StoreContext';
import { Table, Switch, Modal, Button, Pagination, Select, Input, Popconfirm, Descriptions } from "antd";
import { DeleteOutlined, PlusOutlined, BookFilled, EditFilled } from "@ant-design/icons";
import axios from 'axios';

const ImportOrders = () => {
  const { url, deleteSoftInvoice } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const fetchInvoiceList = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(`${url}/v1/api/product/invoice/paginate?page=${page}&limit=${limit}`);
      if (response.data.message) {
        setList(response.data.metadata.invoice);
        setTotalItems(response.data.metadata.totalInvoice);
        setTotalPages(response.data.metadata.totalPages);
      }
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleSoftDeletion = async (id) => {
    deleteSoftInvoice(id);
    fetchInvoiceList();
  }

  useEffect(() => {
    fetchInvoiceList(currentPage, limit);
  }, [currentPage, limit]);

  const filtered = list.filter((invoice) =>
    invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Mã đơn nhập",
      dataIndex: "invoiceId",
      key: "invoiceId",
      sorter: (a, b) => a.invoiceId.localeCompare(b.invoiceId),
    },
    {
      title: "Ngày nhập",
      dataIndex: "inputDate",
      key: "inputDate",
      render: (inputDate, record) => formatDayTime(record.inputDate),
      sorter: (a, b) => new Date(a.inputDate) - new Date(b.inputDate),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "statusPayment",
      key: "statusPayment",
      render: (statusPayment) => {
        const statusMap = {
          pending: { text: 'Chờ xử lý', color: 'black' },
          'partial payment': { text: 'Thanh toán một phần', color: 'blue' },
          completed: { text: 'Đã thanh toán', color: 'green' },
          default: { text: '' },
        };
        const currentStatus = statusMap[statusPayment] || statusMap.default;
        return (
          <span style={{ color: currentStatus.color, fontWeight: "400" }}>
            {currentStatus.text}
          </span>
        );
      },
    },

    {
      title: "Trạng thái nhập",
      dataIndex: "statusInput",
      key: "statusInput",
      render: (statusInput) => {
        let color = statusInput === 'not imported' ? 'red' : 'green';
        let text = statusInput === 'not imported' ? 'Chưa nhập' : 'Đã nhập';

        return <span style={{ color, fontWeight: "400" }}>{text}</span>;
      },
    },

    {
      title: "Nhà cung cấp",
      dataIndex: "supplierId",
      key: "supplierId",
      render: (supplierId, record) => record.supplierId[0]?.nameSupplier || 'Không xác định',
      sorter: (a, b) => a.supplierId[0]?.nameSupplier.localeCompare(b.supplierId[0]?.nameSupplier),
    },
    {
      title: "Nhân viên tạo",
      dataIndex: "creator",
      key: "creator",
      render: (creator, record) => record.creator[0]?.createdName || 'Không xác định',
      sorter: (a, b) => a.creator[0]?.createdName.localeCompare(b.creator[0]?.createdName),
    },
    {
      title: "Giá trị",
      dataIndex: "valueInvoice",
      key: "valueInvoice",
      render: (valueInvoice) => `${formatCurrency(valueInvoice)} đ`,
      sorter: (a, b) => a.valueInvoice - b.valueInvoice,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          active: { text: "Đang vận chuyển", color: "blue" },
          paused: { text: "Tạm dừng", color: "#000044" },
          completed: { text: "Đã nhận hàng", color: "green" },
          pending: { text: "Đang chờ xử lý", color: "#8c8c8c" },
          cancelled: { text: "Đã bị hủy", color: "red" },
          failed: { text: "Không thành công", color: "darkred" },
          draft: { text: "Đang ở dạng nháp", color: "#555" },
          default: { text: "" },
        };
        const currentStatus = statusMap[status] || statusMap.default;
        const style = { ...currentStatus, fontWeight: '400', padding: '2px 5px', borderRadius: '4px', display: 'inline-block' };
        return (
          <span style={style}>{currentStatus.text}</span>
        );
      },
    },

    {
      title: "Hành động",
      key: "action",
      align: 'center',
      render: (_, record) => (
        <>
          <Button type="primary" icon={<BookFilled />} onClick={() => navigate(`/invoice/${record._id}`)} />
          <Popconfirm title="Xóa chiến dịch này?" onConfirm={() => handleSoftDeletion(record._id)} okText="Xóa" cancelText="Hủy">
            <Button type="primary" icon={<DeleteOutlined />} danger></Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="nhap-hang-page">
      <div className="header">

        <Input
          placeholder="Tìm kiếm tài khoản..."
          style={{ width: 300, }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="btn btn-primary" onClick={() => navigate("/invoice/create")}>
          + Thêm mới đơn hàng nhập
        </button>

      </div>

      <Table
        columns={columns}
        dataSource={filtered.map((order, index) => ({ ...order, key: order._id || index }))}
        rowKey="key"
        pagination={false} // Ẩn phân trang mặc định của Table
      />
      <Pagination
        current={currentPage}
        total={totalItems}
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
    </div>
  );
};

export default ImportOrders;
