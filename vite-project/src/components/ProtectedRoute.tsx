import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAppContext();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
