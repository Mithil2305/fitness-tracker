import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

/* Pages */
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Diet from "./pages/Diet";
import Workouts from "./pages/Workouts";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";

const App = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Protected Routes */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/diet"
						element={
							<ProtectedRoute>
								<Diet />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/workouts"
						element={
							<ProtectedRoute>
								<Workouts />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/goals"
						element={
							<ProtectedRoute>
								<Goals />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>

					{/* Fallback */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
};

export default App;
