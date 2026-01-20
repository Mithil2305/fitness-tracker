import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
			<h1 className="text-xl font-bold">FitTrack</h1>

			<div className="space-x-4">
				<Link to="/dashboard" className="hover:text-green-400">
					Dashboard
				</Link>
				<Link to="/diet" className="hover:text-green-400">
					Diet
				</Link>
				<Link to="/workouts" className="hover:text-green-400">
					Workouts
				</Link>
				<Link to="/goals" className="hover:text-green-400">
					Goals
				</Link>
				<Link to="/profile" className="hover:text-green-400">
					Profile
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
