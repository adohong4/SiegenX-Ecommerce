import React, { useEffect, useContext } from 'react';
import { Table } from "antd";
import { StoreContext } from '../../../context/StoreContext';

const ProductStatis = ({ table }) => {
    const { invoiceStatistic, fectchInvoiceStatistic } = useContext(StoreContext);

    useEffect(() => {
        fectchInvoiceStatistic();
    }, []);

    const getAvgPriceInput = (productId) => {
        const productStat = invoiceStatistic.find(
            (stat) => stat.productId === productId
        );
        return productStat ? productStat.avgPriceInput : 0;
    };
    // console.log("table: ", table);

    const dataSource = table.map(item => {
        const avgPriceInput = getAvgPriceInput(item._id); // Đơn giá
        const revenue = item.price * item.quantity; // Doanh thu = Giá bán * Đơn vị bán
        const cost = avgPriceInput * item.quantity; // Giá vốn = Đơn giá * Đơn vị bán
        const contributionProfit = revenue - cost; // Lợi nhuận đóng góp = Doanh thu - Giá vốn
        const grossProfitMargin = revenue !== 0 ? (contributionProfit / revenue * 100).toFixed(2) : 0; // Biên lợi nhuận gộp = (Lợi nhuận đóng góp / Doanh thu) * 100%

        return {
            ...item,
            key: item._id,
            priceImport: avgPriceInput, // Đơn giá
            revenue: revenue,           // Doanh thu
            cost: cost,                 // Giá vốn
            contributionProfit: contributionProfit, // Lợi nhuận đóng góp
            grossProfitMargin: `${grossProfitMargin}%` // Biên lợi nhuận gộp
        };
    });

    const columns = [
        {
            title: "Hình ảnh", key: "image",
            render: (text, record) => (
                <img src={`http://localhost:9003/images/${record.image}`} alt="" style={{ width: '50px', height: '50px' }} />
            ),
        },
        {
            title: "Mã sản phẩm",
            dataIndex: "_id",
            key: "_id",
            sorter: (a, b) => a._id.localeCompare(b._id),
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Giá bán",
            dataIndex: "price",
            key: "price",
            sorter: (a, b) => a.price - b.price,
            render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: "Đơn giá nhập",
            dataIndex: "priceImport",
            key: "priceImport",
            sorter: (a, b) => a.priceImport - b.priceImport,
            render: (priceImport) => priceImport.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: "Đơn vị đã bán",
            dataIndex: "quantity",
            key: "quantity",
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: "Doanh thu",
            dataIndex: "revenue",
            key: "revenue",
            sorter: (a, b) => a.revenue - b.revenue,
            render: (revenue) => revenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: "Giá vốn",
            dataIndex: "cost",
            key: "cost",
            sorter: (a, b) => a.cost - b.cost,
            render: (cost) => cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: "Lợi nhuận đóng góp",
            dataIndex: "contributionProfit",
            key: "contributionProfit",
            sorter: (a, b) => a.contributionProfit - b.contributionProfit,
            render: (contributionProfit) => (
                <span style={{ color: parseFloat(contributionProfit) > 0 ? 'green' : 'red' }}>
                    {parseFloat(contributionProfit).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
            ),
        },
        {
            title: "Biên lợi nhuận gộp",
            dataIndex: "grossProfitMargin",
            key: "grossProfitMargin",
            sorter: (a, b) => parseFloat(a.grossProfitMargin) - parseFloat(b.grossProfitMargin),
            render: (grossProfitMargin) => (
                <span style={{ color: parseFloat(grossProfitMargin) > 0 ? 'green' : 'red' }}>
                    {grossProfitMargin}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div>
                <h2>BÁO CÁO DOANH THU THEO SẢN PHẨM</h2>
                <button>In Excel</button>
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default ProductStatis;