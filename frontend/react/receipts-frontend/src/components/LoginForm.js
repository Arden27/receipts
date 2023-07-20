import React, { useState } from 'react';
import { loginUser } from '../api';
import { useDispatch } from 'react-redux';
import { setShouldRefresh } from '../redux/store';
import { Link } from 'react-router-dom';

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const dispatch = useDispatch();

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const response = await loginUser(username, password);
            localStorage.setItem('token', response.key);
            onLogin();
            dispatch(setShouldRefresh(true));
        } catch (error) {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-400">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="border-2 border-blue-200 rounded px-3 py-2 w-64 focus:outline-none focus:border-blue-500 focus:shadow-outline" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border-2 border-blue-200 rounded px-3 py-2 w-64 focus:outline-none focus:border-blue-500 focus:shadow-outline" />
                <button type="submit" className="bg-white text-red-600 border-2 border-red-600 shadow-md font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ease-in-out hover:bg-red-600 hover:text-white hover:border-white">Login</button>
                {error && <div className="text-red-500">{error}</div>}
                <div>
                    Don't have an account? <Link to="/register" className="text-blue-700 font-bold hover:text-blue-900">Register</Link>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
