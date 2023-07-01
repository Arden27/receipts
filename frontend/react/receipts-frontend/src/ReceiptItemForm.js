import React, { useEffect } from 'react';
import { fetchCategories } from './api';
import { useSelector, useDispatch } from 'react-redux';
import { setShouldRefresh, setCategories } from './redux/store';

function ReceiptItemForm({ item, onItemChange }) {
    const categories = useSelector(state => state.categories); // Use categories from Redux
    const shouldRefresh = useSelector(state => state.shouldRefresh); // Use shouldRefresh from Redux
    const dispatch = useDispatch(); // Use useDispatch

    useEffect(() => {
        const retrieveCategories = async () => {
            try {
                const response = await fetchCategories();
                dispatch(setCategories(response)); // Dispatch setCategories action
                dispatch(setShouldRefresh(false)); // Set shouldRefresh to false after categories are fetched
            } catch (error) {
                console.error(error);
            }
        };

        if (shouldRefresh) {
            retrieveCategories();
        }
    }, [dispatch, shouldRefresh]); // Add dispatch and shouldRefresh to dependency array

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
            <label>
                Category:
                <select name="category" value={item.category || ''} onChange={handleChange}>
                    <option value="">Select category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

export default ReceiptItemForm;
