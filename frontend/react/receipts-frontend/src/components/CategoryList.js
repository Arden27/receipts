import React, { useEffect, useCallback } from 'react';
import { fetchCategories } from '../api';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { setCategories, setShouldRefresh } from '../redux/store'; // Import setShouldRefresh
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
        <div className="p-4 flex flex-col h-full min-h-0">
            <h2 className="text-2xl font-bold mb-4">Category</h2>
            <CategoryForm />
            <div className="overflow-auto flex-grow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories && categories.length > 0 && categories.map(category => (
                            <tr key={category.id} className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                                <td className="px-6 py-2 whitespace-nowrap">{category.name}</td>
                                <td className="px-6 py-2 whitespace-nowrap">{category.category_item_count}</td>
                                <td className="px-6 py-2 whitespace-nowrap">{category.total_category_price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );    
}

export default CategoryList;
