"use client";
import { useFetch } from "@/hooks/useApi";
import { BookingListResponse } from "@/types/Booking";
import React from "react";
import BookingTable from "./components/BookinTable";

const Bookings = () => {
  const { data, error, isLoading } =
    useFetch<BookingListResponse>("/api/v1/bookings");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading bookings</div>;
  return <BookingTable data={data?.bookings || []} />;
};

export default Bookings;
