import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import MainApp from './components/MainApp';

import './tailwind.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkIsLoggedIn = () => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    };

    useEffect(checkIsLoggedIn, []);
    const basename = process.env.NODE_ENV === 'production' ? '/receiptapp/' : '/';
    return (
        <Router basename={basename}>
            <Routes>
                <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginForm onLogin={checkIsLoggedIn} />} />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <RegistrationForm onRegister={checkIsLoggedIn} />} />
                <Route path="/" element={isLoggedIn ? <MainApp setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} />  
            </Routes>
        </Router>
    );
}

export default App;
