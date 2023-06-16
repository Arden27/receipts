import React, { useState } from 'react';
import ReceiptItemForm from './ReceiptItemForm';
import axios from 'axios';

function ReceiptForm({ onSubmit }) {
    const [store, setStore] = useState("");
    const [date, setDate] = useState("");
    const [items, setItems] = useState([{ item_name: "", price: "" }]);

    // Function to handle adding a new item
    const addItem = () => {
        setItems([...items, { itemName: "", price: "" }]);
    };

    // Function to handle updating an item
    const updateItem = (index, updatedItem) => {
        let newItems = [...items];
        newItems[index] = updatedItem;
        setItems(newItems);
    };

    // Function to handle form submission
    const handleSubmit = event => {
        event.preventDefault();

        // Calculate the total price of all items
        let total = items.reduce((total, item) => total + parseFloat(item.price || 0), 0);

        const receipt = { 
            date: date,
            store: store,
            total: total.toFixed(2),
        };
        
        // Make a POST request to the Receipt API to create a new receipt
        axios.post(`/api/receipts/`, receipt)
            .then(res => {
                const receiptId = res.data.id;  // get the id of the created receipt
        
                // For each item, we add the receipt id and make a POST request to the ReceiptItem API
                items.forEach(item => {
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
            {items.map((item, index) => (
                <ReceiptItemForm 
                    key={index} 
                    item={item} 
                    onItemChange={updatedItem => updateItem(index, updatedItem)} 
                />
            ))}
            <button type="button" onClick={addItem}>Add Another Item</button>
            <button type="submit">Submit Receipt</button>
        </form>
    );
}

export default ReceiptForm;
