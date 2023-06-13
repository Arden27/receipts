// ReceiptList.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function ReceiptList({ shouldRefresh, setShouldRefresh }) {
    const [receipts, setReceipts] = useState([]);

    const resetRefresh = useCallback(() => {
        setShouldRefresh(false);
    }, [setShouldRefresh]);

    useEffect(() => {
        if (shouldRefresh) {
            axios.get(`/api/receipts/`)
                .then(res => {
                    const receiptData = res.data;
                    setReceipts(receiptData);
                    resetRefresh(); // Use the memoized function
                });
        }
    }, [shouldRefresh, resetRefresh]);

    return (
        <ul>
            {receipts.map(receipt => (
                <li key={receipt.id}>{receipt.item_name} - {receipt.price} - {new Date(receipt.purchase_date).toLocaleDateString()}</li>
            ))}
        </ul>
    );
}

export default ReceiptList;
