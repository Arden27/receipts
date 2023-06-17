import React, { useState, useEffect, useCallback } from 'react';
import ReceiptItemForm from './ReceiptItemForm';
import axios from 'axios';

function ReceiptForm({ onSubmit }) {
    const [store, setStore] = useState("");
    const [date, setDate] = useState("");
    const [totalAmount, setTotalAmount] = useState(null);
    const [items, setItems] = useState([{ item_name: "", price: "" }]);

    const addItem = useCallback(() => {
        setItems(items => [...items, { item_name: "", price: "" }]);
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

    const handleSubmit = event => {
        event.preventDefault();

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
        
        // Make a POST request to the Receipt API to create a new receipt
        axios.post(`/api/receipts/`, receipt)
            .then(res => {
                const receiptId = res.data.id;  // get the id of the created receipt
        
                // For each item, we add the receipt id and make a POST request to the ReceiptItem API
                items.filter(item => item.price && item.item_name).forEach(item => {
                    const receiptItem = { ...item, receipt: receiptId };
                    axios.post(`/api/receiptitems/`, receiptItem)
                        .then(res => console.log(res))
                        .catch(error => console.error(error));
                });
        
                // Call the callback function passed from the parent component
                if (onSubmit) {
                    onSubmit();
                }
            })
            .catch(error => console.error(error));
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
