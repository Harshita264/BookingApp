import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-sm">
        {/* LEFT */}
        <span className="font-semibold">
            MernHolidays.com
        </span>

        {/* RIGHT */}
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
