import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const UserProfile = () => {
    const { url, profile, fetchUserProfile } = useContext(StoreContext);
    const [uploading, setUploading] = useState(false);
    axios.defaults.withCredentials = true;
    const [data, setData] = useState([]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profile', file);
            setUploading(true);
            try {
                const response = await axios.post(`${url}/v1/api/profile/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success(response.data.message);
                fetchUserProfile();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Upload ảnh thất bại');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleClick = () => {
        document.getElementById('imageInput').click();
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            setData({
                username: profile.username || "",
                email: profile.email || "",
                password: "",
                fullName: profile.fullName || "",
                dateOfBirth: profile.dateOfBirth || "",
                numberPhone: profile.numberPhone || "",
                gender: profile.gender || "",
            });
        }
    }, [profile]);

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
                <div className='container'>
                    <div className="profile-info">
                        <h2 className="border-bt">Thông tin cá nhân</h2>
                        <div className='Profile-user'>
                            <div className='col-6 info-profile'>
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
                                <div className='form-group'>
                                    <p> Ngày sinh</p>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        className="form-control"
                                        value={data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : ''} // Chuyển đổi định dạng
                                        onChange={onChangeHandler}
                                    />
                                </div>
                                <div className="form-group gender-group">
                                    <p className='col-4'>Giới tính</p>
                                    <div className='gen col-2'>
                                        <input
                                            type="radio"
                                            id="gender1"
                                            name="gender"
                                            value="Nam"
                                            checked={data.gender === "Nam"}
                                            onChange={onChangeHandler}
                                        />
                                        <label htmlFor="gender1">Nam</label><br />
                                    </div>
                                    <div className='gen col-2'>
                                        <input
                                            type="radio"
                                            id="gender2"
                                            name="gender"
                                            value="Nữ"
                                            checked={data.gender === "Nữ"}
                                            onChange={onChangeHandler}
                                        />
                                        <label htmlFor="gender2">Nữ</label><br />
                                    </div>
                                    <div className='gen col-2'>
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
                                </div>
                            </div>
                            <div className='col-6 img-profile'>
                                <div className="form-group top-image-profile">
                                    <p>Ảnh đại diện</p>
                                    <img
                                        src={profile.profilePic || assets.userIcon}
                                        alt="Profile"
                                        className="profile-image"
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            borderRadius: '15px'
                                        }}
                                        onClick={handleClick}
                                    />
                                    <input
                                        type="file"
                                        id="imageInput"
                                        className="form-control-file"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {uploading && <p>Ảnh đại diện đang được cập nhật...</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bottom-profile">
                            <button type="submit" className="btn btn-primary add-btn">
                                LƯU
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
