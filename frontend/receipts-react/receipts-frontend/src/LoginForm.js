import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setShouldRefresh } from './redux/store'; // Import setShouldRefresh
import { Link } from 'react-router-dom';

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const dispatch = useDispatch();

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const response = await axios.post(`/dj-rest-auth/login/`, { username, password });
            localStorage.setItem('token', response.data.key);
            onLogin();  // inform the parent component that the user has logged in
            dispatch(setShouldRefresh(true));
        } catch (error) {
            setError("Invalid username or password.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
            {error && <div>{error}</div>}
            <div>
                Don't have an account? <Link to="/register">Register</Link>
            </div>
        </form>
    );
}

export default LoginForm;
