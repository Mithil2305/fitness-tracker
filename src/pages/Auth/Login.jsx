import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import {
	Mail,
	Lock,
	LogIn,
	Activity,
	ArrowRight,
	AlertCircle,
} from "lucide-react";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate("/dashboard");
		} catch (err) {
			setError("Invalid email or password. Please try again.", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
			{/* Background Decorative Elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
				<div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-3xl" />
				<div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl" />
			</div>

			<div className="w-full max-w-md p-6 z-10 animate-fade-in-up">
				{/* Brand Logo */}
				<div className="flex justify-center mb-8">
					<div className="flex items-center gap-2">
						<div className="bg-slate-900 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
							<Activity size={28} strokeWidth={2.5} />
						</div>
						<span className="text-2xl font-extrabold text-slate-900 tracking-tight">
							FitTrack
						</span>
					</div>
				</div>

				<div className="bento-card bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-2xl shadow-slate-200/50">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
						<p className="text-slate-500 mt-2 text-sm">
							Sign in to continue your fitness journey
						</p>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-pulse">
							<AlertCircle size={18} />
							{error}
						</div>
					)}

					<form onSubmit={handleLogin} className="space-y-5">
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
								Email
							</label>
							<div className="relative group">
								<Mail
									className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
									size={20}
								/>
								<input
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
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
									className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
									size={20}
								/>
								<input
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
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
								"Signing In..."
							) : (
								<>
									Login <ArrowRight size={20} />
								</>
							)}
						</button>
					</form>

					<div className="mt-8 text-center">
						<p className="text-slate-500 text-sm">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
							>
								Create one now
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
