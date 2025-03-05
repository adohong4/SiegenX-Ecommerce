import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Intro from './pages/Home/Intro';
import Contact from './pages/Home/Contact';
import Solution from './pages/Home/Solution';
import Sol_class from './pages/Home/Solution_class';
import Sol_phonghop from './pages/Home/Solution_phonghop';
import Sol_gianhang from './pages/Home/Solution_gianhang';
import Products from './pages/Home/Product';
import ProductDetail from './pages/Home/ProductDetails';
import Cart from './pages/Home/Cart';
import Order from './pages/Home/Order';
import Login from './pages/Home/Login';
import Sidebar from './components/Profile/SideBarUserProfile';
import UserAddress from './components/Profile/UserAddress';
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <>
      <ToastContainer />
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gioi-thieu" element={<Intro />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route path="/giai-phap" element={<Solution />} />
          <Route path="/giai-phap/lop-hoc-thong-minh" element={<Sol_class />} />
          <Route path="/giai-phap/phong-hop-thong-minh" element={<Sol_phonghop />} />
          <Route path="/giai-phap/giai-phap-gian-hang" element={<Sol_gianhang />} />
          <Route path="/san-pham" element={<Products />} />
          <Route path="/san-pham/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/hoa-don" element={<Order />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<Sidebar />} />
          <Route path="/user" element={<Sidebar />}>
            <Route index element={<div>Trang chủ User</div>} />
            {/* <Route path="profile" element={<UserProfile />} />       */}
            <Route path="address" element={<UserAddress />} />
            {/* <Route path="change-password" element={<ChangePassword />} /> 
            <Route path="orders" element={<OrderList />} />           */}
          </Route>

        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App

