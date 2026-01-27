import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";

const Detail = () => {
  const { hotelId } = useParams();

  const {
    data: hotel,
    isLoading,
    isError,
  } = useQuery(
    ["hotel", hotelId],
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  /* loading */
  if (isLoading) {
    return <div className="text-center py-20">Loading hotel details...</div>;
  }

  /* error */
  if (isError || !hotel) {
    return (
      <div className="text-center py-20 text-gray-500">
        Hotel not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      {/* ⭐ Stars + Name */}
      <div>
        <div className="flex">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar key={index} className="fill-yellow-400" />
          ))}
        </div>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>

      {/* 🧾 INFO BAR (this was missing before) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border border-slate-300 rounded-lg p-4">
        <div className="flex flex-col items-center text-center gap-1">
          <span className="font-semibold">
            {hotel.city},
          </span>
          <span className="text-sm text-gray-600">
            {hotel.country}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">Type</span>
          <span className="text-sm">{hotel.type}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">Price</span>
          <span className="text-sm">
            £{hotel.pricePerNight} / night
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">Guests</span>
          <span className="text-sm">
            {hotel.adultCount} adults, {hotel.childCount} children
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">Rating</span>
          <span className="text-sm">
            {hotel.starRating} Star
          </span>
        </div>
      </div>

      {/* 🖼 Images */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image: string, index: number) => (
          <div key={index} className="h-[300px]">
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* 🏷 Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility: string, index: number) => (
          <div
            key={index}
            className="border border-slate-300 rounded-sm p-3"
          >
            {facility}
          </div>
        ))}
      </div>

      {/* 📝 Description */}
      <div className="whitespace-pre-line">
        {hotel.description}
      </div>
    </div>
  );
};

export default Detail;
