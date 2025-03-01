import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [product_list, setProductList] = useState([]);
    const [account_list, setAccount] = useState([]);
    const [product_id, setProductId] = useState(null);
    const [supplier_list, setSupplierList] = useState([]);
    const [invoice, setInvoice] = useState(null);

    const url = "http://localhost:4001";  // URL backend

    axios.defaults.withCredentials = true;

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

        if (token) {
            try {
                await axios.post(`${url}/v1/api/profile/cart/add`, { itemId });
            } catch (error) {
                console.error("Lỗi khi thêm vào giỏ hàng:", error);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        if (!cartItems[itemId] || cartItems[itemId] <= 0) return;

        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        if (token) {
            try {
                await axios.post(`${url}/v1/api/profile/cart/remove`, { itemId });
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
            }
        }
    };

    const addQuantityToCart = async (itemId, quantity) => {
        if (quantity <= 0) {
            console.error("Số lượng phải lớn hơn 0");
            return;
        }

        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + quantity }));

        if (token) {
            try {
                await axios.post(`${url}/v1/api/profile/cart/addQuantity`, { itemId, quantity });
            } catch (error) {
                console.error("Lỗi khi thêm số lượng vào giỏ hàng:", error);
            }
        }
    };

    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const itemInfo = product_list.find((product) => product._id === itemId);
            return total + (itemInfo ? itemInfo.price * quantity : 0);
        }, 0);
    };

    // API Staff
    const fetchStaff = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/staff/getProfile`);
            setAccount(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi tải danh sách nhân viên:", error);
        }
    };

    const updateStaff = async (data) => {
        try {
            const response = await axios.put(`${url}/v1/api/staff/updateProfile`, data);
            setAccount(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi cập nhật nhân viên:", error);
        }
    };

    const updateStaffById = async (staffId, data) => {
        try {
            await axios.put(`${url}/v1/api/staff/update/${staffId}`, data);
        } catch (error) {
            console.error("Lỗi khi cập nhật nhân viên:", error);
        }
    };

    const deleteRestoreStaff = async (staffId) => {
        try {
            await axios.delete(`${url}/v1/api/staff/toggleStaffStatusActive/${staffId}`);
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái nhân viên:", error);
        }
    };

    const deleteStaff = async (staffId) => {
        try {
            await axios.delete(`${url}/v1/api/staff/delete/${staffId}`);
        } catch (error) {
            console.error("Lỗi khi xóa nhân viên:", error);
        }
    };

    // API Product
    const fetchProductList = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/product/getAll`);
            setProductList(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
        }
    };

    const fetchProductId = async (productId) => {
        try {
            const response = await axios.get(`${url}/v1/api/product/getById/${productId}`);
            setProductId(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        }
    };

    const updateProductId = async (productId, data) => {
        try {
            const response = await axios.put(`${url}/v1/api/product/updateProduct/${productId}`, data);
            setProductId(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
        }
    };

    // API Invoice
    const deleteSoftInvoice = async (invoiceId) => {
        try {
            await axios.delete(`${url}/v1/api/product/invoice/active/${invoiceId}`);
        } catch (error) {
            console.error("Lỗi khi xóa mềm hóa đơn nhập:", error);
        }
    };

    const fetchInvoiceId = async (invoiceId) => {
        try {
            const response = await axios.get(`${url}/v1/api/product/invoice/get/${invoiceId}`);
            setInvoice(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi lấy hóa đơn nhập:", error);
        }
    };

    // API Supplier
    const fetchSupplierList = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/supplier/get`);
            setSupplierList(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi tải danh sách nhà cung cấp:", error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchProductList();
            await fetchStaff();
            await fetchSupplierList();
            const cookieToken = Cookies.get("token");
            if (cookieToken) {
                setToken(cookieToken);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        product_list, product_id, cartItems, account_list, supplier_list, invoice, token,
        updateStaffById, deleteRestoreStaff, deleteStaff, updateStaff,
        fetchInvoiceId, fetchProductId, updateProductId,
        setCartItems, addToCart, addQuantityToCart, removeFromCart, getTotalCartAmount,
        deleteSoftInvoice, setToken, url
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
