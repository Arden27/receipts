import React, { useState } from 'react';
import { createCategory } from '../api';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setShouldRefresh } from '../redux/store'; // Import setShouldRefresh

function CategoryForm() {
    const [categoryName, setCategoryName] = useState('');
    const [warning, setWarning] = useState(""); // Add warning state
    const dispatch = useDispatch(); // Use useDispatch

    const handleSubmit = async event => {
        event.preventDefault();

        if (!categoryName) { // Check if name is empty
            setWarning("Category name cannot be empty."); // Set warning message
            return;
        }
        try {
            await createCategory(categoryName);
            setCategoryName('');
            setWarning('')
            dispatch(setShouldRefresh(true)); // Set shouldRefresh to true after a new category is added
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="flex items-center border-b border-teal-500 py-2">
                <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
                    type="text" 
                    placeholder="Category Name" 
                    value={categoryName} 
                    onChange={e => setCategoryName(e.target.value)}
                />
                <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" 
                    type="submit">
                    Add Category
                </button>
            </div>
            {warning && 
                <p className="mt-2 text-red-500 text-xs italic">{warning}</p>
            } {/* Display warning message if present */}
        </form>
    );
    
}

export default CategoryForm;
