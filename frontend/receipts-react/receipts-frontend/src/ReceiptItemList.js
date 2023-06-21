// ReceiptItemList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector
import { setShouldRefresh } from './redux/store'; // Import setShouldRefresh

function ReceiptItemList() {
    const [receiptItems, setReceiptItems] = useState([]);

    const shouldRefresh = useSelector(state => state.shouldRefresh); // Use shouldRefresh from Redux
    const categories = useSelector(state => state.categories); // Use categories from Redux

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
                    console.log('fetched data from /api/receiptitems/ in ReceiptItemList')
                    console.log(receiptItemData);
                    setReceiptItems(receiptItemData);
                    dispatch(setShouldRefresh(false)); // Reset the flag
                });
        }
    }, [shouldRefresh, dispatch]);

    // Find category name by id
    const findCategoryNameById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.name : 'Unknown';
    };

    return (
        <ul>
            {receiptItems.map(item => (
                <li key={item.id}>
                    {item.item_name} - {item.price} - {item.category ? findCategoryNameById(item.category) : 'Unknown'}
                </li>
            ))}
        </ul>
    );
}

export default ReceiptItemList;
