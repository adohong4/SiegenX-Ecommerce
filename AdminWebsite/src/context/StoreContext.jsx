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
    const [invoiceStatistic, setInvoiceStatistic] = useState(null);
    const [order, setOrder] = useState([]);
    const [contacts, setContact] = useState([]);
    const [users, setUsers] = useState([]);

    const url = "http://localhost:4001";  // URL backend

    axios.defaults.withCredentials = true;

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
            await axios.post(`${url}/v1/api/staff/update/${staffId}`, data);
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
            const response = await axios.post(`${url}/v1/api/product/updateProduct/${productId}`, data);
            setProductId(response.data.metadata);
        } catch (error) {
            console.error("Lỗi", error);
        }
    };

    // API Invoice
    const fectchInvoice = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/product/invoice/get`);
            setInvoice(response.data.metadata);
        } catch (error) {
            console.error("Lỗi", error);
        }
    }

    const fectchInvoiceStatistic = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/product/invoice/statistic`);
            setInvoiceStatistic(response.data.metadata.products);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    }

    const deleteSoftInvoice = async (invoiceId) => {
        try {
            const response = await axios.delete(`${url}/v1/api/product/invoice/active/${invoiceId}`);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const deleteInvoice = async (invoiceId) => {
        try {
            const response = await axios.delete(`${url}/v1/api/product/invoice/delete/${invoiceId}`);
            if (response.data.status) {
                alert('Xóa thành công');
            }
        } catch (error) {
            alert(error.response.data.message);
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

    //----------API Campaign
    const activeCampaign = async (id) => {
        await axios.delete(`${url}/v1/api/product/campaign/active/${id}`);
    };

    const deleteCampaign = async (id) => {
        try {
            const response = await axios.delete(`${url}/v1/api/product/campaign/delete/${id}`);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    //----------API Order
    const fetchOrderList = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/order/get`);
            setOrder(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
        }
    };

    //----------API Contact
    const fetchContactList = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/contact/list`);
            setContact(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
        }
    };

    //----------API Contact
    const fetchUserList = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/account/get`);
            setUsers(response.data.metadata);
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchProductList();
            await fetchStaff();
            await fetchSupplierList();
            await fectchInvoice();
            await fetchOrderList();
            await fetchContactList();
            await fetchUserList();
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
        fetchInvoiceId, deleteSoftInvoice, deleteInvoice, fetchSupplierList,
        activeCampaign, deleteCampaign,
        fetchProductId, updateProductId, setToken, url,
        order, contacts, users, fectchInvoiceStatistic, invoiceStatistic,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
