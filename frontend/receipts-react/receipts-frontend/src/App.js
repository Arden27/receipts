import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
import ReceiptItemList from './ReceiptItemList';

function App() {
    const [addingReceipt, setAddingReceipt] = useState(false);
    const dispatch = useDispatch();

    const handleAddReceiptClick = () => {
        setAddingReceipt(true);
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
        </div>
    );
}

export default App;
