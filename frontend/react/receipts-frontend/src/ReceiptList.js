import React, { useState, useEffect } from 'react';
import { fetchReceipts, fetchReceiptItemsById } from './api';
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
        const fetchData = async () => {
            if (shouldRefresh) {
                try {
                    const data = await fetchReceipts();
                    setReceipts(data);
                    dispatch(setShouldRefresh(false));
                } catch (error) {
                    console.error(error);
                }
            }
        };
    
        fetchData();
    }, [shouldRefresh, dispatch]);

    const findCategoryNameById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.name : 'Unknown';
    };

    const handleReceiptClick = async (receipt) => {
        if (selectedReceipt && receipt.id === selectedReceipt.id) {
            setSelectedReceipt(null);
            setSelectedItems([]);
        } else {
            setSelectedReceipt(receipt);
            try {
                const data = await fetchReceiptItemsById(receipt.id);
                setSelectedItems(data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <h2>Receipts</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Store</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {receipts && receipts.length > 0 && receipts.map((receipt) => (
                        <React.Fragment key={receipt.id}>
                            <tr onClick={() => handleReceiptClick(receipt)}>
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
                                                {selectedItems && selectedItems.length > 0 && selectedItems.map((item) => (
                                                    <tr key={item.id}>
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
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReceiptList;
