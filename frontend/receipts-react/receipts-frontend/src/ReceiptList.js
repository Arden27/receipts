// ReceiptList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Import useSelector
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setShouldRefresh } from './redux/store'; // Import setShouldRefresh

function ReceiptList() {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const shouldRefresh = useSelector(state => state.shouldRefresh); // Use shouldRefresh from Redux

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'SET_SHOULD_REFRESH', payload: true });
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (shouldRefresh) {
            axios.get(`/api/receipts/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then(res => {
                    const receiptData = res.data;
                    setReceipts(receiptData);
                    dispatch(setShouldRefresh(false)); // Reset the flag
                });
        }
    }, [shouldRefresh, dispatch]);

    const handleReceiptClick = (receipt) => {
        const token = localStorage.getItem('token');

        if (selectedReceipt && receipt.id === selectedReceipt.id) {
            // If the selected receipt is clicked again, hide the details
            setSelectedReceipt(null);
            setSelectedItems([]);
        } else {
            setSelectedReceipt(receipt);
            // Fetch receipt items
            axios.get(`/api/receiptitems/?receipt=${receipt.id}`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then(res => {
                    setSelectedItems(res.data);
                });
        }
    }

    return (
        <div>
            {receipts.map((receipt) => (
                <div key={receipt.id}>
                    <p onClick={() => handleReceiptClick(receipt)}>{new Date(receipt.date).toLocaleDateString()} - {receipt.store} - {receipt.total}</p>
                    {selectedReceipt && selectedReceipt.id === receipt.id && selectedItems.map((item, index) => (
                        <div key={index}>
                            <p>Item: {item.item_name}</p>
                            <p>Price: {item.price}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default ReceiptList;