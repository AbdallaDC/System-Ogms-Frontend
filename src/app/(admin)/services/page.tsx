// app/services/page.tsx
"use client";

import { useFetch } from "@/hooks/useApi";
import { ServiceListResponse } from "@/types/Service";
import { ServicesTable } from "./components/ServiceTable";
import { TableSkeleton } from "@/components/tabel-skeleton";

export default function ServicesPage() {
  const { data, error, isLoading } =
    useFetch<ServiceListResponse>("/api/v1/services");

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
  if (error) return <div>Error loading services</div>;

  return <ServicesTable data={data?.services || []} />;
}
