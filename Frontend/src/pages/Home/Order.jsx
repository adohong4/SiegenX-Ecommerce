import React, { useContext, useEffect, useState } from 'react';
import '../styles/styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
// import { StoreContext } from '../../context/StoreContext';
import { Order } from '../../data/Enviroment'

const PlaceOrder = () => {
    // const { getTotalCartAmount, token, user_address, product_list, cartItems, url } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("cash");
    // Giả lập dữ liệu 
    const orderData = Order[0];
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        street: "",
        precinct: "",
        city: "",
        province: "",
    });

    const fetchUserAddress = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/getAddress`, {
                headers: { token }
            });
            if (response.data.status) {
                setList(response.data.metadata.addresses);
            }
        } catch (error) {
            toast.error("Lỗi hiển thị");
        }
    };

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
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


    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     let orderItems = [];
    //     product_list.map((item) => {
    //         if (cartItems[item._id] > 0) {
    //             let itemInfo = item;
    //             itemInfo["quantity"] = cartItems[item._id];
    //             orderItems.push(itemInfo);
    //         }
    //     });

    //     let orderData = {
    //         address: formData,
    //         items: orderItems,
    //         amount: getTotalCartAmount() + 50000,
    //     };
    //     //lựa chọn online hay tại nhà
    //     if (paymentMethod === 'online') {
    //         let response = await axios.post(url + "/v1/api/profile/stripe/place", orderData, { headers: { token } });

    //         if (response.data.success) {
    //             const { session_url } = response.data;
    //             window.location.replace(session_url);
    //         } else {
    //             toast.error(response.data.message);
    //         }
    //     } else {
    //         // let response = await axios.post(url + "/v1/api/profile/payment/verify", orderData, { headers: { token } });
    //         // if (response.data.success) {
    //         //     toast.success(response.data.message);
    //         //     navigate("/myorder");
    //         // } else {
    //         //     toast.error(response.data.message);
    //         // }

    //         let response = await axios.post(url + "/v1/api/profile/payment/verify", orderData, { headers: { token } });
    //         if (response.data.success) {
    //             console.log("Thanh toán thành công, điều hướng tới /payment-success");
    //             toast.success(response.data.message);

    //             await sendEmailConfirmation(orderItems, formData.email)
    //             // Chuyển hướng đến trang thông báo thanh toán thành công
    //             navigate('/payment-success', {
    //                 state: {
    //                     message: "Đặt hàng thành công!",
    //                     orderData
    //                 }
    //             });
    //         } else {
    //             toast.error(response.data.message);
    //         }
    //     }

    // };


    // Giả lập cho hàm handle submit

    const handleSubmit = (event) => {
        event.preventDefault();
        toast.success("Đặt hàng thành công!");
        navigate('/payment-success', {
            state: {
                message: "Đặt hàng thành công!",
                orderData
            }
        });
    };

    // Kết thúc giả lập cho handleSubmit

    const sendEmailConfirmation = async (orderDetails, email) => {
        try {
            const response = await axios.post(url + '/v1/api/profile/send-email', {
                email: email,
                orderDetails: orderDetails, // Array chứa chi tiết đơn hàng
            });

            console.log(response.data.message); // Thông báo thành công
        } catch (error) {
            console.error('Lỗi khi gửi email:', error.response?.data || error.message);
        }
    };

    // useEffect(() => {
    //     fetchUserAddress(token);
    //     if (!token) {
    //         navigate('/cart');
    //     } else if (getTotalCartAmount() === 0) {
    //         navigate('/cart');
    //     }
    // }, [token]);

    useEffect(() => {
        if (Order.length > 0) {
            const orderData = Order[0]; // Lấy đơn hàng đầu tiên từ danh sách
            setList([orderData.address]); // Lưu địa chỉ vào danh sách
            setFormData(orderData.address); // Cập nhật form với địa chỉ có sẵn
        } else {
            toast.error("Không có dữ liệu đơn hàng!");
        }
    }, []);

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
                        {list.map((address, index) => (
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
                    {/* <div>
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
                    </div> */}

                    {/* Giả lập dữ liệu cho hàm getTotalAmount */}

                    <div>
                        <div className="cart-total-details">
                            <p>Tạm Tính</p>
                            <p>{Order[0].totalAmount.toLocaleString()} đ</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí Giao Hàng</p>
                            <p>{Order[0].shippingFee.toLocaleString()} đ</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng Cộng</b>
                            <b>{Order[0].finalAmount.toLocaleString()} đ</b>
                        </div>
                    </div>
{/* Kết thúc hàm giả lập */}
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
                                    {/* <img src={assets.momo} alt="MoMo" className="payment-logo" />
                                    <img src={assets.zalopay} alt="ZaloPay" className="payment-logo" /> */}
                                    <img src={assets.stripe} alt="Stripe" className="payment-logo" />
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