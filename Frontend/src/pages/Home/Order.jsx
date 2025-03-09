import React, { useContext, useEffect, useState } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const PlaceOrder = () => {
    const { getTotalCartAmount, fetchUserAddress, address, product_list, cartItems, url, token } = useContext(StoreContext);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [onlinePaymentMethod, setOnlinePaymentMethod] = useState("stripe");
    axios.defaults.withCredentials = true;
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        street: "",
        precinct: "",
        city: "",
        province: "",
    });

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleOnlinePaymentChange = (event) => {
        setOnlinePaymentMethod(event.target.value);
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddressChange = (event) => {
        const selectedAddress = JSON.parse(event.target.value);
        setFormData({
            fullname: selectedAddress.fullname,
            email: selectedAddress.email || '',
            street: selectedAddress.street,
            precinct: selectedAddress.precinct,
            city: selectedAddress.city,
            province: selectedAddress.province,
            phone: selectedAddress.phone
        });
    };
    // Code cũ
    const handleSubmit = async (event) => {
        event.preventDefault();
        let orderItems = [];
        product_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            address: formData,
            items: orderItems,
            amount: getTotalCartAmount() + 50000,
        };
        //lựa chọn online hay tại nhà
        if (paymentMethod === 'online') {
            try {
                let response;
                if (onlinePaymentMethod === 'stripe') {
                    response = await axios.post(`${url}/v1/api/profile/stripe/place`, orderData);
                } else if (onlinePaymentMethod === 'zalopay') {
                    response = await axios.post(`${url}/v1/api/online/zalopay/payment`, orderData);
                }

                if (response && response.data.success) {
                    if (onlinePaymentMethod === 'stripe') {
                        const { session_url } = response.data;
                        window.location.replace(session_url);
                    } else if (onlinePaymentMethod === 'zalopay') {
                        window.location.replace(response.data.order_url); // URL từ ZaloPay
                    }
                } else {
                    toast.error(response ? response.data.message : "Có lỗi xảy ra khi xử lý thanh toán.");
                }
            } catch (error) {
                toast.error(error.response?.data.message || "Có lỗi xảy ra khi kết nối đến cổng thanh toán.");
            }
        } else {
            try {
                let response = await axios.post(url + "/v1/api/profile/cod/verify", orderData);

                if (response.data.status) {
                    console.log("Thanh toán thành công, điều hướng tới /payment-success");
                    toast.success(response.data.message);
                    navigate(`/user/orders`)
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

    };

    useEffect(() => {
        fetchUserAddress();
        if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [fetchUserAddress, getTotalCartAmount, navigate]);

    return (
        <form className="place-order" onSubmit={handleSubmit}>
            <div className="place-order-left">
                <p className="title">Thông Tin Giao Hàng</p>
                <div className="Place-address">
                    <select
                        name="address"
                        onChange={handleAddressChange}
                    >
                        <option value="">Chọn địa chỉ giao hàng của bạn</option>
                        {address.map((address, index) => (
                            <option key={index} value={JSON.stringify(address)}>
                                {address.fullname}, {address.street}, {address.precinct}, {address.city}, {address.province}, {address.phone}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="multi-fields">
                    <input type="text" placeholder="Họ và tên" name="fullname" value={formData.fullname} onChange={onChangeHandler} />
                    <input type="email" placeholder="Email" name="email" value={formData.email} onChange={onChangeHandler} required />
                </div>
                <div className='multi-fields'>
                    <input type="text" placeholder="Đường" name="street" value={formData.street} onChange={onChangeHandler} />
                </div>

                <div className="multi-fields">
                    <input type="text" placeholder="Phường" name="precinct" value={formData.precinct} onChange={onChangeHandler} />
                    <input type="text" placeholder="Thành phố" name="city" value={formData.city} onChange={onChangeHandler} />
                </div>
                <div className="multi-fields">
                    <input type="text" placeholder="Tỉnh" name="province" value={formData.province} onChange={onChangeHandler} />
                    <input type="text" placeholder="Số điện thoại" name="phone" value={formData.phone} onChange={onChangeHandler} />
                </div>
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Tổng Giỏ Hàng</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Tạm Tính</p>
                            <p>{(getTotalCartAmount()).toLocaleString()} đ</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí Giao Hàng</p>
                            <p>{(getTotalCartAmount() === 0 ? 0 : 50000).toLocaleString()} đ</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng Cộng</b>
                            <b>{(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50000).toLocaleString()} đ</b>
                        </div>
                    </div>

                    <div className="hinhthuc-thanhtoan">
                        <p>Hình thức thanh toán:</p>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                checked={paymentMethod === "cash"}
                                onChange={handlePaymentChange}
                            />
                            Thanh toán khi nhận hàng
                        </label>
                        <br />
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="online"
                                checked={paymentMethod === "online"}
                                onChange={handlePaymentChange}
                            />
                            Thanh toán trực tuyến
                        </label>

                        {paymentMethod === "online" && (
                            <div className="payment-options">
                                <p>Chọn phương thức thanh toán trực tuyến:</p>
                                <div className='pay-options'>
                                    <label>
                                        <input
                                            type="radio"
                                            name="onlinePaymentMethod"
                                            value="stripe"
                                            checked={onlinePaymentMethod === "stripe"}
                                            onChange={handleOnlinePaymentChange}
                                        />
                                        <img src={assets.stripe} alt="Stripe" className="payment-logo" />
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="onlinePaymentMethod"
                                            value="zalopay"
                                            checked={onlinePaymentMethod === "zalopay"}
                                            onChange={handleOnlinePaymentChange}
                                        />
                                        <img src={assets.zalopay} alt="ZaloPay" className="payment-logo" />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className='btn-thanhtoan'>
                        <button type="submit" className="place-order-btn">Đặt Hàng</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;