// ReceiptList.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function ReceiptItemList({ shouldRefresh, setShouldRefresh }) {
    const [receiptItems, setReceiptItems] = useState([]);

    const resetRefresh = useCallback(() => {
        setShouldRefresh(false);
    }, [setShouldRefresh]);

    useEffect(() => {
        if (shouldRefresh) {
            axios.get(`/api/receiptitems/`)
                .then(res => {
                    const receiptItemData = res.data;
                    setReceiptItems(receiptItemData);
                    resetRefresh(); // Use the memoized function
                });
        }
    }, [shouldRefresh, resetRefresh]);

    return (
        <ul>
            {receiptItems.map(item => (
                <li key={item.id}>{item.item_name} - {item.price}</li>
            ))}
        </ul>
    );
}

export default ReceiptItemList;
