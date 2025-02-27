import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
// import { StoreContext } from '../../../context/StoreContext';
import { fakePaymentsData } from "../../data/Enviroment";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = () => {
    // const { url, order_list, fetchOrder } = useContext(StoreContext);

    const [payments, setPayments] = useState([]);

    const fetchFactors = async () => {
        const response = await axios.get(`${url}/v1/api/profile/order/statistical`);

        if (response.data.status) {
            setPayments(response.data.metadata);
        }
    };

    // useEffect(() => {
    //     fetchFactors();
    // }, [url]);


    useEffect(() => {
        setPayments(fakePaymentsData);
    }, []);


    const chartData = {
        labels: payments.map(payment => {
            return payment.date;
        }),
        datasets: [
            {
                label: 'Doanh thu hàng ngày',
                data: payments.map(payment => payment.totalAmount),
                fill: false, // Không tô màu dưới đường
                backgroundColor: 'rgba(255, 69, 0, 1)',
                borderColor: 'rgba(255, 69, 0, 1)', // Màu đường
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="chart-factors">
            <div className="orders-status">
                <div className='orders'>
                    {/* Chart for User Factors */}
                    <div className='orders-right-2'>
                        <Line data={chartData} options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                },
                            },
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineChart;