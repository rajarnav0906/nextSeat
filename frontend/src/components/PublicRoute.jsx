import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user-info"));
  const location = useLocation();

  // Only block access to login/signup if user is already logged in
  if (user && (location.pathname === "/login" || location.pathname === "/signup")) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicRoute;
