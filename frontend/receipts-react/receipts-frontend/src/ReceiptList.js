// ReceiptList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { setShouldRefresh } from './redux/store'; // Import setShouldRefresh

function ReceiptList() {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const shouldRefresh = useSelector(state => state.shouldRefresh); // Use shouldRefresh from Redux
    const categories = useSelector(state => state.categories); // Use categories from Redux

    const dispatch = useDispatch();

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
                    console.log('fetched data from /api/receipts/ in ReceiptList')
                    console.log(receiptData);
                    setReceipts(receiptData);
                    dispatch(setShouldRefresh(false)); // Reset the flag
                });
        }
    }, [shouldRefresh, dispatch]);

    // Find category name by id
    const findCategoryNameById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.name : 'Unknown';
    };

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
                    console.log('fetched data from /api/receiptitems/?receipt=id in ReceiptList')
                    console.log(res.data)
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
                            <p>Category: {item.category ? findCategoryNameById(item.category) : 'Unknown'}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default ReceiptList;
