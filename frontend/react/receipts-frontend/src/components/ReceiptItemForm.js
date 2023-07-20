import React, { useEffect } from 'react';
import { fetchCategories } from '../api';
import { useSelector, useDispatch } from 'react-redux';
import { setShouldRefresh, setCategories } from '../redux/store';

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
        <div className="border-t border-gray-200 pt-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`item_name_${item.id}`}>
                    Item Name:
                </label>
                <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`item_name_${item.id}`}
                    type="text" 
                    name="item_name" 
                    value={item.item_name || ''} 
                    onChange={handleChange} 
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`price_${item.id}`}>
                    Price:
                </label>
                <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`price_${item.id}`}
                    type="number" 
                    name="price" 
                    step="0.01" 
                    value={item.price || ''} 
                    onChange={handleChange} 
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`category_${item.id}`}>
                    Category:
                </label>
                <select 
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={`category_${item.id}`}
                    name="category" 
                    value={item.category || ''} 
                    onChange={handleChange}
                >
                    <option value="">Select category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
    
}

export default ReceiptItemForm;
