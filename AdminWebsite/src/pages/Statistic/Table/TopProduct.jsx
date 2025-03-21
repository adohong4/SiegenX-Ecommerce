import React from 'react';
import { Table } from "antd";
import { StoreContext } from '../../../context/StoreContext';

const TopProduct = ({ table }) => {
    const topProducts = table.slice(0, 5);

    const columns = [
        {
            key: "index",
            render: (text, record, index) => {
                const isTopThree = index < 3;
                return (
                    <span style={{
                        borderRadius: isTopThree ? '50%' : '0',
                        backgroundColor: isTopThree ? 'black' : 'transparent',
                        color: isTopThree ? 'white' : 'black',
                        padding: '5px 10px',
                    }}>
                        {index + 1}
                    </span>
                );
            },
        },
        {
            key: "image",
            render: (text, record) => (
                <img src={`http://localhost:9003/images/${record.image}`} alt="" style={{ width: '50px', height: '50px' }} />
            ),
        },
        {
            key: "title",
            render: (text, record) => record.title,
        },
        {
            key: "quantity",
            render: (text, record) => record.quantity,
        },
    ];

    return (
        <div style={{ width: '50%' }}>
            <h2>Top 5 sản phẩm bán chạy</h2>
            <Table
                columns={columns}
                dataSource={topProducts}
                pagination={false}
                rowKey={(record) => record.id} // Giả sử mỗi sản phẩm có id duy nhất
            />
        </div>
    );
}

export default TopProduct;
