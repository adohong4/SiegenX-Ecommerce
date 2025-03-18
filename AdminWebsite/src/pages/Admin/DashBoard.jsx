import React from "react";
import { Row, Col, Card } from "antd";
import { BarChartOutlined, LineChartOutlined, TableOutlined } from "@ant-design/icons";
import Factors from "../../components/DashBoardItem/Factors";
import ColumnChart from "../../components/DashBoardItem/ColumnChart";
import OrderTable from "../../components/DashBoardItem/OrderTable";
import LineChart from "../../components/DashBoardItem/LineChart";

const DashBoard = () => {
    return (
        <div className="Dashboard" style={{ padding: 20 }}>
            {/* Phần Thống Kê */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card bordered={false} style={{ borderRadius: 10 }}>
                        <Factors />
                    </Card>
                </Col>
            </Row>

            {/* Phần Biểu Đồ & Bảng Đơn Hàng */}
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col span={14}>
                    <Card
                        title={
                            <>
                                <BarChartOutlined /> Biểu đồ thống kê
                            </>
                        }
                        bordered={false}
                        style={{ borderRadius: 10 }}
                    >
                        <ColumnChart />
                    </Card>
                </Col>
                <Col span={10}>
                    <Card
                        title={
                            <>
                                <TableOutlined /> Giao dịch gần đây
                            </>
                        }
                        bordered={false}
                        style={{ borderRadius: 10 }}
                    >
                        <OrderTable />
                    </Card>
                </Col>
            </Row>

            {/* Phần Biểu Đồ Đường */}
            {/* <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col span={24}>
                    <Card
                        title={
                            <>
                                <LineChartOutlined /> Xu hướng doanh thu
                            </>
                        }
                        bordered={false}
                        style={{ borderRadius: 10 }}
                    >
                        <LineChart />
                    </Card>
                </Col>
            </Row> */}
        </div>
    );
};

export default DashBoard;
