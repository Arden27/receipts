import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
import ReceiptItemList from './ReceiptItemList';
import { useNavigate } from "react-router-dom";

function MainApp({ setIsLoggedIn }) {
    const [addingReceipt, setAddingReceipt] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddReceiptClick = () => {
        setAddingReceipt(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const handleReceiptSubmit = () => {
        setAddingReceipt(false);
        dispatch({ type: 'SET_SHOULD_REFRESH', payload: true });
    };

    return (
        <div className="App">
            {!addingReceipt && <button onClick={handleAddReceiptClick}>Add Receipt</button>}
            {addingReceipt && <ReceiptForm onSubmit={handleReceiptSubmit} onLogout={handleLogout} />}
            <ReceiptList />
            <ReceiptItemList />
            <br/>
            <br/>
            <br/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default MainApp;

