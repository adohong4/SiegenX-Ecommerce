import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import { formatDayTime, formatCurrency } from '../../lib/utils';
import { Form, Input, Button, Select, DatePicker, InputNumber, Tooltip, Row, Col, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Divider } from 'antd';
import { BulbOutlined, BarChartOutlined, GiftOutlined, PercentageOutlined, ClockCircleOutlined, AppstoreOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddCampaign = () => {
    axios.defaults.withCredentials = true;
    const { url, product_list } = useContext(StoreContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [appliesTo, setAppliesTo] = useState('items');
    const [type, setType] = useState('percentage');
    const [filteredProducts, setFilteredProducts] = useState(product_list);

    const handleSearch = (value) => {
        const filtered = product_list.filter((product) =>
            product.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const onFinish = async (values) => {
        try {
            console.log(values);
            const response = await axios.post(`${url}/v1/api/product/campaign/create`, values);
            toast.success(response.data.message)
            console.log("Tạo mới chiến dịch thành công!");
            navigate('/list-campaign')
        } catch (error) {
            console.error("Lỗi khi cập nhật chiến dịch:", error);
            toast.error(response.data.message)
            throw error;
        }
    };

    return (
        <div style={{ display: 'flex', gap: '24px', maxWidth: 1200, margin: 'auto' }}>
            <div style={{ flex: 3 }}>
                <Card title=" Cấu hình chiến dịch" bordered={false} style={{ marginBottom: 24 }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ type: "percentage", value: 0, maxValue: 1000000 }}
                    >
                        {/* Phần 1 */}
                        <Form.Item
                            label="Tên chiến dịch"
                            name="name"
                            rules={[{ required: true, message: "Vui lòng nhập tên chiến dịch!" }]}
                        >
                            <Input placeholder="VD: Sale Xuân 2025" />
                        </Form.Item>

                        <Form.Item
                            label="Mã khuyến mãi"
                            name="code"
                            rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi!" }]}
                        >
                            <Input placeholder="VD: SPRING25" />
                        </Form.Item>

                        <Form.Item label="Loại khuyến mãi">
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

                        {/* Phần 2 */}
                        <Divider />

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
                                        value: product._id,
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

                        <Form.Item label="Mô tả" name="description">
                            <Input.TextArea placeholder="VD: Chương trình giảm giá ngày quốc tế phụ nữ." />
                        </Form.Item>

                        <Form.Item style={{ textAlign: "left" }}>
                            <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                                Tạo mới
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>

            <div style={{ flex: 1 }}>
                {/* Box Lưu ý */}
                <Card
                    title={<><BulbOutlined style={{ marginRight: 8 }} />Lưu ý</>}
                    bordered={false}
                    style={{ marginBottom: 24 }}
                >
                    <p><GiftOutlined style={{ color: '#faad14', marginRight: 8 }} /> Tên & mã chiến dịch không nên trùng nhau.</p>
                    <p><PercentageOutlined style={{ color: '#13c2c2', marginRight: 8 }} /> Giá trị % nên nhỏ hơn 100%.</p>
                    <p><ClockCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} /> Chọn thời gian hợp lý để khuyến mãi phát huy tối đa.</p>
                </Card>

                {/* Box Thống kê */}
                <Card
                    title={<><BarChartOutlined style={{ marginRight: 8 }} />Thống kê nhanh</>}
                    bordered={false}
                >
                    <p><AppstoreOutlined style={{ color: '#1890ff', marginRight: 8 }} /> Tổng số sản phẩm: {product_list.length}</p>
                    <p><SearchOutlined style={{ color: '#722ed1', marginRight: 8 }} /> Bạn có thể chọn áp dụng từng sản phẩm hoặc toàn bộ.</p>
                </Card>
            </div>
        </div>
    );
};

export default AddCampaign;
