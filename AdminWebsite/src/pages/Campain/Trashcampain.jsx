import React, { useState } from "react";
import { Table, Button, Switch, Input, Space, Popconfirm } from "antd";
import { UndoOutlined, DeleteOutlined } from "@ant-design/icons";

const TrashCampaigns = () => {
    const [searchText, setSearchText] = useState("");
    const [deletedCampaigns, setDeletedCampaigns] = useState([
        {
            key: "1",
            code: "WOMANDAY83",
            name: "Ngày quốc tế phụ nữ",
            value: "20%",
            status: false,
            startDate: "2025-03-05",
            endDate: "2025-03-15",
        },
        {
            key: "2",
            code: "BUY2GET10",
            name: "Mua 2 sản phẩm, tặng 1 voucher 10k",
            value: "10,000 VND",
            status: false,
            startDate: "2025-04-01",
            endDate: "2025-04-10",
        },
        {
            key: "3",
            code: "NEWYEAR10",
            name: "Giảm 10k / 1 sản phẩm nhân dịp chào mừng năm mới",
            value: "10,000 VND",
            status: false,
            startDate: "2025-01-01",
            endDate: "2025-01-10",
        },
    ]);

    const handleRestore = (key) => {
        setDeletedCampaigns(deletedCampaigns.filter((item) => item.key !== key));
    };

    const handleDeletePermanently = (key) => {
        setDeletedCampaigns(deletedCampaigns.filter((item) => item.key !== key));
    };

    const columns = [
        { title: "Mã khuyến mãi", dataIndex: "code", key: "code" },
        { title: "Tên chiến dịch", dataIndex: "name", key: "name" },
        { title: "Giá trị", dataIndex: "value", key: "value" },
        { title: "Trạng thái", dataIndex: "status", key: "status", render: (status) => <Switch disabled checked={status} /> },
        { title: "Ngày bắt đầu", dataIndex: "startDate", key: "startDate" },
        { title: "Ngày kết thúc", dataIndex: "endDate", key: "endDate" },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<UndoOutlined />} onClick={() => handleRestore(record.key)}>
                        Khôi phục
                    </Button>
                    <Popconfirm title="Xóa vĩnh viễn chiến dịch này?" onConfirm={() => handleDeletePermanently(record.key)} okText="Xóa" cancelText="Hủy">
                        <Button icon={<DeleteOutlined />} danger>
                            Xóa vĩnh viễn
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Input.Search placeholder="Tìm kiếm khuyến mãi" onChange={(e) => setSearchText(e.target.value)} style={{ marginBottom: 16, width: 300 }} />
            <Table
                columns={columns}
                dataSource={deletedCampaigns.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))}
                pagination={{ pageSize: 2 }}
            />
        </div>
    );
};

export default TrashCampaigns;
