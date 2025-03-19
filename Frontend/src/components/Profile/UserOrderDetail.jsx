import React, { useEffect, useContext, useState, useRef } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Descriptions, Table, Button } from 'antd';
import { formatHourDayTime, formatCurrency } from '../../lib/utils';
import '../Styles/Styles.css'


const OrderDetail = () => {
    const { id } = useParams();
    const { url } = useContext(StoreContext);
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const fetchOrderDetail = async (id) => {
        const response = await axios.get(`${url}/v1/api/profile/order/get/${id}`);
        setOrder(response.data.metadata);
    };

    useEffect(() => {
        fetchOrderDetail(id)
    }, [id]);

    const columnsItem = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'title',
        },
        {
            title: 'Phân loại',
            dataIndex: 'category',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (text) => `₫${formatCurrency(text)}`
        }
    ];

    const columnsCreator = [
        {
            title: 'Người thực hiện',
            dataIndex: 'createdBy',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: (text) => formatHourDayTime(text)
        }
    ];

    if (!order) return <p>Đang tải chi tiết đơn hàng...</p>;

    return (
        <div className="user-order-detail">

            <Descriptions title="Thông tin Đơn hàng" column={1} bordered>
                <Descriptions.Item label="Mã hóa đơn">: {order._id}</Descriptions.Item>
                <Descriptions.Item label="Khách hàng">: {order.address.fullname}</Descriptions.Item>
                <Descriptions.Item label="Đơn giá">: {formatCurrency(order.amount)} VNĐ</Descriptions.Item>
                <Descriptions.Item label="Ngày đặt hàng">: {formatHourDayTime(order.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">: {order.paymentMethod}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái thanh toán">: {order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái hóa đơn">: {order.status}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">: {order.address.street}, {order.address.precinct}, {order.address.city}, {order.address.province}</Descriptions.Item>
            </Descriptions>

            <h4 className="user-order-detail__title">Danh sách sản phẩm</h4>
            <Table
                columns={columnsItem}
                dataSource={order.items?.map((item, index) => ({
                    ...item,
                    key: item.id || index
                }))}
                rowKey={(record) => record.key}
                pagination={false}
                className="user-order-detail__table"
            />

            <Button
                type="primary"
                className="user-order-detail__btn"
                onClick={() => navigate('/user/orders')}
            >
                Quay lại
            </Button>

        </div>
    );
};

export default OrderDetail;
