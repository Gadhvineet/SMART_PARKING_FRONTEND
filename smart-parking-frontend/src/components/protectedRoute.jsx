import { Navigate } from "react-router-dom";

// Helper to manually decode JWT payload to check expiry
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    // exp is in seconds, Date.now() is in milliseconds
    if (exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch (error) {
    return true; // IF invalid token format, treat as expired
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if token doesn't exist or is expired
  if (!token || isTokenExpired(token)) {
    // Clean up invalid session data if it exists
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;