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
                    resetRefresh();
                });
        }
    }, [shouldRefresh, resetRefresh]);

    return (
        <div>
            {receipts.map((receipt) => (
                <div key={receipt.id}>
                    <h2>Receipt #{receipt.id}</h2>
                    <p>Date: {new Date(receipt.date).toLocaleDateString()}</p>
                    <p>Store: {receipt.store}</p>
                    <p>Total: {receipt.total}</p>
                    {receipt.items && receipt.items.map((item, index) => (
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
