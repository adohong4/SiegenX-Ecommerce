import React, { useEffect, useContext, useState } from 'react';
import { Table, Input, Button, Popconfirm, Modal, Form, Checkbox, Select, notification } from "antd";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import ProductStatis from './Table/productStatis';
import CategoryStatistic from './Chart/categoryStatistic';
import RevenueStat from './Chart/revenueStat';
import CategoryTable from './Table/categoryTable';
import TopProduct from './Table/TopProduct';

const Statistic = () => {
    const [table, setTable] = useState([]);
    const [category, setCategory] = useState([]);
    const { url } = useContext(StoreContext);
    axios.defaults.withCredentials = true;

    const fetchStatisticList = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/statistic/get`);
            if (response.data.message) {
                setTable(response.data.metadata.items);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    const fetchCategoryStatistic = async () => {
        try {
            const response = await axios.get(`${url}/v1/api/profile/statistic/category/get`);
            if (response.data.message) {
                setCategory(response.data.metadata.categories);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    useEffect(() => {
        fetchStatisticList();
        fetchCategoryStatistic();
    }, []);

    return (
        <div className='statistic'>
            <div className='container'>
                <div className='statistic-top'>
                    <CategoryTable category={category} />
                    <CategoryStatistic category={category} />
                </div>
                <div className='statistic-body'>
                    <RevenueStat />
                    <TopProduct table={table} />
                </div>

                <ProductStatis table={table} />
            </div>
        </div>
    )
}

export default Statistic
