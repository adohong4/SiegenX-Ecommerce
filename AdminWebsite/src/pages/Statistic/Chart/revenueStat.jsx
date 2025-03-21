import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueStat = () => {
    const { url } = useContext(StoreContext);
    axios.defaults.withCredentials = true;
    const [selectedTime, setSelectedTime] = useState('week');
    const [revenue, setRevenue] = useState({ time: '', totalRevenue: 0, data: [] });

    const fetchRevenue = async (time) => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/statistic/revenue/${time}`);
            if (response.data.status === 200) {
                setRevenue(response.data.metadata);
            }
        } catch (error) {
            toast.error(error.response.data.message || 'Lỗi kết nối server');
        }
    };

    useEffect(() => {
        fetchRevenue(selectedTime);
    }, [selectedTime]);

    const chartData = {
        labels: revenue.data.map(item => item.day || item.month || item.year),
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: revenue.data.map(item => item.totalRevenue),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
            title: {
                display: true,
                text: `Biểu đồ doanh thu theo ${selectedTime === 'week' ? 'ngày' : selectedTime === 'month' ? 'tháng' : 'năm'}`,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw || 0;
                        return `Doanh thu: ${value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                    }
                }
            }
        }
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    return (
        <div className='doanhthu-chart col-6'>
            <h2>Biểu đồ doanh thu</h2>
            <div className="custom-tabs">
                <div
                    className={`tab-item ${selectedTime === 'week' ? 'active' : ''}`}
                    onClick={() => handleTimeChange('week')}
                >
                    Tuần
                </div>
                <div
                    className={`tab-item ${selectedTime === 'month' ? 'active' : ''}`}
                    onClick={() => handleTimeChange('month')}
                >
                    Tháng
                </div>
                <div
                    className={`tab-item ${selectedTime === 'year' ? 'active' : ''}`}
                    onClick={() => handleTimeChange('year')}
                >
                    Năm
                </div>
            </div>
    
            {revenue.data.length > 0 ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
};

export default RevenueStat;