import React, { useState } from "react";
import "../styles/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import orderData from "../../data/Enviroment"; // Import dữ liệu

const ImportOrders = () => {
  const [orders, setOrders] = useState(orderData);

  return (
    <div className="nhap-hang-page">
      <div className="header">
        <button className="btn btn-primary">+ Thêm nhà cung cấp</button>
        <button className="btn btn-primary">+ Thêm mới đơn hàng nhập</button>
      </div>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn nhập</th>
              <th>Ngày nhập hàng</th>
              <th>Số loại sản phẩm</th>
              <th>Giá trị nhập</th>
              <th>Trạng thái</th>
              <th>Nhà cung cấp</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.code}</td>
                <td>{order.date}</td>
                <td>{order.types}</td>
                <td className="value">{order.value}</td>
                <td className={order.completed ? "status completed" : "status pending"}>{order.status}</td>
                <td>{order.supplier}</td>
                <td className="actions">
                  <button className="btn btn-info">
                    <FontAwesomeIcon icon={faInfoCircle} className="icon" /> Chi tiết
                  </button>
                  <button className="btn btn-danger">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImportOrders;
