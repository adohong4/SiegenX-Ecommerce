import React from 'react';
import { Table } from "antd";
import { StoreContext } from '../../../context/StoreContext';

const TopProduct = ({ table }) => {
    const topProducts = table.slice(0, 5);

    const columns = [
        {
            key: "index",
            render: (text, record, index) => {
                const colors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Vàng, Bạc, Đồng
                const isTopThree = index < 3;
                return (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        width: '30px',
                        height: '30px',
                        backgroundColor: isTopThree ? colors[index] : '#fff',
                        color: isTopThree ? '#000' : '#000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        boxShadow: isTopThree ? '0 0 5px rgba(0,0,0,0.2)' : 'none'
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
        <div className='top-5-sp col-6'>
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
