import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ListUser from '../Admin/ListUser';
import ListProduct from '../Admin/Product';
import Contact from '../Admin/Contact';
import AddProduct from '../Admin/AddProducts';
import '../styles/styles.css'
import Headeradmin from'../../components/Headeradmin';
import Orders from '../Admin/Cart';
import DashBoard from '../Admin/DashBoard';
import Trash from '../Admin/Trash';
import ImportProducts from '../Admin/ImportProducts'
const Admin = () => {
    return (
        <div className="admin-container">
            <div className='sidebar-left'>
                <Sidebar />
            </div>
            <div className='header-topadmin'>
                <Headeradmin />
            </div>
            <div className="admin-content sidebar-right">
                
                <Routes>
                    <Route path="add" element={<AddProduct />} />
                    <Route path="product" element={<ListProduct />} />
                    <Route path="contact" element={<Contact />}/>
                    <Route path="user" element={<ListUser />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route path="/trash" element={<Trash />} />
                    <Route path="/nhap-hang" element={<ImportProducts />} />
                </Routes>
            </div>
        </div>
    )
}

export default Admin;