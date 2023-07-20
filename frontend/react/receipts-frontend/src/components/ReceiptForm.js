import React, { useState, useEffect, useCallback } from 'react';
import ReceiptItemForm from './ReceiptItemForm';
import { createReceipt, createReceiptItem } from '../api';
import { useDispatch } from 'react-redux';
import { setShouldRefresh } from '../redux/store';

function ReceiptForm({ onSubmit }) {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [store, setStore] = useState("");
    const [date, setDate] = useState(formattedDate);
    const [totalAmount, setTotalAmount] = useState(null);
    const [items, setItems] = useState([{ item_name: "", price: "", category: "" }]);

    const dispatch = useDispatch();

    const addItem = useCallback(() => {
        setItems(items => [...items, { item_name: "", price: "", category: "" }]);
    }, []);
    
    useEffect(() => {
        const totalSum = items.reduce((total, item) => total + parseFloat(item.price || 0), 0);
        const lastItem = items[items.length - 1];
    
        if (totalAmount != null && totalSum < totalAmount && lastItem.price !== "") {
            const timer = setTimeout(addItem, 750);
            return () => clearTimeout(timer);
        } else if (totalAmount != null && totalSum >= totalAmount && lastItem.item_name === "" && lastItem.price === "" && lastItem.category === "" && items.length > 1) {
            setItems(items => items.filter((item, index) => index !== items.length - 1));
        }
    }, [totalAmount, items, addItem]);
    
    

    const updateItem = (index, updatedItem) => {
        let newItems = [...items];
        newItems[index] = updatedItem;
        setItems(newItems);
    };

    const handleSubmit = async event => {
        event.preventDefault();
    
        // Filter out the items that are not completed (missing either item_name, price, or category)
        const cleanedItems = items.filter(item => item.item_name || item.price || item.category);
    
        // Check if any item is missing item_name, price, or category
        const hasItemsWithoutName = cleanedItems.some(item => !item.item_name);
        const hasItemsWithoutPrice = cleanedItems.some(item => !item.price);
        const hasItemsWithoutCategory = cleanedItems.some(item => !item.category);

        let missingItemFields = [];
        let missingStoreField = '';

        if (store === "") missingStoreField = 'Please provide the name of the store.';
        if (hasItemsWithoutName) missingItemFields.push('name');
        if (hasItemsWithoutPrice) missingItemFields.push('price');
        if (hasItemsWithoutCategory) missingItemFields.push('category');

        if (missingStoreField || missingItemFields.length > 0) {
            let alertMessage = '';

            if (missingStoreField) {
                alertMessage += missingStoreField + ' ';
            }

            if (missingItemFields.length > 0) {
                alertMessage += 'All items must have a ' + missingItemFields.join(' and ') + '!';
            }

            alert(alertMessage);
            return;
        }
    
        let totalSum = cleanedItems.reduce((total, item) => total + parseFloat(item.price || 0), 0);
        if (totalAmount != null && totalSum !== totalAmount) {
            // Don't submit if the sum of item prices is more than the total amount provided
            alert('sum is not equal to total');
            return;
        }
    
        const receipt = { 
            date: date,
            store: store,
            total: totalSum.toFixed(2),
        };
    
        try {
            const res = await createReceipt(receipt);
            const receiptId = res.id;  // get the id of the created receipt
    
            // For each item, we add the receipt id and make a POST request to the ReceiptItem API
            const receiptItemsPromises = cleanedItems.map(item => {
                const receiptItem = { ...item, receipt: receiptId, category: parseInt(item.category) }; // Ensure category is an integer (category ID)
                console.log('posted data in ReceiptItemForm:')
                console.log(receiptItem)
                return createReceiptItem(receiptItem);
            });
    
            await Promise.all(receiptItemsPromises);
    
            dispatch(setShouldRefresh(true));
            onSubmit();
        } catch (error) {
            console.error(error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="flex space-x-4 mb-4">
                <div className="w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store">
                        Store:
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="store" 
                        type="text" 
                        value={store} 
                        onChange={e => setStore(e.target.value)} 
                    />
                </div>
                <div className="w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                        Date:
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="date" 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)} 
                    />
                </div>
                <div className="w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total">
                        Total:
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="total" 
                        type="number" 
                        value={totalAmount || ''} 
                        onChange={e => setTotalAmount(e.target.value === '' ? null : Number(e.target.value))} 
                    />
                </div>
            </div>
            <div className="mt-4 bg-gray-100 p-4 rounded border border-gray-300">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Item Name:
                        </label>
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Price:
                        </label>
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category:
                        </label>
                    </div>
                </div>

                {items.map((item, index) => (
                    <ReceiptItemForm 
                        key={index} 
                        item={item} 
                        onItemChange={updatedItem => updateItem(index, updatedItem)} 
                    />
                ))}

                {totalAmount == null && 
                    <div className="flex items-center justify-between mt-4">
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            type="button" 
                            onClick={addItem}
                        >
                            Add Another Item
                        </button>
                    </div>
                }
            </div>
            <div className="flex items-center justify-between mt-4">
                <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="submit"
                >
                    Submit Receipt
                </button>
            </div>
        </form>
    );
    
    
}

export default ReceiptForm;
