import React, { useState, useEffect } from 'react';
import { fetchReceiptItems } from '../api';
import { useSelector, useDispatch } from 'react-redux';

import { setShouldRefresh } from '../redux/store';

function ReceiptItemList() {
    const [receiptItems, setReceiptItems] = useState([]);
    const shouldRefresh = useSelector(state => state.shouldRefresh);
    const categories = useSelector(state => state.categories);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (shouldRefresh) {
                try {
                    const response = await fetchReceiptItems();
                    setReceiptItems(response);
                    dispatch(setShouldRefresh(false));
                } catch (error) {
                    console.error(error);
                }
            }
        };
    
        fetchData();
    }, [shouldRefresh, dispatch]);
/*
    useEffect(() => {
        const fetchData = async () => {
            if (shouldRefresh) {
                const response = await fetchReceiptItems();
                setReceiptItems(response);
                dispatch(setShouldRefresh(false));
            }
        };
        fetchData();
    }, [shouldRefresh, dispatch]);
*/
    const findCategoryNameById = (id) => {
        if (categories && Array.isArray(categories)) {
            const category = categories.find(category => category.id === id);
            return category ? category.name : 'Unknown';
        } else {
            return 'Unknown';
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Items</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {receiptItems && receiptItems.length > 0 && receiptItems.map(item => (
                        <tr key={item.id} className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                            <td className="px-6 py-1 whitespace-nowrap">{item.item_name}</td>
                            <td className="px-6 py-1 whitespace-nowrap">{item.price}</td>
                            <td className="px-6 py-1 whitespace-nowrap">{item.category ? findCategoryNameById(item.category) : 'Unknown'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );    
}

export default ReceiptItemList;
