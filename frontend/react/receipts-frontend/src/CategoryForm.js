import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setShouldRefresh } from './redux/store'; // Import setShouldRefresh

function CategoryForm() {
    const [categoryName, setCategoryName] = useState('');
    const [warning, setWarning] = useState(""); // Add warning state
    const token = localStorage.getItem('token');
    const dispatch = useDispatch(); // Use useDispatch

    const handleSubmit = async event => {
        event.preventDefault();

        if (!categoryName) { // Check if name is empty
            setWarning("Category name cannot be empty."); // Set warning message
            return;
        }
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/categories/`, { name: categoryName }, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setCategoryName('');
            setWarning('')
            dispatch(setShouldRefresh(true)); // Set shouldRefresh to true after a new category is added
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Category Name:
                <input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
            </label>
            <button type="submit">Add Category</button>
            {warning && <p>{warning}</p>} {/* Display warning message if present */}
        </form>
    );
}

export default CategoryForm;
