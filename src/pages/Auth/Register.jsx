import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loadingRegister, setLoadingRegister] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");

		try {
			// basic client-side validation
			if (!email) {
				setError("Please enter an email address.");
				setLoadingRegister(false);
				return;
			}
			if (!password || password.length < 6) {
				setError("Password must be at least 6 characters.");
				setLoadingRegister(false);
				return;
			}

			await createUserWithEmailAndPassword(auth, email, password);
			navigate("/dashboard");
		} catch (err) {
			// show the actual Firebase error message to help debug 400 responses
			console.error("Register error:", err);
			setError(err?.message || "Failed to create account");
		} finally {
			setLoadingRegister(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<form
				onSubmit={handleRegister}
				className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
			>
				<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

				{error && <p className="text-red-500 text-sm mb-4">{error}</p>}

				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full mb-4 border px-3 py-2 rounded"
				/>

				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full mb-4 border px-3 py-2 rounded"
				/>

				<button
					type="submit"
					disabled={loadingRegister}
					className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
				>
					{loadingRegister ? "Creating..." : "Create Account"}
				</button>

				<p className="text-sm mt-4 text-center">
					Already have an account?{" "}
					<Link to="/" className="text-green-600">
						Login
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Register;
