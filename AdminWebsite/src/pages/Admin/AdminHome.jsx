import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ListUser from '../Admin/ListUser';
import ListProduct from '../Admin/Product';
import Contact from '../Admin/Contact';
import AddProduct from '../Admin/AddProducts';
import '../styles/styles.css';
import Headeradmin from '../../components/Headeradmin';
import Orders from '../Admin/Cart';
import DashBoard from '../Admin/DashBoard';
import Trash from '../Admin/Trash';
import ImportProducts from '../Admin/ImportProducts';
import ImportProductsDetails from '../../pages/Admin/ImportProductsDetails';
import LoginAdmin from '../../pages/Admin/LoginAdmin';
import ProfileAdmin from '../../pages/Admin/ProfileAdmin';
import Cookies from 'js-cookie';
const Admin = () => {
    const token = Cookies.get("token");
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!token) {
    //         navigate("/admin-login");
    //     }
    // }, [token, navigate]);
    return (
        <div className="admin-container">
            <Routes>
                {/* Login page chỉ hiển thị khi vào "/admin-login" */}
                <Route path="/admin-login" element={<LoginAdmin />} />

                {/* Admin Layout */}
                <Route path="/*" element={
                    <div className="admin-layout">
                        <div className='sidebar-left'>
                            <Sidebar />
                        </div>
                        <div className='header-topadmin'>
                            <Headeradmin />
                        </div>
                        <div className="admin-content sidebar-right">
                            <Routes>
                                <Route path="dashboard" element={<DashBoard />} />
                                <Route path="add" element={<AddProduct />} />
                                <Route path="product" element={<ListProduct />} />
                                <Route path="contact" element={<Contact />} />
                                <Route path="user" element={<ListUser />} />
                                <Route path="orders" element={<Orders />} />
                                <Route path="trash" element={<Trash />} />
                                <Route path="nhap-hang" element={<ImportProducts />} />
                                <Route path="tao-don-nhap-hang" element={<ImportProductsDetails />} />
                                <Route path="profile-admin" element={<ProfileAdmin />} />
                            </Routes>
                        </div>
                    </div>
                } />
            </Routes>
        </div>
    );
};

export default Admin;
