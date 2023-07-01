import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
import ReceiptItemList from './ReceiptItemList';
import { useNavigate } from "react-router-dom";
import CategoryList from './CategoryList';
import Totals from './Totals';
import { resetStore } from './redux/store';
import { logoutUser } from './api';

function MainApp({ setIsLoggedIn }) {
    const [addingReceipt, setAddingReceipt] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddReceiptClick = () => {
        setAddingReceipt(true);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.log(error);
        } finally {
            localStorage.removeItem('token');
            dispatch(resetStore());
            setIsLoggedIn(false);
            navigate('/login');
        }
    };

    const handleReceiptSubmit = () => {
        setAddingReceipt(false);
        dispatch({ type: 'SET_SHOULD_REFRESH', payload: true });
    };

    return (
        <div className="App">
            {!addingReceipt && <button onClick={handleAddReceiptClick}>Add Receipt</button>}
            {addingReceipt && <ReceiptForm onSubmit={handleReceiptSubmit} />}
            <ReceiptList />
            <ReceiptItemList />
            <Totals />
            <CategoryList />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default MainApp;

