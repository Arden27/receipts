import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import { setShouldRefresh } from './redux/store';

function ReceiptList() {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const shouldRefresh = useSelector(state => state.shouldRefresh);
    const categories = useSelector(state => state.categories);

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
                    setReceipts(receiptData);
                    dispatch(setShouldRefresh(false));
                });
        }
    }, [shouldRefresh, dispatch]);

    const findCategoryNameById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.name : 'Unknown';
    };

    const handleReceiptClick = (receipt) => {
        const token = localStorage.getItem('token');

        if (selectedReceipt && receipt.id === selectedReceipt.id) {
            setSelectedReceipt(null);
            setSelectedItems([]);
        } else {
            setSelectedReceipt(receipt);
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
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Store</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {receipts.map((receipt, index) => (
                    <>
                        <tr key={receipt.id} onClick={() => handleReceiptClick(receipt)}>
                            <td>{new Date(receipt.date).toLocaleDateString()}</td>
                            <td>{receipt.store}</td>
                            <td>{receipt.total}</td>
                        </tr>
                        {selectedReceipt && selectedReceipt.id === receipt.id &&
                            <tr>
                                <td colSpan="3">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Item Name</th>
                                                <th>Price</th>
                                                <th>Category</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.item_name}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.category ? findCategoryNameById(item.category) : 'Unknown'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        }
                    </>
                ))}
            </tbody>
        </table>
    );
}

export default ReceiptList;
