import React, { useState } from 'react';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';

function App() {
  const [shouldRefresh, setShouldRefresh] = useState(true);

  const handleFormSubmit = () => {
    setShouldRefresh(true);
  };

  return (
    <div className="App">
      <ReceiptForm onSubmit={handleFormSubmit} />
      <ReceiptList shouldRefresh={shouldRefresh} setShouldRefresh={setShouldRefresh} />
    </div>
  );
}

export default App;
