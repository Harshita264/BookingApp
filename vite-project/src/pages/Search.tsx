import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  /* ---------- SYNC STATE FROM URL (ON LOAD) ---------- */
  useEffect(() => {
    setPage(Number(searchParams.get("page")) || 1);
    setSelectedPrice(
      searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined
    );
    setSortOption(searchParams.get("sortOption") || "");
    setSelectedStars(searchParams.getAll("stars"));
    setSelectedHotelTypes(searchParams.getAll("types"));
    setSelectedFacilities(searchParams.getAll("facilities"));
  }, []);

  /* ---------- BUILD SEARCH PARAMS ---------- */
  const queryParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  /* ---------- FETCH SEARCH RESULTS ---------- */
  const {
    data: hotelData,
    isLoading,
  } = useQuery(["searchHotels", queryParams], () =>
    apiClient.searchHotels(queryParams)
  );

  /* ---------- UPDATE URL WHEN FILTERS CHANGE ---------- */
  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", page.toString());
    selectedStars.forEach((star) => params.append("stars", star));
    selectedHotelTypes.forEach((type) => params.append("types", type));
    selectedFacilities.forEach((f) => params.append("facilities", f));
    if (selectedPrice) params.set("maxPrice", selectedPrice.toString());
    if (sortOption) params.set("sortOption", sortOption);

    navigate({ search: params.toString() }, { replace: true });
  }, [
    page,
    selectedStars,
    selectedHotelTypes,
    selectedFacilities,
    selectedPrice,
    sortOption,
  ]);

  /* ---------- HANDLERS ---------- */
  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedStars((prev) =>
      event.target.checked
        ? [...prev, value]
        : prev.filter((s) => s !== value)
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSelectedHotelTypes((prev) =>
      event.target.checked
        ? [...prev, value]
        : prev.filter((t) => t !== value)
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedFacilities((prev) =>
      event.target.checked
        ? [...prev, value]
        : prev.filter((f) => f !== value)
    );
  };

  /* ---------- LOADING STATE ---------- */
  if (isLoading) {
    return (
      <p className="text-center text-lg mt-10">
        Searching hotels...
      </p>
    );
  }

  /* ---------- EMPTY STATE ---------- */
  if (!hotelData || hotelData.data.length === 0) {
    return (
      <p className="text-center text-lg mt-10">
        No hotels found for your search.
      </p>
    );
  }

  /* ---------- RENDER ---------- */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      {/* FILTERS */}
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypeChange}
          />
          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>

      {/* RESULTS */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData.pagination.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">
              Price Per Night (low to high)
            </option>
            <option value="pricePerNightDesc">
              Price Per Night (high to low)
            </option>
          </select>
        </div>

        {hotelData.data.map((hotel) => (
          <SearchResultsCard key={hotel._id} hotel={hotel} />
        ))}

        <Pagination
          page={hotelData.pagination.page}
          pages={hotelData.pagination.pages}
          onPageChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
};

export default Search;
