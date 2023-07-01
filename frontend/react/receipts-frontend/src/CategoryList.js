import React, { useEffect, useCallback } from 'react';
import { fetchCategories } from './api';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { setCategories, setShouldRefresh } from './redux/store'; // Import setShouldRefresh
import CategoryForm from './CategoryForm';

function CategoryList() {
    const dispatch = useDispatch();
    const shouldRefresh = useSelector(state => state.shouldRefresh); // Use shouldRefresh from Redux
    const categories = useSelector(state => state.categories); // Use categories from Redux

    const loadData = useCallback(async () => {
        try {
            const response = await fetchCategories();
            dispatch(setCategories(response)); // Dispatch setCategories action
            dispatch(setShouldRefresh(false)); // Set shouldRefresh to false after categories are fetched
        } catch (error) {
            console.error(error);
        }
    }, [dispatch]); // Add dispatch to dependency array

    useEffect(() => {
        if (shouldRefresh) {
            loadData();
        }
    }, [loadData, shouldRefresh]); // Add shouldRefresh to dependency array

    return (
        <div>
            <h2>Category</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Items</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {categories && categories.length > 0 && categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>{category.category_item_count}</td>
                            <td>{category.total_category_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <CategoryForm />
        </div>
    );
}

export default CategoryList;
