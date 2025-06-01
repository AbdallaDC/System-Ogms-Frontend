"use client";
import { useFetch } from "@/hooks/useApi";
import { BookingListResponse } from "@/types/Booking";
import React from "react";
import BookingTable from "./components/BookinTable";
import { TableSkeleton } from "@/components/tabel-skeleton";

const Bookings = () => {
  const { data, error, isLoading } =
    useFetch<BookingListResponse>("/api/v1/bookings");

  if (isLoading)
    return (
      <TableSkeleton
        columns={5}
        rows={5}
        showActions={true}
        showFilter={true}
        showPagination={true}
      />
    );
  if (error) return <div>Error loading bookings</div>;
  return <BookingTable data={data?.bookings || []} />;
};

export default Bookings;
