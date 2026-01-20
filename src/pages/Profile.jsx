import Navbar from "../components/common/Navbar";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import useAuth from "../hooks/useAuth";

const Profile = () => {
	const { user } = useAuth();

	const handleLogout = async () => {
		await signOut(auth);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">Profile</h1>

				<p className="mb-4">
					<strong>Email:</strong> {user?.email}
				</p>

				<button
					onClick={handleLogout}
					className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Profile;
