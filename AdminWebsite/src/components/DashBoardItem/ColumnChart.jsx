
import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { StoreContext } from '../../context/StoreContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Factors = () => {
    const { product_list, users, order, contacts } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState([]);
    const [product, setProduct] = useState([]);
    const [contact, setContact] = useState([]);

    useEffect(() => {
        setUser(users?.length);
        setProduct(product_list?.length);
        setOrders(order?.length);
        setContact(contacts?.length);
    }, []);

    const chartData = {
        labels: ['Người dùng', 'Sản phẩm', 'Đơn hàng', 'Liên hệ'],
        datasets: [
            {
                label: 'Người dùng',
                data: [
                    user,
                    product,
                    orders,
                    contact,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Color for Total Users
                    'rgba(255, 99, 132, 0.6)', // Color for Total Orders
                    'rgba(255, 206, 86, 0.6)', // Color for Total Foods
                    'rgba(54, 162, 235, 0.6)', // Color for Total Revenue
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            },
        ],
    };

    return (
        <div className="column-chart-container">
            <div className='orders-right-2'>
                <Bar data={chartData} options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Tổng quan'
                        }
                    }
                }} />
            </div>
        </div>
    );
};

export default Factors;
