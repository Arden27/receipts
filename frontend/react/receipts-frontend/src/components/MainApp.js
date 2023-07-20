import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
import ReceiptItemList from './ReceiptItemList';
import { useNavigate } from "react-router-dom";
import CategoryList from './CategoryList';
import Totals from './Totals';
import { resetStore, setAuthError } from '../redux/store';
import { logoutUser } from '../api';

function MainApp({ setIsLoggedIn }) {
    const [addingReceipt, setAddingReceipt] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthError = useSelector(state => state.isAuthError);

    useEffect(() => {
        dispatch({ type: 'SET_SHOULD_REFRESH', payload: true });
    }, [dispatch]);
    
    useEffect(() => {
        if (isAuthError) {
            setIsLoggedIn(false);
            navigate('/login');
            dispatch(setAuthError(false));
        }
    }, [isAuthError, setIsLoggedIn, navigate, dispatch]);

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
        <div className="App grid grid-cols-2 gap-4">
            <div className="col-span-1">
                {!addingReceipt && 
                    <button 
                        onClick={handleAddReceiptClick} 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Receipt
                    </button>
                }
                {addingReceipt && <ReceiptForm onSubmit={handleReceiptSubmit} />}
                <div className="flex flex-col space-y-4">
                    <ReceiptList />
                    <ReceiptItemList />
                </div>
            </div>
            <div className="col-span-1 flex flex-col space-y-4">
                <Totals />
                <CategoryList />
            </div>
            <button 
                onClick={handleLogout} 
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
        </div>
    );
    
}

export default MainApp;

