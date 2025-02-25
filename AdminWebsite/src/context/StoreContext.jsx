
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState({})

    const url = "http://localhost:4001";

    const [token, setToken] = useState("")
    const [product_list, setProductList] = useState([])
    const [product_slug, setProductSlug] = useState(null);
    // Cấu hình axios mặc định
    axios.defaults.withCredentials = true;

    const Login = async (data) => {
        try {
            const response = await axios.post(`${url}/v1/api/staff/login`, data);
            console.log("data: ", response.data)
            if (response.data.status) {
                Cookies.set("token", response.data.metadata.token);
                setToken(response.data.metadata.token);
                toast.success('Đăng nhập thành công!');
                navigate('/');
            }
        } catch (error) {
            throw error;
            toast.error('Đăng nhập thất bại!');
        }
    }

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + "http://localhost:9002/v1/api/profile/cart/add", { itemId })
        }

    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/v1/api/profile/cart/remove", { itemId })
        }
    }

    const addQuantityToCart = async (itemId, quantity) => {
        if (quantity <= 0) {
            console.error("Số lượng phải lớn hơn 0");
        }
        console.log("itemId: ", itemId)
        console.log("quantity: ", quantity)
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: quantity }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + quantity }))
        }
        if (token) {
            await axios.post(url + "/v1/api/profile/cart/addQuantity", { itemId, quantity })
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = product_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchProductList = async () => {
        const response = await axios.get(`${url}/v1/api/product/getAll`);
        setProductList(response.data.metadata);
    };

    const fetchProductSlug = async (slug) => {
        const response = await axios.get(`${url}/v1/api/product/getBySlug/${slug}`);
        setProductSlug(response.data.metadata);
    };

    const loadCartData = async () => {
        const response = await axios.get(`${url}/v1/api/profile/cart/get`);
        setCartItems(response.data.metadata);
    };

    useEffect(() => {
        async function loadData() {
            await fetchProductList();
            const cookieToken = Cookies.get("token");
            if (cookieToken) {
                setToken(cookieToken);
                await loadCartData(cookieToken);
            }
        }
        loadData();
    }, [])


    const contextValue = {
        Login,
        product_list,
        product_slug,
        cartItems,
        setCartItems,
        addToCart,
        addQuantityToCart,
        removeFromCart,
        getTotalCartAmount,
        fetchProductSlug,
        url,
        setToken,
        token
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;