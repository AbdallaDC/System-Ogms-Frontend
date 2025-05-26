"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetch } from "@/hooks/useApi";
import { ServiceListResponse } from "@/types/Service";
import { VehicleListResponse } from "@/types/Vehicle";
import { BookingListResponse } from "@/types/Booking";
import { AssignListResponse } from "@/types/Assign";
import { Wrench, Car, Calendar, ClipboardList, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: servicesData, isLoading: isLoadingServices } =
    useFetch<ServiceListResponse>("/api/v1/services");
  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    useFetch<VehicleListResponse>("/api/v1/vehicles");
  const { data: bookingsData, isLoading: isLoadingBookings } =
    useFetch<BookingListResponse>("/api/v1/bookings");
  const { data: assignsData, isLoading: isLoadingAssigns } =
    useFetch<AssignListResponse>("/api/v1/assigns");

  const isLoading =
    isLoadingServices ||
    isLoadingVehicles ||
    isLoadingBookings ||
    isLoadingAssigns;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-500" />
              Total Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesData?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Available services</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Car className="h-4 w-4 text-green-500" />
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehiclesData?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Registered vehicles</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              Pending Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookingsData?.bookings.filter(
                (b) => b.status.toLowerCase() === "pending"
              ).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting service</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-purple-500" />
              Assigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignsData?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Overview of the latest garage bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 border-b p-3 font-medium bg-muted/50">
                <div>Customer</div>
                <div>Vehicle</div>
                <div>Service</div>
                <div>Date</div>
                <div>Status</div>
              </div>
              <div className="divide-y">
                {bookingsData?.bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking._id}
                    className="grid grid-cols-5 p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium">{booking.user_id.name}</div>
                    <div>{`${booking.vehicle_id.make} ${booking.vehicle_id.model}`}</div>
                    <div>{booking.service_id.service_name}</div>
                    <div>
                      {format(new Date(booking.booking_date), "MMM d, yyyy")}
                    </div>
                    <div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
