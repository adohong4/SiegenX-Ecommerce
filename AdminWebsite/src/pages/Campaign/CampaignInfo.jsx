import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDayTime, formatCurrency } from '../../lib/utils';
import { Form, Input, Button, Select, DatePicker, InputNumber, Tooltip, Row, Col, Space, message, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { StoreContext } from '../../context/StoreContext';
import moment from 'moment';
const { Option } = Select;

const CampaignInfo = () => {
    axios.defaults.withCredentials = true;
    const { id } = useParams();
    const { url, product_list } = useContext(StoreContext);
    const [campaign, setCampaign] = useState(null);
    const [form] = Form.useForm();
    const [filteredProducts, setFilteredProducts] = useState(product_list);
    const [appliesTo, setAppliesTo] = useState('items');
    const [type, setType] = useState('percentage');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchCampaignId = async () => {
            try {
                const response = await axios.get(`${url}/v1/api/product/campaign/get/${id}`);
                setCampaign(response.data.metadata);
                if (response.data.metadata) {
                    form.setFieldsValue({
                        name: response.data.metadata.name,
                        description: response.data.metadata.description,
                        type: response.data.metadata.type,
                        value: response.data.metadata.value,
                        code: response.data.metadata.code,
                        startDate: response.data.metadata.startDate ? moment(response.data.metadata.startDate) : null, // Chuyển đổi thành moment
                        endDate: response.data.metadata.endDate ? moment(response.data.metadata.endDate) : null,
                        status: response.data.metadata.status,
                        maxValue: response.data.metadata.maxValue,
                        appliesTo: response.data.metadata.appliesTo,
                        productIds: response.data.metadata.productIds || [],
                    });
                    setType(response.data.metadata.type);
                }
            } catch (error) {
                console.error("Lỗi khi lấy hóa đơn nhập:", error);
            }
        };
        fetchCampaignId();
    }, [id, url, form]);

    const handleSearch = (value) => {
        const filtered = filteredProducts.filter((product) =>
            product.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const onFinish = async (values) => {
        try {
            const response = await axios.put(`${url}/v1/api/product/campaign/update/${id}`, values);
            toast.success(response.data.message)
        } catch (error) {
            console.error("Lỗi khi cập nhật chiến dịch:", error);
            toast.error(error.response.data.message)
            throw error;
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ type: "percentage", value: 0, maxValue: 1000000 }}
            style={{ padding:"20px", margin: "auto" }}
        >
            <Form.Item style={{ textAlign: "right" }}>
                <Button type="primary" style={{ marginLeft: '16px' }} onClick={() => navigate('/list-campaign')}>
                    ←  Quay lại danh sách
                </Button>
            </Form.Item>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Tên chiến dịch"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên chiến dịch!" }]}
                    >
                        <Input placeholder="VD: Ngày quốc tế phụ nữ" />
                    </Form.Item>

                    <Form.Item
                        label="Mã khuyến mãi"
                        name="code"
                        rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi!" }]}
                    >
                        <Input placeholder="VD: WOMANDAY83" />
                    </Form.Item>

                    <Form.Item label="Giá trị khuyến mãi">
                        <Space.Compact>
                            <Form.Item name="type" noStyle>
                                <Select onChange={(value) => setType(value)} style={{ width: "40%" }}>
                                    <Option value="percentage">%</Option>
                                    <Option value="fixed_amount">Số tiền</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="value" noStyle>
                                <InputNumber style={{ width: "70%" }} min={0} formatter={(value) => formatCurrency(value)} />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                    {type === 'percentage' && (
                        <Form.Item label="Giá trị giảm tối đa" name="maxValue">
                            <InputNumber style={{ width: "100%" }} min={0} formatter={(value) => formatCurrency(value)} />
                        </Form.Item>
                    )}

                    <Form.Item label="Trạng thái chiến dịch" name="status">
                        <Select>
                            <Option value="active">Hoạt động</Option>
                            <Option value="paused">Tạm dừng</Option>
                            <Option value="completed">Kết thúc</Option>
                            <Option value="pending">Chờ xử lý</Option>
                            <Option value="cancelled">Bị hủy</Option>
                            <Option value="failed">Thất bại</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item label="Thời gian">
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item name="startDate" noStyle>
                                    <DatePicker showTime format="YYYY-MM-DDTHH:mm:ss[Z]" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="endDate" noStyle>
                                    <DatePicker showTime format="YYYY-MM-DDTHH:mm:ss[Z]" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="Áp dụng cho" name="appliesTo">
                        <Select onChange={(value) => setAppliesTo(value)}>
                            <Option value="items">Từng sản phẩm</Option>
                            <Option value="all">Toàn bộ sản phẩm</Option>
                        </Select>
                    </Form.Item>
                    {appliesTo === 'items' && (
                        <Form.Item label="Danh sách sản phẩm áp dụng" name="productIds">
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder="Tìm kiếm và chọn sản phẩm"
                                options={filteredProducts.map((product) => ({
                                    value: product._id, // Sử dụng _id làm giá trị
                                    label: (
                                        <Tooltip title={product.title}>
                                            {product.title.length > 60 ? `${product.title.substring(0, 60)}...` : product.title}
                                        </Tooltip>
                                    ),
                                }))}
                                onSearch={handleSearch}
                            />
                        </Form.Item>
                    )}

                </Col>
            </Row>

            <Form.Item label="Mô tả" name="description">
                <Input.TextArea placeholder="VD: Chương trình giảm giá ngày quốc tế phụ nữ." />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                    Cập nhật khuyến mãi
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CampaignInfo;
