import React from 'react';
import { Table } from "antd";

const categoryTable = ({ category }) => {
    // Kiểm tra nếu category không tồn tại hoặc rỗng
    if (!category || category.length === 0) {
        return (
            <div>
                <h2>BÁO CÁO DOANH THU THEO PHÂN LOẠI</h2>
                <p>Không có dữ liệu để hiển thị</p>
            </div>
        );
    }

    // Cột động dựa trên danh mục
    const dynamicColumns = category.map((cat, index) => ({
        title: cat.category,
        dataIndex: `category${index}`,
        key: `category${index}`,
        align: 'center',
        onCell: () => ({
            style: {
                fontSize: '13px', // Font-size cho nội dung ô
            },
        }),
        onHeaderCell: () => ({
            style: {
                fontSize: '14px', // Font-size cho header
                fontWeight: 'bold',
            },
        }),
    }));

    // Cột cố định: Tiêu chí (Số lượng, Doanh thu)
    const columns = [
        {
            title: "",
            dataIndex: "criteria",
            key: "criteria",
            align: 'left',
            onCell: () => ({
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
            }),
        },
        ...dynamicColumns,
    ];

    const dataSource = [
        {
            key: '1',
            criteria: "Số lượng",
            ...category.reduce((acc, cat, index) => {
                acc[`category${index}`] = cat.totalQuantity ?? 0;
                return acc;
            }, {}),
        },
        {
            key: '2',
            criteria: "Doanh thu",
            ...category.reduce((acc, cat, index) => {
                const revenue = cat.totalRevenue ?? 0;
                acc[`category${index}`] = revenue.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                });
                return acc;
            }, {}),
        },
    ];

    return (
        <div className='col-7'>
            <h2>BÁO CÁO DOANH THU THEO PHÂN LOẠI</h2>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered
            />
            <div className="revenue-notes">
                <h4>Ghi chú:</h4>
                <ul>
                    <li>Số liệu được tổng hợp tự động từ hệ thống bán hàng.</li>
                    <li>Phân loại sản phẩm sắp xếp theo doanh thu giảm dần.</li>
                    <li>Chỉ tiêu chưa bao gồm thuế và các khoản giảm trừ.</li>
                    <li>Dữ liệu phục vụ cho việc đánh giá và lập kế hoạch kinh doanh.</li>
                </ul>
            </div>
        </div>
    );
};

export default categoryTable;