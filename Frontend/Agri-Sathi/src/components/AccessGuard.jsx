import { Navigate } from "react-router-dom";

function AccessGuard({ children }) {
  const isBuyer = localStorage.getItem("isBuyer") === "true";

  if (isBuyer) {
    // If buyer tries to access a restricted page, block it
    return <Navigate to="/not-authorized" />;
  }

  // Otherwise, allow the route
  return children;
}

export default AccessGuard;
