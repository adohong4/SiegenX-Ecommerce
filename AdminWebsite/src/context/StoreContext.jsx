
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
    const [account_list, setAccount] = useState([])
    const [product_id, setProductId] = useState(null);
    // Cấu hình axios mặc định
    axios.defaults.withCredentials = true;

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
    //---------api Staff
    const fetchStaff = async () => {
        const response = await axios.get(`${url}/v1/api/staff/getProfile`);
        setAccount(response.data.metadata);
    };

    const updateStaff = async (data) => {
        const response = await axios.put(`${url}/v1/api/staff/updateProfile`, data);
        setAccount(response.data.metadata);
    };

    const updateStaffById = async (staffId, data) => {
        await axios.post(`${url}/v1/api/staff/update/${staffId}`, data);
    };

    const deleteRestoreStaff = async (staffId) => {
        await axios.delete(`${url}/v1/api/staff/toggleStaffStatusActive/${staffId}`);
    };

    const deleteStaff = async (staffId) => {
        await axios.delete(`${url}/v1/api/staff/delete/${staffId}`);
    };

    //---------api Product
    const fetchProductList = async () => {
        const response = await axios.get(`${url}/v1/api/product/getAll`);
        setProductList(response.data.metadata);
    };

    const fetchProductId = async (productId) => {
        const response = await axios.get(`${url}/v1/api/product/getById/${productId}`);
        setProductId(response.data.metadata);
    };

    const updateProductId = async (productId, data) => {
        console.log("data: ", data)
        console.log("productId: ", productId)
        const response = await axios.post(`${url}/v1/api/product/updateProduct/${productId}`, data);
        console.log("response: ", response)
        setProductId(response.data.metadata);
    };


    useEffect(() => {
        async function loadData() {
            await fetchProductList();
            await fetchStaff();
            const cookieToken = Cookies.get("token");
            if (cookieToken) {
                setToken(cookieToken);
            }
        }
        loadData();
    }, [])


    const contextValue = {
        product_list,
        product_id,
        cartItems,
        account_list,
        updateStaffById, deleteRestoreStaff, deleteStaff, updateStaff,
        setCartItems,
        addToCart,
        addQuantityToCart,
        removeFromCart,
        getTotalCartAmount,
        fetchProductId,
        updateProductId,
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