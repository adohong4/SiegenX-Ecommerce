import React, { lazy, Suspense, useEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';
const Sidebar = lazy(() => import('../../components/Sidebar'));
const ListUser = lazy(() => import('../Account/ListUser'));
const UserTrash = lazy(() => import('../Account/UserTrash'));
const ListProduct = lazy(() => import('../Product/Product'));
const AddProduct = lazy(() => import('../Product/AddProducts'));
const ProductDetail = lazy(() => import('../Product/ProductDetail'));
const Contact = lazy(() => import('../Contact/Contact'));
const Headeradmin = lazy(() => import('../../components/Headeradmin'));
const Orders = lazy(() => import('../Order/Cart'));
const OrderTrash = lazy(() => import('../Order/OrderTrash'));
const DashBoard = lazy(() => import('../Admin/DashBoard'));
const ProductTrash = lazy(() => import('../Product/Trash'));
const ContactTrash = lazy(() => import('../Contact/ContactTrash'));
const ImportProducts = lazy(() => import('../InvoiceInput/ImportProducts'));
const InvoiceTrash = lazy(() => import('../InvoiceInput/InvoiceTrash'));
const CreateImportOrder = lazy(() => import('../InvoiceInput/CreateInvoice'));
const InvoiceDetail = lazy(() => import('../InvoiceInput/InvoiceDetail'));
const LoginAdmin = lazy(() => import('../../pages/Admin/LoginAdmin'));
const ProfileAdmin = lazy(() => import('../../pages/Admin/ProfileAdmin'));
const Staff = lazy(() => import('../../pages/Staff/Staff'));
const StaffTrash = lazy(() => import('../../pages/Staff/StaffTrash'));
const AddSupplier = lazy(() => import('../../pages/Supplier/AddSupplier'));
const Supplier = lazy(() => import('../../pages/Supplier/Supplier'));
const TrashSupplier = lazy(() => import('../../pages/Supplier/TrashSupplier'));
const SupplierInfo = lazy(() => import('../../pages/Supplier/SupplierInfo'));
const ListCampain = lazy(() => import('../../pages/Campaign/ListCampaign'));
const AddCampaign = lazy(() => import('../../pages/Campaign/AddCampaign'));
const CampaignInfo = lazy(() => import('../../pages/Campaign/CampaignInfo'));
const TrashCampain = lazy(() => import('../../pages/Campaign/TrashCampaign'));
const Statistic = lazy(() => import('../../pages/Statistic/Statistic'));
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
const Admin = () => {
    const token = Cookies.get("token");
    const navigate = useNavigate();


    return (
        <>
            <ToastContainer />
            <div className="admin-container">
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/admin-login" element={<LoginAdmin />} />

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

                                        {/* Campaign */}
                                        <Route path="list-campaign" element={<ListCampain />} />
                                        <Route path="add-campaign" element={<AddCampaign />} />
                                        <Route path="list-campaign/:id" element={<CampaignInfo />} />
                                        <Route path="trash-campaign" element={<TrashCampain />} />

                                        {/* Supplier */}
                                        <Route path="add-supplier" element={<AddSupplier />} />
                                        <Route path="supplier" element={<Supplier />} />
                                        <Route path="trash-supplier" element={<TrashSupplier />} />
                                        <Route path="supplier/:id" element={<SupplierInfo />} />

                                        {/* Statistic */}
                                        <Route path="statistic" element={<Statistic />} />
                                    </Routes>
                                </div>
                            </div>
                        } />
                    </Routes>
                </Suspense>
            </div>
        </>
    );
};

export default Admin;
