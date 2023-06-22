import React, { useState } from 'react';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
import ReceiptItemList from './ReceiptItemList';

function App() {
    const [addingReceipt, setAddingReceipt] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(true);

    const handleAddReceiptClick = () => {
        setAddingReceipt(true);
    };

    const handleReceiptSubmit = () => {
        setAddingReceipt(false);
        setShouldRefresh(true);
    };

    return (
        <div className="App">
            {!addingReceipt && <button onClick={handleAddReceiptClick}>Add Receipt</button>}
            {addingReceipt && <ReceiptForm onSubmit={handleReceiptSubmit} />}
            <ReceiptList shouldRefresh={shouldRefresh} setShouldRefresh={setShouldRefresh} />
            <ReceiptItemList shouldRefresh={shouldRefresh} setShouldRefresh={setShouldRefresh} />
        </div>
    );
}

export default App;
