import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import {
	Mail,
	Lock,
	UserPlus,
	Activity,
	ArrowRight,
	AlertCircle,
	User,
} from "lucide-react";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			if (!email || !password || !name) {
				throw new Error("All fields are required.");
			}
			if (password.length < 6) {
				throw new Error("Password must be at least 6 characters.");
			}

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);

			// Update display name
			await updateProfile(userCredential.user, {
				displayName: name,
			});

			navigate("/dashboard");
		} catch (err) {
			console.error("Register error:", err);
			// Clean up firebase error messages
			const msg = err.message
				.replace("Firebase: ", "")
				.replace("auth/", "")
				.replace(/-/g, " ");
			setError(msg.charAt(0).toUpperCase() + msg.slice(1));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
			{/* Background Decorative Elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
				<div className="absolute top-[10%] -left-[10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-3xl" />
				<div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-3xl" />
			</div>

			<div className="w-full max-w-md p-6 z-10 animate-fade-in-up">
				{/* Brand Logo */}
				<div className="flex justify-center mb-8">
					<div className="flex items-center gap-2">
						<div className="bg-slate-900 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20">
							<Activity size={28} strokeWidth={2.5} />
						</div>
						<span className="text-2xl font-extrabold text-slate-900 tracking-tight">
							FitTrack
						</span>
					</div>
				</div>

				<div className="bento-card bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-2xl shadow-slate-200/50">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold text-slate-800">
							Create Account
						</h2>
						<p className="text-slate-500 mt-2 text-sm">
							Join us and start crushing your goals
						</p>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-pulse">
							<AlertCircle size={18} />
							{error}
						</div>
					)}

					<form onSubmit={handleRegister} className="space-y-5">
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
								Full Name
							</label>
							<div className="relative group">
								<User
									className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
									size={20}
								/>
								<input
									type="text"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
									required
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
								Email
							</label>
							<div className="relative group">
								<Mail
									className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
									size={20}
								/>
								<input
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
									required
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
								Password
							</label>
							<div className="relative group">
								<Lock
									className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
									size={20}
								/>
								<input
									type="password"
									placeholder="Min 6 characters"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
									required
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{loading ? (
								"Creating Account..."
							) : (
								<>
									Sign Up <ArrowRight size={20} />
								</>
							)}
						</button>
					</form>

					<div className="mt-8 text-center">
						<p className="text-slate-500 text-sm">
							Already have an account?{" "}
							<Link
								to="/"
								className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-all"
							>
								Login here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
