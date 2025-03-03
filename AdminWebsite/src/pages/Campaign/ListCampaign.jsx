import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import '../styles/styles.css'
import { StoreContext } from '../../context/StoreContext';
import { formatDayTime, formatCurrency } from '../../lib/utils'
import { Table, Switch, Modal, Button, Select, Input, Popconfirm, Descriptions } from "antd";
import { DeleteOutlined, PlusOutlined, BookFilled, EditFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CampaignPage = () => {
  axios.defaults.withCredentials = true;
  const { url, activeCampaign } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [limit, setLimit] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [viewingCampaign, setViewingCampaign] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const navigate = useNavigate();

  const fetchCampaignList = async (page = 1, limit = 8) => {
    try {
      const response = await axios.get(`${url}/v1/api/product/campaign/paginate?page=${page}&limit=${limit}`);
      if (response.data.message) {
        setList(response.data.metadata.campaign);
        setLimit(limit)
        setTotalItems(response.data.metadata.totalCampaign);
        setTotalPages(response.data.metadata.totalPages);
      }
    } catch (error) {
      console.error('Xảy ra ngoại lệ khi lấy dữ liệu liên hệ');
    }
  };

  useEffect(() => {
    fetchCampaignList(currentPage);
  }, [currentPage]);

  const handleDelete = async (code) => {
    await activeCampaign(code);
    fetchCampaignList(currentPage);
  };

  const handleInfor = (id) => {
    navigate(`/list-campaign/${id}`);
  };

  const showViewModal = (campaign) => {
    setViewingCampaign(campaign);
    setIsViewModalOpen(true);
  };

  const handleAddCampaign = () => {
    navigate("/add-campaign");
  };

  // Lọc dữ liệu theo tìm kiếm và loại khuyến mãi
  const filteredCampaigns = list.filter((campaign) => {
    return (
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType ? campaign.type === selectedType : true) &&
      (selectedStatus ? campaign.status === selectedStatus : true)
    );
  });

  const columns = [
    {
      title: "Mã khuyến mãi",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (value, record) =>
        record.type === "percentage" ? `${formatCurrency(value)}%` : `${formatCurrency(value)} VNĐ`,
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        record.status === 'active' ? 'Hoạt động'
          : record.status === 'paused' ? 'Tạm dừng'
            : record.status === 'completed' ? 'Thành công'
              : record.status === 'pending' ? 'Chờ xử lý'
                : record.status === 'cancelled' ? 'Bị hủy'
                  : record.status === 'failed' ? 'Thất bại' : 'Nháp'
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate, record) => formatDayTime(record.startDate),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate, record) => formatDayTime(record.endDate),
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="primary" icon={<BookFilled style={{ color: "orange" }} />} onClick={() => showViewModal(record)} />
          <Button type="primary" icon={<EditFilled />} onClick={() => handleInfor(record._id)} />
          <Popconfirm title="Xóa chiến dịch này?" onConfirm={() => handleDelete(record._id)} okText="Xóa" cancelText="Hủy">
            <Button type="primary" icon={<DeleteOutlined />} danger></Button>
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
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm khuyến mãi"
          style={{
            width: 200,
            marginRight: 8,
            backgroundColor: '#ffff',
            border: '1px solid rgb(134, 134, 134)',
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          placeholder="Loại khuyến mãi"
          style={{ width: 150, marginRight: 8, border: '1px solid rgb(134, 134, 134)', }}
          value={selectedType}
          onChange={(value) => setSelectedType(value)}
          allowClear
        >
          <Option value="percentage">Giảm giá %</Option>
          <Option value="fixed_amount">Giảm giá cố định</Option>
        </Select>
        <Select
          placeholder="Trạng thái"
          style={{ width: 150, marginRight: 8, border: '1px solid rgb(134, 134, 134)', }}
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          allowClear
        >
          <Option value="active">Hoạt động</Option>
          <Option value="paused">Tạm dừng</Option>
          <Option value="completed">Kết thúc</Option>
          <Option value="pending">Chờ xử lý</Option>
          <Option value="cancelled">Bị hủy</Option>
          <Option value="failed">Thất bại</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: 8 }} onClick={handleAddCampaign}>
          Thêm mới chiến dịch
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredCampaigns.map((campaign, index) => ({ ...campaign, key: campaign._id || index }))}
        rowKey="key"
        pagination={{ pageSize: limit }}
      />

      {/* Modal thông tin chiến dịch */}
      <Modal
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
      >
        {viewingCampaign && (
          <div>
            <Descriptions title="Thông tin chiến dịch" column={1} bordered className="custom-descriptions">
              <Descriptions.Item label="Tên chiến dịch">{viewingCampaign.name}</Descriptions.Item>
              <Descriptions.Item label="Mô tả">{viewingCampaign.description}</Descriptions.Item>
              <Descriptions.Item label="Mã khuyến mại">{viewingCampaign.code}</Descriptions.Item>
              <Descriptions.Item label="Giảm giá">
                {formatCurrency(viewingCampaign.value)}
                {viewingCampaign.type === 'percentage' ? '%' : 'VNĐ'}
              </Descriptions.Item>
              {viewingCampaign.type === 'percentage' && (
                <Descriptions.Item label="Giảm giá tối đa">
                  {formatCurrency(viewingCampaign.maxValue)} VNĐ
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Ngày bắt đầu">{formatDayTime(viewingCampaign.startDate)}</Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">{formatDayTime(viewingCampaign.endDate)}</Descriptions.Item>
              <Descriptions.Item label="Áp dụng">
                {viewingCampaign.appliesTo === 'all' ? 'Tất cả sản phẩm' : 'Từng loại sản phẩm'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {viewingCampaign.status === 'active' ? 'Hoạt động'
                  : viewingCampaign.status === 'paused' ? 'Tạm dừng'
                    : viewingCampaign.status === 'completed' ? 'Kết thúc'
                      : viewingCampaign.status === 'pending' ? 'Chờ xử lý'
                        : viewingCampaign.status === 'cancelled' ? 'Bị hủy'
                          : viewingCampaign.status === 'failed' ? 'Thất bại'
                            : 'Nháp'}
              </Descriptions.Item>
            </Descriptions>
            <h3>Lịch sử thay đổi</h3>
            <Table
              columns={columnsCreator}
              dataSource={viewingCampaign.creator?.map((item, index) => ({
                ...item,
                key: `${item.createdBy || 'unknown'}-${index}`,
              }))}
              pagination={{ pageSize: 4 }}
              rowKey={(record) => record.key}
            />
          </div>
        )}
      </Modal>

    </div>
  );
};

export default CampaignPage;
