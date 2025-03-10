import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { formatDayTime, formatCurrency } from '../../lib/utils'
import { StoreContext } from '../../context/StoreContext';
import { Table, Button, Switch, Input, Space, Popconfirm } from "antd";
import { UndoOutlined, DeleteOutlined } from "@ant-design/icons";

const TrashCampaigns = () => {
    axios.defaults.withCredentials = true;
    const { url, activeCampaign, deleteCampaign } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [limit, setLimit] = useState(7);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchText, setSearchText] = useState("");

    const fetchCampaignList = async (page = 1, limit = 8) => {
        try {
            const response = await axios.get(`${url}/v1/api/product/campaign/trash/paginate?page=${page}&limit=${limit}`);
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

    const handleRestore = async (key) => {
        await activeCampaign(key)
        fetchCampaignList(currentPage);
    };

    const handleDeletePermanently = async (key) => {
        await deleteCampaign(key)
        fetchCampaignList(currentPage);
    };

    const columns = [
        { title: "Mã khuyến mãi", dataIndex: "code", key: "code" },
        { title: "Tên chiến dịch", dataIndex: "name", key: "name" },
        {
            title: "Giá trị", dataIndex: "value", key: "value",
            render: (value, record) =>
                record.type === "percentage" ? `${formatCurrency(value)}%` : `${formatCurrency(value)} VNĐ`,
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
        { title: "Ngày bắt đầu", dataIndex: "startDate", key: "startDate", render: (startDate, record) => formatDayTime(record.startDate), },
        { title: "Ngày kết thúc", dataIndex: "endDate", key: "endDate", render: (endDate, record) => formatDayTime(record.endDate), },
        {
            title: "Hành động",
            key: "actions",
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button icon={<UndoOutlined />} onClick={() => handleRestore(record._id)}>
                        Khôi phục
                    </Button>
                    <Popconfirm title="Xóa vĩnh viễn chiến dịch này?" onConfirm={() => handleDeletePermanently(record._id)} okText="Xóa" cancelText="Hủy">
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
                dataSource={list.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase())).map((item) => ({ ...item, key: item._id || item.code }))}
                pagination={{ pageSize: limit }}
            />
        </div>
    );
};

export default TrashCampaigns;
