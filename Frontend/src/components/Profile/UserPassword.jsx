import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const UserPassword = () => {
    const { url } = useContext(StoreContext);
    axios.defaults.withCredentials = true;
    const [data, setData] = useState({
        password: "",
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const newUrl = `${url}/v1/api/profile/update`;
            const response = await axios.put(newUrl, data);
            if (response.data.status) {
                toast.success('Thiết lập mật khẩu mới thành công!');
            } else {
                toast.error(response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau!');
        }
    };

    return (
        <div className="container">
            <form onSubmit={onSubmitHandler}>
                <div className="profile-info">
                    <h2 className="change-password">Thay đổi mật khẩu</h2>
                    <div className="form-group">
                        <p>Mật khẩu mới</p>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>

                    <div className="form-group">
                        <p>Nhập lại mật khẩu</p>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={data.password} // Không nên hiển thị mật khẩu đã lưu
                            onChange={onChangeHandler}
                            placeholder="Nhập lại mật khẩu"
                        />
                    </div>

                    <div className="bottom-profile">
                        <button type="submit" className="btn btn-primary add-btn">
                            LƯU
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UserPassword
