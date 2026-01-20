import Navbar from "../components/common/Navbar";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import useAuth from "../hooks/useAuth";
import { User, Mail, LogOut, Shield, Settings } from "lucide-react";

const Profile = () => {
	const { user } = useAuth();

	const handleLogout = async () => {
		await signOut(auth);
	};

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900">
			<Navbar />

			<main className="max-w-3xl mx-auto p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
				<div className="bento-card w-full p-8 md:p-10 animate-fade-in-up">
					<div className="flex flex-col items-center text-center mb-10">
						<div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl mb-4">
							<span className="text-4xl font-bold">
								{user?.email?.[0]?.toUpperCase() || "U"}
							</span>
						</div>
						<h1 className="text-2xl font-bold text-slate-800">
							{user?.displayName || "Fitness Enthusiast"}
						</h1>
						<p className="text-slate-500 flex items-center gap-1.5 mt-1">
							<Mail size={14} /> {user?.email}
						</p>
						<span className="mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
							Free Plan
						</span>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
							<div className="flex items-center gap-3 text-slate-700">
								<Shield size={20} className="text-blue-500" />
								<span className="font-medium">Account Security</span>
							</div>
							<button className="text-sm text-blue-600 font-semibold hover:underline">
								Manage
							</button>
						</div>

						<div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
							<div className="flex items-center gap-3 text-slate-700">
								<Settings size={20} className="text-slate-500" />
								<span className="font-medium">App Settings</span>
							</div>
							<span className="text-slate-400 text-sm">v1.0.0</span>
						</div>
					</div>

					<div className="mt-10 pt-6 border-t border-slate-100">
						<button
							onClick={handleLogout}
							className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors"
						>
							<LogOut size={20} /> Sign Out
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Profile;
