"use client";
import { useFetch } from "@/hooks/useApi";
import { AssignListResponse } from "@/types/Assign";
import AssignTable from "./components/AssignTable";

const Assignments = () => {
  const { data, error, isLoading } =
    useFetch<AssignListResponse>("/api/v1/assigns");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading bookings</div>;
  return <AssignTable data={data?.assigns || []} />;
};

export default Assignments;
