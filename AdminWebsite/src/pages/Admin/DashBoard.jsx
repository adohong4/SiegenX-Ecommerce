
import React from 'react'
import '../styles/styles.css';
import Factors from '../../components/DashBoardItem/Factors';
import ColumnChart from '../../components/DashBoardItem/ColumnChart';
import OrderTable from '../../components/DashBoardItem/OrderTable';
import LineChart from '../../components/DashBoardItem/LineChart';

const DashBoard = () => {
    return (
        <div className='Dashboard'>
            <div className='section-doanhthu'>
                <div className='doanhthu-left'>
                    <Factors />
                </div>
                <div className='doanhthu-right'>
                    
                    <ColumnChart />
                </div>
            </div>
            <div className='section-thongke'>
                <div className='thongke-left'>
                    <LineChart />
                </div>
                <div className='thongke-right'>
                    <OrderTable />
                </div>
            </div>
            
            
        </div>
    )
}

export default DashBoard
