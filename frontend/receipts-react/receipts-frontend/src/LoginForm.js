import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const response = await axios.post(`/dj-rest-auth/login/`, { username, password });
            localStorage.setItem('token', response.data.key);
            onLogin();  // inform the parent component that the user has logged in
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
        </form>
    );
}

export default LoginForm;
