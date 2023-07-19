import React, { useState } from 'react';
import { registerUser, loginUser } from '../api';
import { Link } from 'react-router-dom';

function RegistrationForm({ onRegister }) {
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await registerUser(username, password1, password2);
            const response = await loginUser(username, password1);
            localStorage.setItem('token', response.key);
            onRegister();  // inform the parent component that the user has registered
        } catch (error) {
            if (error.response) {
                if(error.response.data.non_field_errors) {
                    setError(error.response.data.non_field_errors[0]);
                } else if (error.response.data.username) {
                    setError(`Username: ${error.response.data.username[0]}`);
                } else if (error.response.data.password1) {
                    setError(`Password: ${error.response.data.password1[0]}`);
                } else if (error.response.data.password2) {
                    setError(`Confirm Password: ${error.response.data.password2[0]}`);
                } else {
                    setError("An unknown error occurred.");
                }
            } else {
                setError("Unable to register with provided information.");
            }
        }
    };

    return (
        <body className="min-h-screen bg-gradient-to-r from-blue-500 to-green-200">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="border-2 border-blue-200 rounded px-3 py-2 w-64 focus:outline-none focus:border-blue-500 focus:shadow-outline" />
                <input type="password" value={password1} onChange={e => setPassword1(e.target.value)} placeholder="Password" className="border-2 border-blue-200 rounded px-3 py-2 w-64 focus:outline-none focus:border-blue-500 focus:shadow-outline" />
                <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="Confirm Password" className="border-2 border-blue-200 rounded px-3 py-2 w-64 focus:outline-none focus:border-blue-500 focus:shadow-outline" />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</button>
                {error && <div className="text-red-500">{error}</div>}
                <div>
                    Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:text-blue-700 bold">Login</Link>
                </div>
            </form>
        </body>
    );
}

export default RegistrationForm;
