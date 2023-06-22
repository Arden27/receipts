import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import { setShouldRefresh } from './redux/store';

function ReceiptItemList() {
    const [receiptItems, setReceiptItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceCurrentMonth, setTotalPriceCurrentMonth] = useState(0);
    const [totalPriceLastMonth, setTotalPriceLastMonth] = useState(0);
    const [totalPriceForOneMonth, setTotalPriceForOneMonth] = useState(0);
    const [totalPriceSameDayLastMonth, setTotalPriceSameDayLastMonth] = useState(0);

    const shouldRefresh = useSelector(state => state.shouldRefresh);
    const categories = useSelector(state => state.categories);

    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (shouldRefresh) {
            axios.get(`/api/receiptitems/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then(res => {
                    const receiptItemData = res.data;
                    setReceiptItems(receiptItemData);
                    dispatch(setShouldRefresh(false));
                });
            
            // Fetch total price
            axios.get(`/api/receiptitemstotalprice/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then(res => {
                    setTotalPrice(res.data.total_price);
                });

            // Fetch total price for current month
            axios.get(`/api/receiptitemstotalpricecurrentmonth/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then(res => {
                    setTotalPriceCurrentMonth(res.data.total_price);
                });

            // Fetch total price for last month
            axios.get(`/api/receiptitemstotalpricelastmonth/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then(res => {
                    setTotalPriceLastMonth(res.data.total_price);
                });

            // Fetch total price for one month
            axios.get(`/api/receiptitemstotalpriceforonemonth/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then(res => {
                    setTotalPriceForOneMonth(res.data.total_price);
                });

            // Fetch total price from same day last month till today
            axios.get(`/api/receiptitemstotalpricesamedaylastmonth/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then(res => {
                    setTotalPriceSameDayLastMonth(res.data.total_price);
                });
        }
    }, [shouldRefresh, dispatch]);

    const findCategoryNameById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.name : 'Unknown';
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {receiptItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.price}</td>
                            <td>{item.category ? findCategoryNameById(item.category) : 'Unknown'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>Total Price: {totalPrice}</div>
            <div>Total Price Current Month: {totalPriceCurrentMonth}</div>
            <div>Total Price Last Month: {totalPriceLastMonth}</div>
            <div>Total Price for One Month: {totalPriceForOneMonth}</div>
            <div>Total Price from Same Day Last Month Till Today: {totalPriceSameDayLastMonth}</div>
        </div>
    );
}

export default ReceiptItemList;
