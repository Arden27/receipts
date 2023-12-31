import React, { useEffect } from "react";
import { fetchCategories } from "../api";
import { useSelector, useDispatch } from "react-redux";
import { setShouldRefresh, setCategories } from "../redux/store";

function ReceiptItemForm({ item, onItemChange }) {
	const categories = useSelector((state) => state.categories);
	const shouldRefresh = useSelector((state) => state.shouldRefresh);
	const dispatch = useDispatch();

	useEffect(() => {
		const retrieveCategories = async () => {
			try {
				const response = await fetchCategories();
				dispatch(setCategories(response));
				dispatch(setShouldRefresh(false));
			} catch (error) {
				console.error(error);
			}
		};

		if (shouldRefresh) {
			retrieveCategories();
		}
	}, [dispatch, shouldRefresh]);

	const handleChange = (event) => {
		const updatedItem = {
			...item,
			[event.target.name]: event.target.value,
		};
		onItemChange(updatedItem);
	};

	return (
		<div className="border-t border-gray-200 pt-4">
			<div className="flex space-x-4">
				<div className="mb-4 flex-1">
					<input className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none" id={`item_name_${item.id}`} type="text" name="item_name" value={item.item_name || ""} onChange={handleChange} />
				</div>
				<div className="mb-4 flex-1">
					<input className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none" id={`price_${item.id}`} type="number" name="price" step="0.01" value={item.price || ""} onChange={handleChange} />
				</div>
				<div className="mb-4 flex-1">
					<select className="focus:shadow-outline w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none" id={`category_${item.id}`} name="category" value={item.category || ""} onChange={handleChange}>
						<option value="">Select category</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}

export default ReceiptItemForm;
