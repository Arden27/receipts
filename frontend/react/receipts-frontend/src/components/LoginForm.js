import React, { useState } from "react";
import { loginUser } from "../api";
import { useDispatch } from "react-redux";
import { setShouldRefresh } from "../redux/store";
import { Link } from "react-router-dom";

function LoginForm({ onLogin }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const dispatch = useDispatch();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await loginUser(username, password);
			localStorage.setItem("token", response.key);
			onLogin();
			dispatch(setShouldRefresh(true));
		} catch (error) {
			setError("Invalid username or password.");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-400">
			<form onSubmit={handleSubmit} className="flex min-h-screen flex-col items-center justify-center space-y-4">
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="focus:shadow-outline w-64 rounded border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none" />
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="focus:shadow-outline w-64 rounded border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none" />
				<button type="submit" className="focus:shadow-outline rounded border-2 border-red-600 bg-white px-4 py-2 font-bold text-red-600 shadow-md transition-colors duration-200 ease-in-out hover:border-white hover:bg-red-600 hover:text-white focus:outline-none">
					Login
				</button>
				{error && <div className="text-red-500">{error}</div>}
				<div>
					Don't have an account?{" "}
					<Link to="/register" className="font-bold text-blue-700 hover:text-blue-900">
						Register
					</Link>
				</div>
			</form>
		</div>
	);
}

export default LoginForm;
