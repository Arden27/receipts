// ReceiptForm.js
import React, { useState } from 'react';
import axios from 'axios';

function ReceiptForm({onSubmit}) {
    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");

    const handleSubmit = event => {
        event.preventDefault();
        const receipt = { 
            item_name: itemName, 
            price: price,
            purchase_date: purchaseDate 
        };

        axios.post(`/api/receipts/`, receipt)
            .then(res => {
                console.log(res);
                console.log(res.data);
                setItemName("");
                setPrice("");
                setPurchaseDate("");

                // Call the callback function passed from the parent component
                if (onSubmit) {
                    onSubmit();
                }
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Item Name:
                <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} />
            </label>
            <label>
                Price:
                <input type="text" value={price} onChange={e => setPrice(e.target.value)} />
            </label>
            <label>
                Purchase Date:
                <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default ReceiptForm;
