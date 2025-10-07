import { Navigate, useLocation } from "react-router-dom";
import authStore from "../store/authStore.js";

const ProtectedRoute = ({ children }) => {
  const { authUser } = authStore();
  const location = useLocation();

  if (!authUser) {
    // Save the original page the user wanted to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
