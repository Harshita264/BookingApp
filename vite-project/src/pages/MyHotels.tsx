import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { useAppContext } from "../contexts/AppContext";

const MyHotels = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const {
    data: hotelData,
    isLoading,
  } = useQuery("fetchMyHotels", apiClient.fetchMyHotels);

  const handleDelete = async (hotelId: string) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    try {
      await apiClient.deleteHotel(hotelId);

      showToast({
        message: "Hotel deleted successfully",
        type: "SUCCESS",
      });

      queryClient.invalidateQueries("fetchMyHotels");
    } catch (error) {
      showToast({
        message: "Failed to delete hotel",
        type: "ERROR",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <span className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Hotels</h1>

        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded"
        >
          Add Hotel
        </Link>
      </span>

      {/* EMPTY STATE */}
      {!hotelData || hotelData.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          You haven’t added any hotels yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {hotelData.map((hotel) => (
            <div
              key={hotel._id}
              className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
            >
              <h2 className="text-2xl font-bold">{hotel.name}</h2>

              <div className="whitespace-pre-line">
                {hotel.description}
              </div>

              <div className="grid grid-cols-5 gap-2">
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BsMap className="mr-1" />
                  {hotel.city}, {hotel.country}
                </div>

                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BsBuilding className="mr-1" />
                  {hotel.type}
                </div>

                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BiMoney className="mr-1" />
                  £{hotel.pricePerNight} per night
                </div>

                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BiHotel className="mr-1" />
                  {hotel.adultCount} adults, {hotel.childCount} children
                </div>

                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BiStar className="mr-1" />
                  {hotel.starRating} Star Rating
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3">
                <Link
                  to={`/detail/${hotel._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-500"
                >
                  View
                </Link>

                <Link
                  to={`/edit-hotel/${hotel._id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-500"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(hotel._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHotels;