"use client";
import { useFetch } from "@/hooks/useApi";
import { VehicleListResponse } from "@/types/Vehicle";
import React from "react";
import VehicleTable from "./components/VehicleTable";

const Vehicles = () => {
  // Implement your vehicles page logic here
  const { data, error, isLoading } =
    useFetch<VehicleListResponse>("/api/v1/vehicles");
  console.log("data", data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading vehicles</div>;
  return <VehicleTable data={data?.vehicles || []} />;
};

export default Vehicles;
