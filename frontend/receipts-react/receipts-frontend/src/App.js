import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import MainApp from './MainApp';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkIsLoggedIn = () => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    };

    useEffect(checkIsLoggedIn, []);

    return (
        <Router>
            <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginForm onLogin={checkIsLoggedIn} />} />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <RegistrationForm onRegister={checkIsLoggedIn} />} />
                <Route path="/" element={isLoggedIn ? <MainApp setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} />  
            </Routes>
        </Router>
    );
}

export default App;
