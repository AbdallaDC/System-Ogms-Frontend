"use client";
import { useFetch } from "@/hooks/useApi";
import { AssignListResponse } from "@/types/Assign";
import AssignTable from "./components/AssignTable";
import { TableSkeleton } from "@/components/tabel-skeleton";

const Assignments = () => {
  const { data, error, isLoading } =
    useFetch<AssignListResponse>("/api/v1/assigns");

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
  return <AssignTable data={data?.assigns || []} />;
};

export default Assignments;
