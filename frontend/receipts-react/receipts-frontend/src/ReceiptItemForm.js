import React from 'react';

function ReceiptItemForm({ item, onItemChange }) {
    const handleChange = (event) => {
        const updatedItem = {
            ...item,
            [event.target.name]: event.target.value
        };
        onItemChange(updatedItem);
    };

    return (
        <div>
            <label>
                Item Name:
                <input type="text" name="item_name" value={item.item_name || ''} onChange={handleChange} />
            </label>
            <label>
                Price:
                <input type="number" name="price" step="0.01" value={item.price || ''} onChange={handleChange} />
            </label>
        </div>
    );
}

export default ReceiptItemForm;
