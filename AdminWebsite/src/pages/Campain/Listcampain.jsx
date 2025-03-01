import React, { useState } from "react";
import { Table, Switch, Button, Select, Input } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { campainlist } from "../../data/Enviroment";

const { Option } = Select;

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState(campainlist);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const navigate = useNavigate();

  const handleToggle = (code) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.code === code ? { ...campaign, status: !campaign.status } : campaign
      )
    );
  };

  const handleDelete = (code) => {
    setCampaigns((prev) => prev.filter((campaign) => campaign.code !== code));
  };

  const handleAddCampaign = () => {
    navigate("/add-campaign");
  };

  // Lọc dữ liệu theo tìm kiếm và loại khuyến mãi
  const filteredCampaigns = campaigns.filter((campaign) => {
    return (
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType ? campaign.type === selectedType : true)
    );
  });

  const columns = [
    {
      title: "Mã khuyến mãi",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (value, record) =>
        record.type === "percentage" ? `${value}%` : `${value} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch checked={status} onChange={() => handleToggle(record.code)} />
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.code)} />
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm khuyến mãi"
          style={{ width: 200, marginRight: 8 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          placeholder="Loại khuyến mãi"
          style={{ width: 150, marginRight: 8 }}
          value={selectedType}
          onChange={(value) => setSelectedType(value)}
          allowClear
        >
          <Option value="percentage">Giảm giá %</Option>
          <Option value="fixed">Giảm giá cố định</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: 8 }} onClick={handleAddCampaign}>
          Thêm mới chiến dịch
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredCampaigns} rowKey="code" />
    </div>
  );
};

export default CampaignPage;
