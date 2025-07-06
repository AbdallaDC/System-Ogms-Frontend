import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { AssignListResponse } from "@/types/Assign";
import { BookingListResponse } from "@/types/Booking";
import { InventoryListResponse } from "@/types/Inventory";
import { ServiceListResponse, ServiceReportResponse } from "@/types/Service";
import { TransactionResponse } from "@/types/Transaction";

export interface DashboardData {
  servicesData: ServiceListResponse;
  bookingsData: BookingListResponse;
  assignsData: AssignListResponse;
  reportsData: ServiceReportResponse;
  inventoryData: InventoryListResponse;
  paymentsData: TransactionResponse;
}

export async function getDashboardData(): Promise<DashboardData> {
  const endpoints = [
    "/api/v1/services",
    "/api/v1/bookings",
    "/api/v1/assigns",
    "/api/v1/services/get/report",
    "/api/v1/inventory",
    "/api/v1/payments",
  ];

  const [
    servicesData,
    bookingsData,
    assignsData,
    reportsData,
    inventoryData,
    paymentsData,
  ] = await Promise.all(
    endpoints.map((endpoint) =>
      axios
        .get(`${API_BASE_URL}${endpoint}`)
        .then((res) => res.data)
        .catch((err) => console.log(err))
    )
  );

  return {
    servicesData,
    bookingsData,
    assignsData,
    reportsData,
    inventoryData,
    paymentsData,
  };
}
