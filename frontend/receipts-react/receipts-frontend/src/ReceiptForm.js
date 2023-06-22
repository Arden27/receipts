import React, { useState, useEffect, useCallback } from 'react';
import ReceiptItemForm from './ReceiptItemForm';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setShouldRefresh } from './redux/store';

function ReceiptForm({ onSubmit }) {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [store, setStore] = useState("");
    const [date, setDate] = useState(formattedDate);
    const [totalAmount, setTotalAmount] = useState(null);
    const [items, setItems] = useState([{ item_name: "", price: "", category: "" }]);

    const dispatch = useDispatch();

    const token = localStorage.getItem('token');

    const addItem = useCallback(() => {
        setItems(items => [...items, { item_name: "", price: "", category: "" }]);
    }, []);
    
    useEffect(() => {
        const totalSum = items.reduce((total, item) => total + parseFloat(item.price || 0), 0);
        const lastItem = items[items.length - 1];
    
        if (totalAmount != null && totalSum < totalAmount && lastItem.price !== "") {
            const timer = setTimeout(addItem, 750);
            
            return () => clearTimeout(timer);
        } else if (totalAmount != null && totalSum >= totalAmount && lastItem.price === "" && items.length > 1) {
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
        
        const hasItemsWithoutCategory = items.some(item => !item.category);
        if (hasItemsWithoutCategory) {
            // You can notify the user about the issue here, for example
            alert('All items must have a category!');
            return;
        }

        let totalSum = items.reduce((total, item) => total + parseFloat(item.price || 0), 0);
        if (totalAmount != null && totalSum > totalAmount) {
            // Don't submit if the sum of item prices is more than the total amount provided
            return;
        }
    
        const receipt = { 
            date: date,
            store: store,
            total: totalSum.toFixed(2),
        };
    
        try {
            const res = await axios.post(`/api/receipts/`, receipt, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const receiptId = res.data.id;  // get the id of the created receipt
    
            // For each item, we add the receipt id and make a POST request to the ReceiptItem API
            const receiptItemsPromises = items.filter(item => item.price && item.item_name && item.category).map(item => {
                const receiptItem = { ...item, receipt: receiptId, category: parseInt(item.category) }; // Ensure category is an integer (category ID)
                console.log('posted data in ReceiptItemForm:')
                console.log(receiptItem)
                return axios.post(`/api/receiptitems/`, receiptItem, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
            });
    
            await Promise.all(receiptItemsPromises);
    
            dispatch(setShouldRefresh(true));
            onSubmit();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Store:
                <input type="text" value={store} onChange={e => setStore(e.target.value)} />
            </label>
            <label>
                Date:
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </label>
            <label>
                Total:
                <input 
                    type="number" 
                    value={totalAmount || ''} 
                    onChange={e => setTotalAmount(e.target.value === '' ? null : Number(e.target.value))} 
                />
            </label>
            {items.map((item, index) => (
                <ReceiptItemForm 
                    key={index} 
                    item={item} 
                    onItemChange={updatedItem => updateItem(index, updatedItem)} 
                />
            ))}
            {totalAmount == null && <button type="button" onClick={addItem}>Add Another Item</button>}
            <button type="submit">Submit Receipt</button>
        </form>
    );
    
}

export default ReceiptForm;
