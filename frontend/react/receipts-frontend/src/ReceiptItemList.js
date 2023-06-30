import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import { setShouldRefresh } from './redux/store';

function ReceiptItemList() {
    const [receiptItems, setReceiptItems] = useState([]);
    const shouldRefresh = useSelector(state => state.shouldRefresh);
    const categories = useSelector(state => state.categories);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        const fetchData = async () => {
            if (shouldRefresh) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/receiptitems/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    setReceiptItems(response.data);
                    dispatch(setShouldRefresh(false));
    
                } catch (error) {
                    console.error(error);
                }
            }
        };
    
        fetchData();
    }, [shouldRefresh, dispatch]);

    const findCategoryNameById = (id) => {
        if (categories && Array.isArray(categories)) {
            const category = categories.find(category => category.id === id);
            return category ? category.name : 'Unknown';
        } else {
            return 'Unknown';
        }
    };

    return (
        <div>
            <h2>Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {receiptItems && receiptItems.length > 0 && receiptItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.price}</td>
                            <td>{item.category ? findCategoryNameById(item.category) : 'Unknown'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReceiptItemList;
