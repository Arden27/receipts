import React, { useEffect, useCallback } from "react";
import { fetchCategories } from "../api";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { setCategories, setShouldRefresh } from "../redux/store"; // Import setShouldRefresh
import CategoryForm from "./CategoryForm";

function CategoryList() {
	const dispatch = useDispatch();
	const shouldRefresh = useSelector((state) => state.shouldRefresh); // Use shouldRefresh from Redux
	const categories = useSelector((state) => state.categories); // Use categories from Redux

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
		<div className="flex h-full min-h-0 flex-col px-4">
			<h2 className="flex justify-center text-2xl font-bold">Category</h2>
			<div className="flex justify-end">
				<CategoryForm />
			</div>
			<div className="min-w-full divide-y divide-gray-200">
				<table className="w-full table-fixed">
					<thead className="bg-gray-50">
						<tr>
							<th className="w-1/3 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category Name</th>
							<th className="w-1/3 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Items</th>
							<th className="w-1/3 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
						</tr>
					</thead>
				</table>
			</div>
			<div className="flex-grow overflow-auto">
				<table className="w-full min-w-full table-fixed divide-y divide-gray-200">
					<tbody className="divide-y divide-gray-200 bg-white">
						{categories &&
							categories.length > 0 &&
							categories.map((category) => (
								<tr key={category.id} className="transition-colors duration-200 ease-in-out hover:bg-gray-100">
									<td className="w-1/3 whitespace-nowrap px-6 py-2">{category.name}</td>
									<td className="w-1/3 whitespace-nowrap px-6 py-2">{category.category_item_count}</td>
									<td className="w-1/3 whitespace-nowrap px-6 py-2">{category.total_category_price}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default CategoryList;
