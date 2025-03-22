import React, { useEffect, useContext } from 'react';
import { Table } from "antd";
import { StoreContext } from '../../../context/StoreContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const categoryStatistic = ({ category }) => {

    const data = {
        labels: category.map(item => item.category),
        datasets: [
            {
                label: 'Tổng số lượng',
                data: category.map(item => item.totalQuantity),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',  // MH quảng cáo LCD
                    'rgba(54, 162, 235, 0.6)',  // Quảng cáo 3D (OOH)
                    'rgba(255, 206, 86, 0.6)',  // Màn hình LED
                    'rgba(75, 192, 192, 0.6)',  // KTV 5D
                    'rgba(153, 102, 255, 0.6)', // MH tương tác
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
                    }
                }
            }
        },
    };

    return (
        <div className='col-5' style={{ margin: '0 auto', padding: "0px 50px" }}>
            <h2>Biểu đồ tròn phân bố sản phẩm theo category</h2>
            {category?.length > 0 ? (
                <Pie data={data} options={options} />
            ) : (
                <p>Không có dữ liệu để hiển thị</p>
            )}
        </div>
    )
}

export default categoryStatistic;
