import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker, InputNumber, Tooltip, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddCampaign = () => {
    const [form] = Form.useForm();
    const [productOptions] = useState([
        { value: "6777cebdc3d18219bb6b0fc1", label: "Laptop Dell XPS 15" },
        { value: "676b7ebd899914bfbea74e1", label: "iPhone 15 Pro Max" },
        { value: "67696a18e7ee9e89c3b45e6", label: "Samsung Galaxy S24 Ultra" },
        { value: "6777cebdc3d18219bb6b0fc2", label: "MacBook Air M2" },
        { value: "676b7ebd899914bfbea74e2", label: "Sony WH-1000XM5" },
        { value: "67696a18e7ee9e89c3b45e7", label: "iPad Pro 2024" },
    ]);

    const [filteredProducts, setFilteredProducts] = useState(productOptions);

    const handleSearch = (value) => {
        const filtered = productOptions.filter((product) =>
            product.label.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const onFinish = (values) => {
        console.log("Success:", values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ type: "percentage", value: 0, maxValue: 1000000 }}
            style={{ maxWidth: 1000, margin: "auto" }}
        >
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
                        <Input.Group compact>
                            <Form.Item name="type" noStyle>
                                <Select style={{ width: "30%" }}>
                                    <Option value="percentage">%</Option>
                                    <Option value="amount">Số tiền</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="value" noStyle>
                                <InputNumber style={{ width: "70%" }} min={0} />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>

                    <Form.Item label="Giá trị giảm tối đa" name="maxValue">
                        <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item label="Áp dụng cho" name="appliesTo">
                        <Select>
                            <Option value="items">Sản phẩm</Option>
                            <Option value="orders">Đơn hàng</Option>
                        </Select>
                    </Form.Item>
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
                    <Form.Item label="Danh sách sản phẩm áp dụng" name="productIds">
                        <Select
                            mode="multiple"
                            showSearch
                            placeholder="Tìm kiếm và chọn sản phẩm"
                            options={filteredProducts.map((product) => ({
                                value: product.value,
                                label: (
                                    <Tooltip title={product.label}>
                                        {product.label.length > 30 ? `${product.label.substring(0, 30)}...` : product.label}
                                    </Tooltip>
                                ),
                            }))}
                            onSearch={handleSearch}
                        />
                    </Form.Item>

                    
                </Col>
            </Row>

            <Form.Item label="Mô tả" name="description">
                <Input.TextArea placeholder="VD: Chương trình giảm giá ngày quốc tế phụ nữ." />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                    Tạo mới khuyến mãi
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddCampaign;
