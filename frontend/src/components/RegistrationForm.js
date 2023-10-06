import React, { useState } from "react";
import { registerUser, loginUser } from "../api";
import { Link } from "react-router-dom";

function RegistrationForm({ onRegister }) {
	const [username, setUsername] = useState("");
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");
	const [error, setError] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await registerUser(username, password1, password2);
			const response = await loginUser(username, password1);
			localStorage.setItem("token", response.key);
			onRegister(); // inform the parent component that the user has registered
		} catch (error) {
			if (error.response) {
				if (error.response.data.non_field_errors) {
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
		<div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-200">
			<form onSubmit={handleSubmit} className="flex min-h-screen flex-col items-center justify-center space-y-4">
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="focus:shadow-outline w-64 rounded border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none" />
				<input type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} placeholder="Password" className="focus:shadow-outline w-64 rounded border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none" />
				<input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Confirm Password" className="focus:shadow-outline w-64 rounded border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none" />
				<button type="submit" className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
					Register
				</button>
				{error && <div className="text-red-500">{error}</div>}
				<div>
					Already have an account?{" "}
					<Link to="/login" className="font-bold text-blue-700 hover:text-blue-900">
						Login
					</Link>
				</div>
			</form>
		</div>
	);
}

export default RegistrationForm;
