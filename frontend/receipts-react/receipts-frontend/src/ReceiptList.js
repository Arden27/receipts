import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function ReceiptList({ shouldRefresh, setShouldRefresh }) {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const resetRefresh = useCallback(() => {
        setShouldRefresh(false);
    }, [setShouldRefresh]);

    useEffect(() => {
        if (shouldRefresh) {
            axios.get(`/api/receipts/`)
                .then(res => {
                    const receiptData = res.data;
                    setReceipts(receiptData);
                    resetRefresh();
                });
        }
    }, [shouldRefresh, resetRefresh]);

    const handleReceiptClick = (receipt) => {
        if (selectedReceipt && receipt.id === selectedReceipt.id) {
            // If the selected receipt is clicked again, hide the details
            setSelectedReceipt(null);
            setSelectedItems([]);
        } else {
            setSelectedReceipt(receipt);
            // Fetch receipt items
            axios.get(`/api/receiptitems/?receipt=${receipt.id}`)
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