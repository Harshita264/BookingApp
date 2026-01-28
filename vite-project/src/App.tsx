import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

// Protected pages
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import "react-datepicker/dist/react-datepicker.css";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:hotelId" element={<Detail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<SignIn />} />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/add-hotel" element={<AddHotel />} />
          <Route path="/my-hotels" element={<MyHotels />} />
          <Route path="/edit-hotel/:hotelId" element={<EditHotel />} />
          <Route path="/hotel/:hotelId/booking" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
