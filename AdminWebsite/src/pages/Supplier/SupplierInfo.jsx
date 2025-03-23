import React, { useEffect, useContext, useState } from 'react';
import { Table, Descriptions } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { formatHourDayTime, formatCurrency } from '../../lib/utils'
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const SupplierInfomation = () => {
    axios.defaults.withCredentials = true;
    const { url, invoice, } = useContext(StoreContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [supplier, setSupplier] = useState([]);
    const [selectedInvoice, setSelectedInvoices] = useState([]);

    useEffect(() => {
        const fetchSupplierById = async () => {
            try {
                const response = await axios.get(`${url}/v1/api/supplier/get/${id}`);
                const supplierData = response.data.metadata;
                setSupplier(supplierData);

                // Lọc danh sách invoice có _id nằm trong orderData
                const matchedInvoices = invoice.filter(inv => supplierData.orderData.includes(inv._id));
                setSelectedInvoices(matchedInvoices);
            } catch (error) {
                console.error("Lỗi khi lấy nhà cung cấp:", error);
            }
        }
        fetchSupplierById();
    }, [id, url])

    const columnInvoice = [
        {
            title: 'Mã đơn nhập', dataIndex: 'invoiceId', key: 'invoiceId',
            sorter: (a, b) => new Date(a.invoiceId) - new Date(b.invoiceId),
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (status, record) => (
                record.status === 'active' ? 'Hoạt động'
                    : record.status === 'paused' ? 'Tạm dừng'
                        : record.status === 'completed' ? 'Thành công'
                            : record.status === 'pending' ? 'Chờ xử lý'
                                : record.status === 'cancelled' ? 'Bị hủy'
                                    : record.status === 'failed' ? 'Thất bại' : 'Nháp'
            ),
        },
        {
            title: 'Nhập kho', dataIndex: 'statusInput', key: 'statusInput',
            render: (statusInput, record) => (
                record.statusInput === 'not imported' ? 'Chưa nhập'
                    : record.statusInput === 'imported' ? 'Nhập kho' : ''
            ),
        },
        {
            title: 'Thanh toán', dataIndex: 'statusPayment', key: 'statusPayment',
            render: (statusPayment, record) => (
                record.statusPayment === 'pending' ? 'Chờ xử lý'
                    : record.statusPayment === 'partial payment' ? 'Thanh toán một phần'
                        : record.statusPayment === 'completed' ? 'Đã thanh toán' : ''
            ),
        },
        {
            title: 'Giá trị', dataIndex: 'valueInvoice', key: 'valueInvoice',
            render: (valueInvoice, record) => formatCurrency(record.valueInvoice),
            sorter: (a, b) => new Date(a.valueInvoice) - new Date(b.valueInvoice),
        },
        {
            title: 'Ngày tạo đơn', dataIndex: 'createdAt', key: 'createdAt',
            render: (createdAt, record) => formatHourDayTime(record.createdAt),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Cập nhật cuối', dataIndex: 'updatedAt', key: 'updatedAt',
            render: (updatedAt, record) => formatHourDayTime(record.updatedAt),
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        },
    ]

    const columnsCreator = [
        { title: 'Người tạo', dataIndex: 'createdName', key: 'createdName', },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
    ];

    return (
        <div className="supplier-info-container">
            {(error || success) && (
                <div className="popup-overlay fade-in">
                    <div className={`popup-container ${success ? "success" : "error"}`}>
                        <p>{error || success}</p>
                        <button onClick={() => { setError(""); setSuccess(""); }}>Đóng</button>
                    </div>
                </div>
            )}
            <div className='top-tittle'>
                <button onClick={() => navigate("/supplier")}>← Danh sách nhà cung cấp</button>
                <p>{supplier.supplierName}</p>
            </div>
            <div className='supplier-info-table'>
                <p className="title">Thông tin cá nhân</p>
                <Descriptions column={3} bordered className='info-table'>
                    <Descriptions.Item label={<span className="descriptions-label">Nhóm nhà cung cấp</span>}>: Khác</Descriptions.Item>
                    <Descriptions.Item label="Mã số thuế">: {supplier.taxCode}</Descriptions.Item>
                    <Descriptions.Item label="Người phụ trách">: {supplier.creator?.[0]?.createdName || '---'}</Descriptions.Item>
                    <Descriptions.Item label="Mã">: {supplier._id}</Descriptions.Item>
                    <Descriptions.Item label="Website">: ---</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">: {supplier.status === true ? 'Đang giao dịch' : 'Ngừng giao dịch'}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">: {supplier.numberPhone}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">: {supplier.description}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">: {supplier.lane}, {supplier.area}, {supplier.area}</Descriptions.Item>
                    <Descriptions.Item label="Nợ hiện tại">: ---</Descriptions.Item>
                    <Descriptions.Item label="Email">: {supplier.email}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ khác">: {supplier.addressOthers}</Descriptions.Item>
                </Descriptions>
            </div>


            <Table
                columns={columnInvoice}
                dataSource={selectedInvoice?.map((item, index) => ({
                    ...item,
                }))}
                pagination={{ pageSize: 3 }}
                rowKey={(record) => record.key}
            />

            <Table
                columns={columnsCreator}
                dataSource={supplier.creator?.map((item, index) => ({
                    ...item,
                    key: `${item.createdBy || 'unknown'}-${index}`,
                }))}
                pagination={{ pageSize: 4 }}
                rowKey={(record) => record.key}
            />
        </div>
    );
};

export default SupplierInfomation;
