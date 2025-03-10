
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    axios.defaults.withCredentials = true;
    const url = "http://localhost:4001";
    const [cartItems, setCartItems] = useState({})
    const [token, setToken] = useState("")
    const [product_list, setProductList] = useState([]);
    const [product_campaign, setProductCampaign] = useState([]);
    const [updateProduct, setUpdateProduct] = useState([]);
    const [product_slug, setProductSlug] = useState(null);
    const [product_slug_campaign, setProductSlugCampaign] = useState([]);
    const [product_info, setProductInfo] = useState([]);
    const [address, setAddress] = useState([]);
    const [profile, setProfile] = useState([]);
    const [orders, setOrders] = useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + "/v1/api/profile/cart/add", { itemId })
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
                let itemInfo = product_campaign?.updatedProducts.find((product) => product._id === item);
                if (itemInfo) {
                    const priceToUse = itemInfo.newPrice !== null && itemInfo.newPrice !== undefined ? itemInfo.newPrice : itemInfo.price;
                    totalAmount += priceToUse * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

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

    const fetchProductUpdateCampaign = async () => {
        const response = await axios.get(`${url}/v1/api/product/campaign/updateProductPrice`);
        setProductCampaign(response.data.metadata);
        setUpdateProduct(response.data.metadata.updatedProducts);
    };

    const fetchProductUpdateCampaignSlug = async (slug) => {
        const response = await axios.get(`${url}/v1/api/product/campaign/updateProductPrice/${slug}`);
        setProductSlugCampaign(response.data.metadata);
        setProductInfo(response.data.metadata.updatedProduct);
    };

    const fetchUserAddress = async () => {
        const response = await axios.get(`${url}/v1/api/profile/address/getList`);
        setAddress(response.data.metadata.addresses);
    }

    const fetchUserProfile = async () => {
        const response = await axios.get(`${url}/v1/api/profile/getProfile`);
        setProfile(response.data.metadata);
    }

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/user/order/get`);
            if (response.data.status === 200) {
                setOrders(response.data.metadata);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchProductList();
            await fetchProductUpdateCampaign();
            const cookieToken = Cookies.get("jwt");
            if (cookieToken) {
                setToken(cookieToken);
                await loadCartData(cookieToken);
            }
        }
        loadData();
    }, [])


    const contextValue = {
        product_list, product_campaign, updateProduct,
        product_slug, product_slug_campaign, product_info,
        cartItems, address, profile,
        fetchOrders, orders,
        setCartItems,
        addToCart,
        addQuantityToCart,
        removeFromCart,
        getTotalCartAmount, loadCartData,
        fetchProductSlug, fetchProductUpdateCampaignSlug, fetchUserProfile,
        fetchUserAddress,
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