import React, { useState, useEffect } from 'react';
import { fetchReceipts, fetchReceiptItemsById } from '../api';
import { useSelector, useDispatch } from 'react-redux';

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
        <div className="p-4 flex flex-col h-full min-h-0">
            <h2 className="text-2xl font-bold mb-4">Receipts</h2>
            <div className="overflow-auto flex-grow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {receipts && receipts.length > 0 && receipts.map((receipt) => (
                            <React.Fragment key={receipt.id}>
                                <tr onClick={() => handleReceiptClick(receipt)} className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                                    <td className="px-6 py-2 whitespace-nowrap">{new Date(receipt.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-2 whitespace-nowrap">{receipt.store}</td>
                                    <td className="px-6 py-2 whitespace-nowrap">{receipt.total}</td>
                                </tr>
                                {selectedReceipt && selectedReceipt.id === receipt.id &&
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4">
                                            <table className="min-w-full divide-y divide-gray-200 mt-4">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {selectedItems && selectedItems.length > 0 && selectedItems.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                                                            <td className="px-6 py-1 whitespace-nowrap">{item.item_name}</td>
                                                            <td className="px-6 py-1 whitespace-nowrap">{item.price}</td>
                                                            <td className="px-6 py-1 whitespace-nowrap">{item.category ? findCategoryNameById(item.category) : 'Unknown'}</td>
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
        </div>
    );
    
}

export default ReceiptList;
