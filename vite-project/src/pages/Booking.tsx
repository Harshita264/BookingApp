import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import * as apiClient from "../api-client";
import { useSearchContext } from "../contexts/SearchContext";
import { useAppContext } from "../contexts/AppContext";

import BookingDetailsSummary from "../components/BookingDetailsSummary";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
);

const Booking = () => {
  const { hotelId } = useParams();
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();

  const [numberOfNights, setNumberOfNights] = useState(0);

  /* ---------- CALCULATE NIGHTS ---------- */
  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        (search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.max(1, Math.ceil(nights)));
    }
  }, [search.checkIn, search.checkOut]);

  /* ---------- FETCH HOTEL ---------- */
  const {
    data: hotel,
    isLoading,
  } = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId as string),
    { enabled: !!hotelId }
  );

  /* ---------- UX GUARDS ---------- */
  if (!isLoggedIn) {
    return (
      <p className="text-center text-lg mt-10">
        Please sign in to book this hotel.
      </p>
    );
  }

  if (!search.checkIn || !search.checkOut) {
    return (
      <p className="text-center text-lg mt-10">
        Please select check-in and check-out dates to continue booking.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-center mt-10">Loading hotel...</p>;
  }

  if (!hotel) {
    return <p className="text-center mt-10">Hotel not found.</p>;
  }

  /* ---------- RENDER ---------- */
  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-8 mt-8">
      <BookingDetailsSummary
        hotel={hotel}
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
      />

      <Elements stripe={stripePromise}>
        <div>Booking feature coming soon</div>
      </Elements>
    </div>
  );
};

export default Booking;