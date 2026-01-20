import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
	const { user, isAuthenticated } = useAuth();

	if (!isAuthenticated || !user) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default ProtectedRoute;
