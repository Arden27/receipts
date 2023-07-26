import React, { useState, useEffect } from "react";
import { fetchReceipts, fetchReceiptItemsById } from "../api";
import { useSelector, useDispatch } from "react-redux";

function ReceiptList( {onEdit} ) {
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

    const handleEditClick = (event, receipt) => {
        event.stopPropagation(); // Prevent triggering handleReceiptClick
    
        // Fetch receipt items and pass them to onEdit function
        fetchReceiptItemsById(receipt.id)
          .then((items) => onEdit(receipt, items))
          .catch(console.error);
      };

	return (
		<div className="flex h-full min-h-0 flex-col px-4 py-2">
			<h2 className="mb-1 flex justify-center text-2xl font-bold">Receipts</h2>
			<div className="min-w-full divide-y divide-gray-200">
				<table className="w-full table-fixed">
					<thead className="bg-gray-50">
						<tr>
							<th className="w-1/3 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
							<th className="w-1/3 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Store</th>
							<th className="w-1/3 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
						</tr>
					</thead>
				</table>
			</div>
			<div className="flex-grow overflow-auto">
				<table className="w-full min-w-full table-fixed divide-y divide-gray-200">
					<tbody className="divide-y divide-gray-200 bg-white">
						{receipts &&
							receipts.length > 0 &&
							receipts.map((receipt) => (
								<React.Fragment key={receipt.id}>
									<tr className={`group relative cursor-pointer transition-colors duration-200 ease-in-out ${selectedReceipt && selectedReceipt.id === receipt.id ? 'bg-gray-100' : 'hover:bg-gray-100'}`} onClick={() => handleReceiptClick(receipt)}>
										<td className="w-1/3 whitespace-nowrap px-6 py-2">{new Date(receipt.date).toLocaleDateString()}</td>
										<td className="w-1/3 whitespace-nowrap px-6 py-2">{receipt.store}</td>
										<td className="relative w-1/3 whitespace-nowrap px-6 py-2">
											{receipt.total}
											<button className="absolute right-0 top-1/2 mr-4 -translate-y-1/2 transform opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" onClick={(event) => handleEditClick(event, receipt)}>Edit</button>
										</td>
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
