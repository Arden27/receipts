import React, { useState, useEffect, useCallback } from "react";
import ReceiptItemForm from "./ReceiptItemForm";
import { createReceipt, createReceiptItem } from "../api";
import { updateReceipt, updateReceiptItem } from "../api";
import { deleteReceipt } from "../api";
import { useDispatch } from "react-redux";
import { setShouldRefresh } from "../redux/store";

function ReceiptForm({ onSubmit, editMode, receipt = null, initialItems = null }) {
	const today = new Date();
	const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

	const [store, setStore] = useState("");
	const [date, setDate] = useState(formattedDate);
	const [totalAmount, setTotalAmount] = useState(null);
	const [items, setItems] = useState([{ item_name: "", price: "", category: "" }]);

	const dispatch = useDispatch();

	const addItem = useCallback(() => {
		setItems((items) => [...items, { item_name: "", price: "", category: "" }]);
	}, []);

	useEffect(() => {
		const totalSum = items.reduce((total, item) => total + parseFloat(item.price || 0), 0);
		const lastItem = items[items.length - 1];

		if (totalAmount != null && totalSum < totalAmount && lastItem.price !== "") {
			const timer = setTimeout(addItem, 750);
			return () => clearTimeout(timer);
		} else if (totalAmount != null && totalSum >= totalAmount && lastItem.item_name === "" && lastItem.price === "" && lastItem.category === "" && items.length > 1) {
			setItems((items) => items.filter((item, index) => index !== items.length - 1));
		}
	}, [totalAmount, items, addItem]);

	const updateItem = (index, updatedItem) => {
		let newItems = [...items];
		newItems[index] = updatedItem;
		setItems(newItems);
	};

	useEffect(() => {
		if (receipt) {
			setStore(receipt.store);
			setDate(receipt.date);
			setTotalAmount(parseFloat(receipt.total));
		}

		if (initialItems) {
			setItems(initialItems);
		}
	}, [receipt, initialItems]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Filter out the items that are not completed (missing either item_name, price, or category)
		const cleanedItems = items.filter((item) => item.item_name || item.price || item.category);

		// Check if any item is missing item_name, price, or category
		const hasItemsWithoutName = cleanedItems.some((item) => !item.item_name);
		const hasItemsWithoutPrice = cleanedItems.some((item) => !item.price);
		const hasItemsWithoutCategory = cleanedItems.some((item) => !item.category);

		let missingItemFields = [];
		let missingStoreField = "";

		if (store === "") missingStoreField = "Please provide the name of the store.";
		if (hasItemsWithoutName) missingItemFields.push("name");
		if (hasItemsWithoutPrice) missingItemFields.push("price");
		if (hasItemsWithoutCategory) missingItemFields.push("category");

		if (missingStoreField || missingItemFields.length > 0) {
			let alertMessage = "";

			if (missingStoreField) {
				alertMessage += missingStoreField + " ";
			}

			if (missingItemFields.length > 0) {
				alertMessage += "All items must have a " + missingItemFields.join(" and ") + "!";
			}

			alert(alertMessage);
			return;
		}

		let totalSum = cleanedItems.reduce((total, item) => total + parseFloat(item.price || 0), 0);
		if (totalAmount != null && totalSum !== totalAmount) {
			// Don't submit if the sum of item prices is more than the total amount provided
			alert("sum is not equal to total");
			return;
		}

		const receiptPayload = {
			date: date,
			store: store,
			total: totalSum.toFixed(2),
		};

		if (!editMode) {
			// Existing createReceipt logic
			try {
				const res = await createReceipt(receiptPayload);
				const receiptId = res.id; // get the id of the created receipt

				// For each item, we add the receipt id and make a POST request to the ReceiptItem API
				const receiptItemsPromises = cleanedItems.map((item) => {
					const receiptItem = {
						...item,
						receipt: receiptId,
						category: parseInt(item.category),
					}; // Ensure category is an integer (category ID)
					console.log("posted data in ReceiptItemForm:");
					console.log(receiptItem);
					return createReceiptItem(receiptItem);
				});

				await Promise.all(receiptItemsPromises);

				dispatch(setShouldRefresh(true));
				onSubmit();
			} catch (error) {
				console.error(error);
			}
		} else {
			// Call updateReceipt API method
			try {
				// Update the receipt
				await updateReceipt(receipt.id, receiptPayload);

				// For each item, update the receipt item
				const receiptItemsPromises = cleanedItems.map((item, index) => {
					// We assume that item.id exists, if not this will fail
					const receiptItem = {
						...item,
						receipt: receipt.id,
						category: parseInt(item.category),
					};

					// If this item has an id, it's an existing item that needs to be updated
					// If it doesn't have an id, it's a new item that needs to be created
					if (item.id) {
						return updateReceiptItem(item.id, receiptItem);
					} else {
						return createReceiptItem(receiptItem);
					}
				});

				await Promise.all(receiptItemsPromises);

				dispatch(setShouldRefresh(true));
				onSubmit();
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleDelete = async () => {
		if (!receipt) {
		  console.error("No receipt to delete");
		  alert('no receipt')
		  return;
		}
	  
		// Call deleteReceipt API method
		try {
		  await deleteReceipt(receipt.id);
		  onSubmit();
		} catch (error) {
		  console.error(error);
		}
	  };

	return (
		<form onSubmit={handleSubmit} className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
			<div className="mb-4 flex space-x-4">
				<div className="w-1/3">
					<label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="store">
						Store:
					</label>
					<input className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none" id="store" type="text" value={store} onChange={(e) => setStore(e.target.value)} />
				</div>
				<div className="w-1/3">
					<label className=" mb-2 block text-sm font-bold text-gray-700" htmlFor="date">
						Date:
					</label>
					<input className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none" id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
				</div>
				<div className="w-1/3">
					<label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="total">
						Total:
					</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						id="total"
						type="number"
						value={totalAmount || ""}
						onChange={(e) => setTotalAmount(e.target.value === "" ? null : Number(e.target.value))}
					/>
				</div>
			</div>
			<div className="mt-4 rounded border border-gray-300 bg-gray-100 p-4">
				<div className="flex space-x-4">
					<div className="flex-1">
						<label className="mb-2 block text-sm font-bold text-gray-700">Item Name:</label>
					</div>
					<div className="flex-1">
						<label className="mb-2 block text-sm font-bold text-gray-700">Price:</label>
					</div>
					<div className="flex-1">
						<label className="mb-2 block text-sm font-bold text-gray-700">Category:</label>
					</div>
				</div>

				{items.map((item, index) => (
					<ReceiptItemForm key={index} item={item} onItemChange={(updatedItem) => updateItem(index, updatedItem)} />
				))}

				{totalAmount == null && (
					<div className="mt-4 flex items-center justify-between">
						<button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none" type="button" onClick={addItem}>
							Add Another Item
						</button>
					</div>
				)}
			</div>
			<div className="mt-4 flex items-center justify-between">
				<div className="flex">
					{editMode ? (
						<button className="focus:shadow-outline rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none" type="submit">
							Edit Receipt
						</button>
					) : (
						<button className="focus:shadow-outline rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none" type="submit">
							Submit Receipt
						</button>
					)}
					<button className="focus:shadow-outline px-4 py-2 text-red-500 hover:font-bold focus:outline-none" type="reset">Reset</button>
				</div>
				{editMode && <button className="focus:shadow-outline bg-white-500 rounded px-4 py-2 font-bold text-red-500 hover:bg-red-500 hover:text-white focus:outline-none" type="button" onClick={handleDelete}>Delete</button>}
			</div>
		</form>
	);
}

export default ReceiptForm;
