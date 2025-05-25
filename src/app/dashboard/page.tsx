"use client";
import React, { useEffect } from "react";
import { getUser } from "@/utils/getUser";
import { useRouter } from "next/navigation";
const DashboardPage = () => {
  const { user, token } = getUser();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
    }
  }, [user, token, router]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user?.name}</p>
    </div>
  );
};

export default DashboardPage;
