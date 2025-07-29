import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Styles.css';
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {
    const { token, Login, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [data, setData] = useState({
        Email: "",
        Password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {
        event.preventDefault();
        try {
            const newUrl = `${url}/v1/api/staff/login`;
            const response = await axios.post(newUrl, data);
            console.log(response.data);
            navigate('/');
            window.location.reload();
            if (response.data.status) {
                Cookies.set("token", response.data.metadata.token);
                toast.success('Đăng nhập thành công!');
            }

        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='container'>
            <div className='login-popup'>
                <div className='col-12'>
                    <form onSubmit={onLogin} className="login-popup-container">
                        <div className="login-popup-title">
                            <h2>Đăng nhập</h2>
                        </div>
                        <div className="login-popup-inputs">
                            <input name='Email' onChange={onChangeHandler} value={data.Email} type="email" placeholder='Email' required />
                            <input name='Password' onChange={onChangeHandler} value={data.Password} type="password" placeholder='Mật khẩu' required />
                        </div>
                        <button type='submit' className='btn-sub'>Đăng nhập</button>
                        <div className="login-popup-condition">
                            <input type="checkbox" required />
                            <p>Đồng ý với các chính sách của quản trị</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
