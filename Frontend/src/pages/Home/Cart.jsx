import React, { useContext } from 'react';
import '../styles/styles.css';
// import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import { useNavigate } from 'react-router-dom';
// import { StoreContext } from '../../context/StoreContext';


export const product_list = [
    {
        _id: "1",
        nameProduct: "Laptop Dell XPS 15",
        price: 35000000,
        images: ["laptop1.jpg", "laptop2.jpg", "laptop3.jpg"]
    },
    {
        _id: "2",
        nameProduct: "MacBook Pro M2",
        price: 42000000,
        images: ["macbook1.jpg", "macbook2.jpg", "macbook3.jpg"]
    }
];

export const cartItems = {
    "1": 2, // 2 sản phẩm Laptop Dell XPS 15
    "2": 1  // 1 sản phẩm MacBook Pro M2
};

export const Fee = 50000;

const Cart = () => {

    // const { cartItems, product_list, removeFromCart, getTotalCartAmount, url, url2 } = useContext(StoreContext)

const navigate = useNavigate();

    // Giả lập hàm tính tổng giá trị giỏ hàng
    const getTotalCartAmount = () => {
        return product_list.reduce((total, item) => {
            if (cartItems[item._id]) {
                return total + item.price * cartItems[item._id];
            }
            return total;
        }, 0);
    };

    // Giả lập hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId) => {
        setCartItems((prevCartItems) => {
            const updatedCartItems = { ...prevCartItems };
            delete updatedCartItems[productId];
            return updatedCartItems;
        });
    };

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
                    <br />
                    <hr />
                    {product_list.map((item) => {
                        if (cartItems[item._id] > 0) {
                            return (
                                <div key={item._id} className="cart-item">
                                    {/* <img src={`${url2}/images/${item.images[0]}`} className="cart-item-image" /> */}
                                    <img src={`https://example.com/images/${item.images[0]}`} className="cart-item-image" alt={item.nameProduct} /> 
                                    <p>{item.nameProduct}</p>
                                    <p>{(item.price).toLocaleString()} đ</p>
                                    <p>{cartItems[item._id]}</p>
                                    <p>{(item.price * cartItems[item._id]).toLocaleString()} đ</p>
                                    <p onClick={() => removeFromCart(item._id)} className="cart-item-remove">X</p>
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
            </div>
        </div>
    );
};

export default Cart;