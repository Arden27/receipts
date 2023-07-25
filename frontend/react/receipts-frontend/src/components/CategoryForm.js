import React, { useState } from "react";
import { createCategory } from "../api";
import { useDispatch } from "react-redux"; // Import useDispatch
import { setShouldRefresh } from "../redux/store"; // Import setShouldRefresh

function CategoryForm() {
	const [categoryName, setCategoryName] = useState("");
	const [warning, setWarning] = useState(""); // Add warning state
	const dispatch = useDispatch(); // Use useDispatch

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!categoryName) {
			// Check if name is empty
			setWarning("Category name cannot be empty."); // Set warning message
			return;
		}
		try {
			await createCategory(categoryName);
			setCategoryName("");
			setWarning("");
			dispatch(setShouldRefresh(true)); // Set shouldRefresh to true after a new category is added
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-sm">
			<div className="flex items-center border-b border-teal-500 py-2">
				<input className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none" type="text" placeholder="Category Name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
				<button className="flex-shrink-0 rounded border-4 border-teal-500 bg-teal-500 px-2 py-1 text-sm text-white hover:border-teal-700 hover:bg-teal-700" type="submit">
					Add Category
				</button>
			</div>
			{warning && <p className="mt-2 text-xs italic text-red-500">{warning}</p>} {/* Display warning message if present */}
		</form>
	);
}

export default CategoryForm;
