import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import { setShouldRefresh } from './redux/store';

function ReceiptItemList() {
    const [receiptItems, setReceiptItems] = useState([]);

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
        }
    }, [shouldRefresh, dispatch]);

    const findCategoryNameById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.name : 'Unknown';
    };

    return (
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
    );
}

export default ReceiptItemList;
