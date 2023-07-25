import React, { useState, useEffect } from "react";
import { fetchReceipts, fetchReceiptItemsById } from "../api";
import { useSelector, useDispatch } from "react-redux";

function ReceiptList() {
	const [receipts, setReceipts] = useState([]);
	const [selectedReceipt, setSelectedReceipt] = useState(null);
	const [selectedItems, setSelectedItems] = useState([]);

	const shouldRefresh = useSelector((state) => state.shouldRefresh);
	const categories = useSelector((state) => state.categories);

	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			if (shouldRefresh) {
				try {
					const data = await fetchReceipts();
					setReceipts(data.reverse());
				} catch (error) {
					console.error(error);
				}
			}
		};

		fetchData();
	}, [shouldRefresh, dispatch]);

	const findCategoryNameById = (id) => {
		const category = categories.find((category) => category.id === id);
		return category ? category.name : "Unknown";
	};

	const handleReceiptClick = async (receipt) => {
		if (selectedReceipt && receipt.id === selectedReceipt.id) {
			setSelectedReceipt(null);
			setSelectedItems([]);
		} else {
			setSelectedReceipt(receipt);
			try {
				const data = await fetchReceiptItemsById(receipt.id);
				setSelectedItems(data);
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<div className="flex h-full min-h-0 flex-col px-4 py-2">
			<h2 className="mb-1 flex justify-center text-2xl font-bold">Receipts</h2>
			<div className="flex-grow overflow-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Store</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{receipts &&
							receipts.length > 0 &&
							receipts.map((receipt) => (
								<React.Fragment key={receipt.id}>
									<tr onClick={() => handleReceiptClick(receipt)} className="cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-100">
										<td className="whitespace-nowrap px-6 py-2">{new Date(receipt.date).toLocaleDateString()}</td>
										<td className="whitespace-nowrap px-6 py-2">{receipt.store}</td>
										<td className="whitespace-nowrap px-6 py-2">{receipt.total}</td>
									</tr>
									{selectedReceipt && selectedReceipt.id === receipt.id && (
										<tr>
											<td colSpan="3" className="px-6 py-4">
												<table className="mt-4 min-w-full divide-y divide-gray-200">
													<thead className="bg-gray-50">
														<tr>
															<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Item Name</th>
															<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
															<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-gray-200 bg-white">
														{selectedItems &&
															selectedItems.length > 0 &&
															selectedItems.map((item) => (
																<tr key={item.id} className="transition-colors duration-200 ease-in-out hover:bg-gray-100">
																	<td className="whitespace-nowrap px-6 py-1">{item.item_name}</td>
																	<td className="whitespace-nowrap px-6 py-1">{item.price}</td>
																	<td className="whitespace-nowrap px-6 py-1">{item.category ? findCategoryNameById(item.category) : "Unknown"}</td>
																</tr>
															))}
													</tbody>
												</table>
											</td>
										</tr>
									)}
								</React.Fragment>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default ReceiptList;
