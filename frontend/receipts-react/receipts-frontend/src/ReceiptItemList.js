// ReceiptItemList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Import useSelector
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setShouldRefresh } from './redux/store'; // Import setShouldRefresh

function ReceiptItemList() {
    const [receiptItems, setReceiptItems] = useState([]);

    const shouldRefresh = useSelector(state => state.shouldRefresh); // Use shouldRefresh from Redux

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
                    dispatch(setShouldRefresh(false)); // Reset the flag
                });
        }
    }, [shouldRefresh, dispatch]);

    return (
        <ul>
            {receiptItems.map(item => (
                <li key={item.id}>{item.item_name} - {item.price}</li>
            ))}
        </ul>
    );
}

export default ReceiptItemList;
