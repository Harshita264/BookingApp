import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAppContext();
  const location = useLocation();

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
