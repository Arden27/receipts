import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReceiptForm from "./ReceiptForm";
import ReceiptList from "./ReceiptList";
import { useNavigate } from "react-router-dom";
import CategoryList from "./CategoryList";
import Totals from "./Totals";
import { resetStore, setAuthError } from "../redux/store";
import { logoutUser } from "../api";

function MainApp({ setIsLoggedIn }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isFormVisible, setFormVisible] = useState(false);
	const [editableReceipt, setEditableReceipt] = useState(null);
	const [editableItems, setEditableItems] = useState(null);

	const isAuthError = useSelector((state) => state.isAuthError);

    const isEditMode = editableReceipt !== null && editableItems !== null;

	useEffect(() => {
		dispatch({ type: "SET_SHOULD_REFRESH", payload: true });
	}, [dispatch]);

	useEffect(() => {
		if (isAuthError) {
			setIsLoggedIn(false);
			navigate("/login");
			dispatch(setAuthError(false));
		}
	}, [isAuthError, setIsLoggedIn, navigate, dispatch]);

	const handleLogout = async () => {
		try {
			await logoutUser();
		} catch (error) {
			console.log(error);
		} finally {
			localStorage.removeItem("token");
			dispatch(resetStore());
			setIsLoggedIn(false);
			navigate("/login");
		}
	};

	const handleEdit = (receipt, items) => {
		setFormVisible(true);
		setEditableReceipt(receipt);
		setEditableItems(items);
	};

	const handleSubmit = () => {
		setFormVisible(false);
		setEditableReceipt(null);
		setEditableItems(null);
		dispatch({ type: "SET_SHOULD_REFRESH", payload: true });
	};

	return (
		<div className="App grid h-screen grid-cols-2 grid-rows-[auto_auto_1fr]">
			<nav className="col-span-2 flex justify-between bg-blue-400 p-4 text-white">
				<button onClick={() => setFormVisible(!isFormVisible)} className={isFormVisible ? "rounded border border-red-500 bg-white px-4 py-2 font-bold text-red-500 hover:bg-red-500 hover:text-white" : "rounded bg-green-500 px-4 py-2 font-bold hover:bg-green-700"}>
					{isFormVisible ? "Cancel" : "Add Receipt"}
				</button>
				<button onClick={handleLogout} className="rounded bg-red-500 px-4 py-2 font-bold hover:bg-red-700">
					Logout
				</button>
			</nav>
			<div className="col-span-1 row-span-2 overflow-auto">
				{isFormVisible && isEditMode ? <ReceiptForm onSubmit={handleSubmit} editMode={true} receipt={editableReceipt} items={editableItems} /> : isFormVisible && <ReceiptForm onSubmit={handleSubmit} />}
				<ReceiptList onEdit={handleEdit} />
			</div>
			<div className="col-start-2 row-start-2 overflow-auto">
				<Totals />
			</div>
			<div className="col-start-2 row-start-3 overflow-auto">
				<CategoryList />
			</div>
		</div>
	);
}

export default MainApp;
