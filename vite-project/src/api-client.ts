const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://bookingapp-gqkh.onrender.com";


import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  HotelSearchResponse,
  HotelType,
} from "../../backend/src/shared/types";
import { BookingFormData} from "./forms/ManageHotelForm/BookingForm/BookingForm";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    throw new Error(message);
  }
);
/* =========================
   AUTH (FINAL, SIMPLE)
========================= */

export const validateToken = async () => {
  const response = await fetch(
    "http://localhost:7000/api/auth/validate-token",
    {
      credentials: "include",
    }
  );

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return response.json();
};


export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || "Registration failed");
  }

  return body;
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Invalid credentials");
  }

  return data;
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Sign out failed");
  }
};

export const logout = async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await axios.post("/my-hotels", hotelFormData);
  return response.data;
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await axios.get("/my-hotels");
  return response.data;
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const hotelId = hotelFormData.get("hotelId");
  const response = await axios.put(`/my-hotels/${hotelId}`, hotelFormData);
  return response.data;
};

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await axios.get("/hotels");
  return response.data.data;
};


export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await axios.get(`/hotels/${hotelId}`);
  return response.data;
};

export const deleteHotel = async (hotelId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete hotel");
  }
};


export type SearchParams = {
  destination?: string;
  page?: string;
};

export const searchHotels = async (
  searchParams: SearchParams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams(searchParams as any);

  const response = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const createRoomBooking = async (
  bookingData: BookingFormData
) => {
  await axios.post("/api/bookings", bookingData);
};