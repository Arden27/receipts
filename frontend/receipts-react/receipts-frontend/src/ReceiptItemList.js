import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import { setShouldRefresh } from './redux/store';

function ReceiptItemList() {
    const [receiptItems, setReceiptItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const shouldRefresh = useSelector(state => state.shouldRefresh);
    const categories = useSelector(state => state.categories);

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
                    dispatch(setShouldRefresh(false));
                });
            
            // Fetch total price
            axios.get(`/api/receiptitemstotalprice/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })
                .then(res => {
                    setTotalPrice(res.data.total_price);
                });
        }
    }, [shouldRefresh, dispatch]);

    const findCategoryNameById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.name : 'Unknown';
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {receiptItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.price}</td>
                            <td>{item.category ? findCategoryNameById(item.category) : 'Unknown'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>Total Price: {totalPrice}</div> {/* Display total price */}
        </div>
    );
}

export default ReceiptItemList;
