import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
//import ReceiptItemList from './ReceiptItemList';
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

    const handleToggleReceiptForm = () => {
        setAddingReceipt(!addingReceipt);
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
        <div className="App grid grid-cols-2 grid-rows-[auto_auto_1fr] h-screen">
            <nav className="col-span-2 flex justify-between bg-blue-400 p-4 text-white">
                <button 
                    onClick={handleToggleReceiptForm} 
                    className={addingReceipt ? "font-bold py-2 px-4 rounded bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white" : "font-bold py-2 px-4 rounded bg-green-500 hover:bg-green-700"}
                >
                    {addingReceipt ? "Cancel" : "Add Receipt"}
                </button>
                <button 
                    onClick={handleLogout} 
                    className="font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-700"
                >
                    Logout
                </button>
            </nav>
            <div className="row-span-2 col-span-1 overflow-auto">
                {addingReceipt && <ReceiptForm onSubmit={handleReceiptSubmit} />}
                <ReceiptList />
            </div>
            <div className="row-start-2 col-start-2 overflow-auto">
                <Totals />
            </div>
            <div className="row-start-3 col-start-2 overflow-auto">
                <CategoryList />
            </div>
        </div>
    );
}

export default MainApp;
