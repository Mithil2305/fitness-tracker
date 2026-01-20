import { useAuthContext } from "../context/AuthContext";

const useAuth = () => {
  const { user } = useAuthContext();
  return { user, isAuthenticated: !!user };
};

export default useAuth;
