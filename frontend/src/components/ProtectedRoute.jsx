import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, checkVerifiedOnly = false }) => {
  const user = JSON.parse(localStorage.getItem("user-info"));

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user.isVerified) return <Navigate to="/verify-email-notice" />;
  if (!checkVerifiedOnly && (!user.declaredGender || !user.branch)) {
    return <Navigate to="/upload-id" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
