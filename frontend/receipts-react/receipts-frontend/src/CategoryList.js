import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { setCategories, setShouldRefresh } from './redux/store'; // Import setShouldRefresh
import CategoryForm from './CategoryForm';

function CategoryList() {
    const dispatch = useDispatch();
    const shouldRefresh = useSelector(state => state.shouldRefresh); // Use shouldRefresh from Redux
    const categories = useSelector(state => state.categories); // Use categories from Redux
    const token = localStorage.getItem('token');

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get(`/api/categories/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            dispatch(setCategories(response.data)); // Dispatch setCategories action
            dispatch(setShouldRefresh(false)); // Set shouldRefresh to false after categories are fetched
        } catch (error) {
            console.error(error);
        }
    }, [dispatch, token]); // Add dispatch to dependency array

    useEffect(() => {
        if (shouldRefresh) {
            fetchCategories();
        }
    }, [fetchCategories, shouldRefresh]); // Add shouldRefresh to dependency array

    return (
        <div>
            <h2>Categories</h2>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        {category.name} - {category.category_item_count} items, total price: ${category.total_category_price.toFixed(2)}
                    </li>
                ))}
            </ul>
            <CategoryForm />
        </div>
    );
}

export default CategoryList;
