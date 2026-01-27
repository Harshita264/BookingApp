import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAppContext();

const handleLogout = async () => {
  await logout();
  navigate("/");
};


  return (
    <header className="bg-blue-700 text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          MernHolidays<span className="text-sm font-normal">.com</span>
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-6 text-sm font-semibold">
          {isLoggedIn && (
            <Link
              to="/my-hotels"
              className="hover:underline underline-offset-4"
            >
              My Hotels
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/sign-in"
              className="bg-white text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
