import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import MainApp from './MainApp';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Function to check if user is logged in
    const checkIsLoggedIn = () => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    };

    // Effect to check if user is logged in when the app first loads
    useEffect(checkIsLoggedIn, []);

    if (!isLoggedIn) {
        return (
            <div>
                <LoginForm onLogin={checkIsLoggedIn} />
                <RegistrationForm onRegister={checkIsLoggedIn} />
            </div>
        );
    }

    return <MainApp />;
}

export default App;
