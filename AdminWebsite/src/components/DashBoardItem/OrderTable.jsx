import React, { useEffect, useContext, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { StoreContext } from '../../context/StoreContext';
import { formatHourDayTime, formatCurrency } from '../../lib/utils';

const OrderTable = () => {
    const { url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalPages, setTotalPages] = useState(0); // Theo dõi tổng số trang

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const fetchListpage = async (page = 1, limit = 6) => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/order/paginate?page=${page}&limit=${limit}`);
            if (response.data.message) {
                setList(response.data.metadata.order);
                setTotalOrder(response.data.metadata.totalOrder);
                setTotalPages(response.data.metadata.totalPages);
            }
        } catch (error) {
            toast.error('Error fetching data');
        }
    };

    useEffect(() => {
        fetchListpage(currentPage);
    }, [currentPage]);

    return (
        <div className='orderpayment-list-container'>
            {/* <div className='orderpayment-list-title'>
                <p>Giao dịch gần đây</p>
            </div> */}

            <ul className="transaction-list">
                {list.map((item) => (
                    <li key={item._id} className="transaction-item">
                        {/* <div className="transaction-icon">
                            <br />
                        </div> */}
                        <div className="transaction-details">
                            <p className="transaction-id">{item._id}</p>
                            <p className="transaction-date">{formatHourDayTime(item.createdAt)}</p>
                        </div>
                        <div className="transaction-amount">
                            <p>+ {item.amount.toLocaleString()} đ</p>
                            <p className="transaction-info">{item.paymentMethod}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                previousLabel="<"
                pageCount={totalPages} // Tổng số trang
                pageRangeDisplayed={1} // Hiển thị tối đa 4 số liên tiếp
                marginPagesDisplayed={1} // Hiển thị 1 số đầu và cuối cùng
                renderOnZeroPageCount={null}
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
            />

        </div>
    )
}

export default OrderTable