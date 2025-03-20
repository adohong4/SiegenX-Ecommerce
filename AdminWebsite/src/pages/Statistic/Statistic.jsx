import React, { useEffect, useContext, useState } from 'react';
import { Table, Input, Button, Popconfirm, Modal, Form, Checkbox, Select, notification } from "antd";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import ProductStatis from './productStatis';

const Statistic = () => {
    const [table, setTable] = useState([]);
    const { url } = useContext(StoreContext);
    axios.defaults.withCredentials = true;

    const fetchStatisticList = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/statistic/get`);
            if (response.data.message) {
                // console.log("item: ", response.data.metadata.items);
                setTable(response.data.metadata.items);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    useEffect(() => {
        fetchStatisticList();
    }, []);

    return (
        <div className='statistic'>
            <ProductStatis table={table} />
        </div>
    )
}

export default Statistic
