import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ListUser from '../Account/ListUser';
import UserTrash from '../Account/UserTrash';
import ListProduct from '../Product/Product';
import AddProduct from '../Product/AddProducts';
import ProductDetail from '../Product/ProductDetail';
import Contact from '../Contact/Contact';
import '../styles/styles.css';
import Headeradmin from '../../components/Headeradmin';
import Orders from '../Order/Cart'; //Order
import OrderTrash from '../Order/OrderTrash';
import DashBoard from '../Admin/DashBoard';
import ProductTrash from '../Product/Trash';
import ContactTrash from '../Contact/ContactTrash';
import ImportProducts from '../InvoiceInput/ImportProducts'; //Invoice
import InvoiceTrash from '../InvoiceInput/InvoiceTrash';
import CreateImportOrder from '../InvoiceInput/CreateInvoice';
import InvoiceDetail from '../InvoiceInput/InvoiceDetail';
import LoginAdmin from '../../pages/Admin/LoginAdmin';
import ProfileAdmin from '../../pages/Admin/ProfileAdmin';
import Staff from '../../pages/Staff/Staff';
import StaffTrash from '../../pages/Staff/StaffTrash';
import AddSupplier from '../../pages/Supplier/AddSupplier';
import Supplier from '../../pages/Supplier/Supplier';
import TrashSupplier from '../../pages/Supplier/TrashSupplier';
import ListCampain from '../../pages/Campaign/ListCampaign';
import AddCampaign from '../../pages/Campaign/AddCampaign';
import CampaignInfo from '../../pages/Campaign/CampaignInfo';
import TrashCampain from '../../pages/Campaign/TrashCampaign';
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

                                {/* Route Product */}
                                <Route path="add" element={<AddProduct />} />
                                <Route path="product" element={<ListProduct />} />
                                <Route path="product/trash" element={<ProductTrash />} />
                                <Route path="product/:id" element={<ProductDetail />} />

                                {/* Route Contact */}
                                <Route path="contact" element={<Contact />} />
                                <Route path="contact/trash" element={<ContactTrash />} />

                                {/* Route User */}
                                <Route path="user" element={<ListUser />} />
                                <Route path="user/trash" element={<UserTrash />} />

                                {/* Route Order */}
                                <Route path="orders" element={<Orders />} />
                                <Route path="orders/trash" element={<OrderTrash />} />

                                {/* Route Invoice */}
                                <Route path="invoice" element={<ImportProducts />} />
                                <Route path="invoice/create" element={<CreateImportOrder />} />
                                <Route path="invoice/trash" element={<InvoiceTrash />} />
                                <Route path="invoice/:id" element={<InvoiceDetail />} />

                                {/* Route Staff */}
                                <Route path="staff" element={<Staff />} />
                                <Route path="staff/trash" element={<StaffTrash />} />

                                <Route path="profile-admin" element={<ProfileAdmin />} />
                                {/* Campain */}
                                <Route path="list-campaign" element={<ListCampain />} />
                                <Route path="add-campaign" element={<AddCampaign />} />
                                <Route path="list-campaign/:id" element={<CampaignInfo />} />
                                <Route path="trash-campaign" element={<TrashCampain />} />

                                {/* Nhập Hàng */}
                                <Route path="add-supplier" element={<AddSupplier />} />
                                <Route path="supplier" element={<Supplier />} />
                                <Route path="trash-supplier" element={<TrashSupplier />} />
                            </Routes>
                        </div>
                    </div>
                } />
            </Routes>
        </div>
    );
};

export default Admin;
