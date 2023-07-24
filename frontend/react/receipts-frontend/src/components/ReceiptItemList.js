import React, { useState, useEffect } from "react";
import { fetchReceiptItems } from "../api";
import { useSelector, useDispatch } from "react-redux";

import { setShouldRefresh } from "../redux/store";

function ReceiptItemList() {
	const [receiptItems, setReceiptItems] = useState([]);
	const shouldRefresh = useSelector((state) => state.shouldRefresh);
	const categories = useSelector((state) => state.categories);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			if (shouldRefresh) {
				try {
					const response = await fetchReceiptItems();
					setReceiptItems(response);
					dispatch(setShouldRefresh(false));
				} catch (error) {
					console.error(error);
				}
			}
		};

		fetchData();
	}, [shouldRefresh, dispatch]);
	/*
    useEffect(() => {
        const fetchData = async () => {
            if (shouldRefresh) {
                const response = await fetchReceiptItems();
                setReceiptItems(response);
                dispatch(setShouldRefresh(false));
            }
        };
        fetchData();
    }, [shouldRefresh, dispatch]);
*/
	const findCategoryNameById = (id) => {
		if (categories && Array.isArray(categories)) {
			const category = categories.find((category) => category.id === id);
			return category ? category.name : "Unknown";
		} else {
			return "Unknown";
		}
	};

	return (
		<div className="p-4">
			<h2 className="mb-4 justify-center text-2xl font-bold">Items</h2>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Item Name
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Price
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Category
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
					{receiptItems &&
						receiptItems.length > 0 &&
						receiptItems.map((item) => (
							<tr
								key={item.id}
								className="transition-colors duration-200 ease-in-out hover:bg-gray-100"
							>
								<td className="whitespace-nowrap px-6 py-1">
									{item.item_name}
								</td>
								<td className="whitespace-nowrap px-6 py-1">
									{item.price}
								</td>
								<td className="whitespace-nowrap px-6 py-1">
									{item.category
										? findCategoryNameById(item.category)
										: "Unknown"}
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}

export default ReceiptItemList;
