"use client";
import { TableSkeleton } from "@/components/tabel-skeleton";
import { useFetch } from "@/hooks/useApi";
import { InventoryListResponse } from "@/types/Inventory";
import React from "react";
import { InventoryTable } from "./components/inventory-table";

const InventoryPage = () => {
  const { data, error, isLoading } =
    useFetch<InventoryListResponse>("/api/v1/inventory");
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

  return <InventoryTable data={data?.items || []} />;
};

export default InventoryPage;
