import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">Page not found</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
