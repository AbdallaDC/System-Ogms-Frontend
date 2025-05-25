// app/services/page.tsx
"use client";

import { useFetch } from "@/hooks/useApi";
import { ServiceListResponse } from "@/types/Service";
import { ServicesTable } from "./components/ServiceTable";

export default function ServicesPage() {
  const { data, error, isLoading } =
    useFetch<ServiceListResponse>("/api/v1/services");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading services</div>;

  return <ServicesTable data={data?.services || []} />;
}
