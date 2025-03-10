import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddressPopup = ({ setShowAddress, onSuccess }) => {
    axios.defaults.withCredentials = true;
    const { url } = useContext(StoreContext);
    const [data, setData] = useState({
        fullname: '',
        phone: '',
        street: '',
        precinct: '',
        city: '',
        province: '',
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const newUrl = `${url}/v1/api/profile/address/create`;
            const response = await axios.post(newUrl, data);

            if (response.data.status) {
                toast.success('Địa chỉ đã được lưu thành công!');
                setShowAddress(false); // Đóng popup
                onSuccess(); // Cập nhật lại danh sách địa chỉ
            } else {
                toast.error(response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error('Không thể lưu địa chỉ. Vui lòng thử lại sau!');
        }
    };


    return (
        <div className="address-popup">
            <form onSubmit={onSubmitHandler} className="address-popup-container">
                <div className="popup-header">
                    <h2>Thêm Địa Chỉ</h2>
                    <button type="button" className="close-btn" onClick={() => setShowAddress(false)}>×</button>
                </div>

                <div className="popup-body">
                    <div className="form-group">
                        <label htmlFor="fullname">Họ và tên</label>
                        <input
                            required
                            name="fullname"
                            id="fullname"
                            type="text"
                            placeholder="Nhập họ và tên"
                            value={data.fullname}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                            required
                            name="phone"
                            id="phone"
                            type="text"
                            placeholder="Nhập số điện thoại"
                            value={data.phone}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="street">Đường/Thôn</label>
                        <input
                            required
                            name="street"
                            id="street"
                            type="text"
                            placeholder="Nhập tên đường hoặc thôn"
                            value={data.street}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className="form-group multi-fields col-12">
                        <div className='form-mul'>
                            <label htmlFor="precinct">Xã/Phường</label>
                            <input
                                required
                                name="precinct"
                                id="precinct"
                                type="text"
                                placeholder="Nhập xã hoặc phường"
                                value={data.precinct}
                                onChange={onChangeHandler}
                            />
                        </div>
                        <div className='form-mul'>
                            <label htmlFor="city">Thành phố/ Quận/ Huyện</label>
                            <input
                                required
                                name="city"
                                id="city"
                                type="text"
                                placeholder="Nhập thành phố/ quận/ huyện"
                                value={data.city}
                                onChange={onChangeHandler}
                            />
                        </div>
                    </div>

                    <div className="form-group multi-fields col-12" >
                        <div className='form-mul-1'>
                            <label htmlFor="province">Tỉnh</label>
                            <input
                                required
                                name="province"
                                id="province"
                                type="text"
                                placeholder="Nhập tỉnh"
                                value={data.province}
                                onChange={onChangeHandler}
                            />
                        </div>
                    </div>
                </div>

                <div className="popup-footer">
                    <button type="submit" className="btn">Lưu Địa Chỉ</button>
                </div>
            </form>
        </div>
    );
};

export default AddressPopup;
