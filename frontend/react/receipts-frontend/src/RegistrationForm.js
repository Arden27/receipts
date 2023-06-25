import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RegistrationForm({ onRegister }) {
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            let response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/dj-rest-auth/registration/`, { username, password1, password2 });
            // if registration was successful, log the user in
            response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/dj-rest-auth/login/`, { username, password: password1 });
            localStorage.setItem('token', response.data.key);
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
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password1} onChange={e => setPassword1(e.target.value)} placeholder="Password" />
            <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="Confirm Password" />
            <button type="submit">Register</button>
            {error && <div>{error}</div>}
            <div>
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </form>
    );
}

export default RegistrationForm;
