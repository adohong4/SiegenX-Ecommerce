import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const UserProfile = () => {
    const { url, profile, fetchUserProfile } = useContext(StoreContext);
    axios.defaults.withCredentials = true;
    const [data, setData] = useState({
        username: profile.username || "",
        email: profile.email || "",
        password: "",
        fullName: profile.fullName || "",
        dateOfBirth: profile.dateOfBirth || "",
        numberPhone: profile.numberPhone || "",
        gender: profile.gender || "",
    });

    useEffect(() => {
        fetchUserProfile();
    }, [])

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
                toast.success('Thông tin cá nhân đã được cập nhật!');
            } else {
                toast.error(response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau!');
        }
    };

    return (
        <div>
            <form onSubmit={onSubmitHandler}>
                <div className="profile-info">
                    <h2 className="border-bt">Thông tin cá nhân</h2>
                    <div className="form-group top-image-profile">
                        <p>Ảnh đại diện</p>
                        <img
                            src={profile.profilePic}
                            alt="Profile"
                            className="profile-image"
                            style={{
                                borderRadius: '50%',
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover'
                            }}
                        />
                        <input
                            type="file"
                            id="image"
                            className="form-control-file"
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="form-group top-mid-profile">
                        <p>Tên tài khoản</p>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={data.username}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className="form-group top-mid-profile">
                        <p>Họ và tên</p>
                        <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            value={data.fullName}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className="form-group">
                        <p>Email</p>
                        <input
                            type="text"
                            name="email"
                            className="form-control"
                            value={data.email}
                            onChange={onChangeHandler}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <p>Số điện thoại</p>
                        <input
                            type="text"
                            name="numberPhone"
                            className="form-control"
                            value={data.numberPhone}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className="form-group">
                        <p>Giới tính</p>
                        <input
                            type="radio"
                            id="gender1"
                            name="gender"
                            value="Nam"
                            checked={data.gender === "Nam"}
                            onChange={onChangeHandler}
                        />
                        <label htmlFor="gender1">Nam</label><br />
                        <input
                            type="radio"
                            id="gender2"
                            name="gender"
                            value="Nữ"
                            checked={data.gender === "Nữ"}
                            onChange={onChangeHandler}
                        />
                        <label htmlFor="gender2">Nữ</label><br />
                        <input
                            type="radio"
                            id="gender3"
                            name="gender"
                            value="Khác"
                            checked={data.gender === "Khác"}
                            onChange={onChangeHandler}
                        />
                        <label htmlFor="gender3">Khác</label><br /><br />
                    </div>

                    <input
                        type="date"
                        name="dateOfBirth"
                        className="form-control"
                        value={data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : ''} // Chuyển đổi định dạng
                        onChange={onChangeHandler}
                    />

                    <div className="bottom-profile">
                        <button type="submit" className="btn btn-primary add-btn">
                            LƯU
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
