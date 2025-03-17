import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { ToastContainer } from 'react-toastify';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home/Home'));
const Intro = lazy(() => import('./pages/Home/Intro'));
const Contact = lazy(() => import('./pages/Home/Contact'));
const Solution = lazy(() => import('./pages/Home/Solution'));
const Sol_class = lazy(() => import('./pages/Home/Solution_class'));
const Sol_phonghop = lazy(() => import('./pages/Home/Solution_phonghop'));
const Sol_gianhang = lazy(() => import('./pages/Home/Solution_gianhang'));
const Products = lazy(() => import('./pages/Home/Product'));
const ProductDetail = lazy(() => import('./pages/Home/ProductDetails'));
const Cart = lazy(() => import('./pages/Home/Cart'));
const Order = lazy(() => import('./pages/Home/Order'));
const Verify = lazy(() => import('./pages/Home/Verify'));
const Login = lazy(() => import('./pages/Home/Login'));
const Sidebar = lazy(() => import('./components/Profile/SideBarUserProfile'));
const UserAddress = lazy(() => import('./components/Profile/UserAddress'));
const UserProfile = lazy(() => import('./components/Profile/UserProfile'));
const ChangePassword = lazy(() => import('./components/Profile/UserPassword'));
const OrderList = lazy(() => import('./components/Profile/UserPurchase'));
const UserOrderDetail = lazy(() => import('./components/Profile/UserOrderDetail'));
const ProductRecommend = lazy(() => import('./pages/Home/ProductRecommend'));


const App = () => {
  return (
    <>
      <ToastContainer />
      <div className="app">
        <Navbar />
        <Suspense fallback={<div>Đang tải...</div>}>
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
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user" element={<Sidebar />}>
              <Route index element={<div>Trang chủ User</div>} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="address" element={<UserAddress />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<UserOrderDetail />} />
            </Route>
          </Routes>
          <ProductRecommend />
        </Suspense>
        <Footer />
      </div>
    </>
  );
};

export default App;
