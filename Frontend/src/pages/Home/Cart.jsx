import React, { useContext, useState } from 'react';
import '../styles/styles.css';
// import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

export const Fee = 50000;

const Cart = () => {

    const { cartItems, product_list, removeFromCart, getTotalCartAmount, url, url2, product_campaign } = useContext(StoreContext)
    const navigate = useNavigate();

    console.log(product_campaign);

    return (
        <div className="cart">
            {/* <ScrollToTop /> */}
            <div className='container'>
                <h1 className="cart-header">Giỏ Hàng Của Bạn</h1>
                <div className="cart-content">
                    <div className="cart-items">
                        <div className="cart-items-title">
                            <p>Sản Phẩm</p>
                            <p>Tên</p>
                            <p>Giá</p>
                            <p>Số Lượng</p>
                            <p>Tổng</p>
                            <p></p>
                        </div>
                        <hr />
                        {product_campaign?.updatedProducts?.map((item) => {
                            if (cartItems[item._id] > 0) {
                                const priceToUse = item.newPrice !== null && item.newPrice !== undefined ? item.newPrice : item.price;
                                const totalPrice = priceToUse * cartItems[item._id];
                                return (
                                    <div key={item._id} className="cart-item">
                                        <img src={`http://localhost:9003/images/${item.images[0]}`} className="cart-item-image" alt={item.nameProduct} />
                                        <p>{item.nameProduct}</p>
                                        <p>{priceToUse.toLocaleString()} đ</p>
                                        <p>{cartItems[item._id]}</p>
                                        <p>{totalPrice.toLocaleString()} đ</p>
                                        <p onClick={() => removeFromCart(item._id)} className="cart-item-remove"><i className="fa-solid fa-trash"></i></p>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <div className="cart-summary">
                        <h2>CHI TIẾT ĐƠN HÀNG</h2>
                        <div>
                            <div className="cart-summary-details">
                                <p>Tạm Tính:</p>
                                <p>{(getTotalCartAmount()).toLocaleString()} đ</p>
                            </div>
                            <div className="cart-summary-details">
                                <p>Phí Giao Hàng:</p>
                                <p>{(getTotalCartAmount() === 0 ? 0 : Fee).toLocaleString()} đ</p>
                            </div>
                            <div className="cart-summary-total">
                                <b>Tổng Cộng:</b>
                                <b>{(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + Fee).toLocaleString()} đ</b>
                            </div>
                        </div>
                        <button onClick={() => navigate('/hoa-don')} className="cart-checkout-button">Tiến Hành Thanh Toán</button>
                    </div>
                </div>
                <div className='bottom-cart-content'>
                    <h2>(*) Note:</h2>
                    <div className='text-note'>
                        <p> - Do chính sách vận chuyển, đơn hàng của quý khách sẽ được cộng thêm 50.000 VND phí vận chuyển.</p>
                        <p> - Mọi thắc mắc vui lòng liên hệ với chúng tôi.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;