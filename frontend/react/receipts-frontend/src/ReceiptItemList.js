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
    
        const fetchData = async () => {
            if (shouldRefresh) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/receiptitems/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    setReceiptItems(response.data);
                    dispatch(setShouldRefresh(false));
                    
                    // Fetch total price
                    const totalPriceRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/receiptitemstotalprice/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    setTotalPrice(totalPriceRes.data.total_price);
    
                    // Fetch total price for current month
                    const totalPriceCurrentMonthRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/receiptitemstotalpricecurrentmonth/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    setTotalPriceCurrentMonth(totalPriceCurrentMonthRes.data.total_price);
    
                    // Fetch total price for last month
                    const totalPriceLastMonthRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/receiptitemstotalpricelastmonth/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    setTotalPriceLastMonth(totalPriceLastMonthRes.data.total_price);
    
                    // Fetch total price for one month
                    const totalPriceForOneMonthRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/receiptitemstotalpriceforonemonth/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    setTotalPriceForOneMonth(totalPriceForOneMonthRes.data.total_price);
    
                    // Fetch total price from same day last month till today
                    const totalPriceSameDayLastMonthRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/receiptitemstotalpricesamedaylastmonth/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    setTotalPriceSameDayLastMonth(totalPriceSameDayLastMonthRes.data.total_price);
    
                } catch (error) {
                    console.error(error);
                }
            }
        };
    
        fetchData();
    }, [shouldRefresh, dispatch]);

    const findCategoryNameById = (id) => {
        if (categories && Array.isArray(categories)) {
            const category = categories.find(category => category.id === id);
            return category ? category.name : 'Unknown';
        } else {
            return 'Unknown';
        }
    };

    return (
        <div>
            <h2>Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {receiptItems && receiptItems.length > 0 && receiptItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.price}</td>
                            <td>{item.category ? findCategoryNameById(item.category) : 'Unknown'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Stats</h3>
            <table>
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total</td>
                        <td>{totalPrice}</td>
                    </tr>
                    <tr>
                        <td>Current Month</td>
                        <td>{totalPriceCurrentMonth}</td>
                    </tr>
                    <tr>
                        <td>Last Month</td>
                        <td>{totalPriceLastMonth}</td>
                    </tr>
                    <tr>
                        <td>For One Month</td>
                        <td>{totalPriceForOneMonth}</td>
                    </tr>
                    <tr>
                        <td>This Day Last Month</td>
                        <td>{totalPriceSameDayLastMonth}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ReceiptItemList;
