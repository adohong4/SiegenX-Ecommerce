import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { orders as initialOrders } from "../../data/Enviroment"; 
import SupplierPopup from "../../components/Popup/SupplierPopup"; 

const ImportOrders = () => {
  const [orders, setOrders] = useState(initialOrders); 
  const [isSupplierPopupOpen, setIsSupplierPopupOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState("");
  const navigate = useNavigate(); // Hook để điều hướng

  const handleAddSupplier = () => {
    if (newSupplier.trim() !== "") {
      alert(`Nhà cung cấp ${newSupplier} đã được thêm!`);
      setNewSupplier("");
      setIsSupplierPopupOpen(false);
    }
  };

  return (
    <div className="nhap-hang-page">
      <div className="header">
        <button className="btn btn-primary" onClick={() => setIsSupplierPopupOpen(true)}>
          + Thêm nhà cung cấp
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/tao-don-nhap-hang")}>
          + Thêm mới đơn hàng nhập
        </button>
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
                <td className={order.completed ? "status completed" : "status pending"}>
                  {order.status}
                </td>
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

      {/* Popup Nhà Cung Cấp */}
      <SupplierPopup
        isOpen={isSupplierPopupOpen}
        onClose={() => setIsSupplierPopupOpen(false)}
        newSupplier={newSupplier}
        setNewSupplier={setNewSupplier}
        handleAddSupplier={handleAddSupplier}
      />
    </div>
  );
};

export default ImportOrders;
