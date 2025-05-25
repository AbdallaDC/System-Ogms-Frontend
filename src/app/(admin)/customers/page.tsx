"use client";
import { useFetch } from "@/hooks/useApi";
import { UserListResponse } from "@/types/User";
import UserTable from "./components/UserTable";
const Customers = () => {
  const { data, error, isLoading } =
    useFetch<UserListResponse>("/api/v1/users");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading customers</div>;
  return <UserTable data={data?.users || []} />;
};

export default Customers;
