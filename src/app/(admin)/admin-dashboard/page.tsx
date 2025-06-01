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
import {
  Wrench,
  Car,
  Calendar,
  ClipboardList,
  ArrowRight,
  User,
  TrendingUp,
  ChevronRight,
  Plane,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "in progress":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const bookingStatusCounts = {
    pending:
      bookingsData?.bookings.filter((b) => b.status.toLowerCase() === "pending")
        .length || 0,
    inProgress:
      bookingsData?.bookings.filter(
        (b) => b.status.toLowerCase() === "in progress"
      ).length || 0,
    completed:
      bookingsData?.bookings.filter(
        (b) => b.status.toLowerCase() === "completed"
      ).length || 0,
    cancelled:
      bookingsData?.bookings.filter(
        (b) => b.status.toLowerCase() === "cancelled"
      ).length || 0,
  };

  const totalBookings = bookingsData?.bookings.length || 0;

  const recentBookings =
    bookingsData?.bookings
      .sort(
        (a, b) =>
          new Date(b.booking_date).getTime() -
          new Date(a.booking_date).getTime()
      )
      .slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-3 w-4/5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your garage management system
          </p>
        </div>
        {/* <Button variant="outline">
          View Reports <ArrowRight className="ml-2 h-4 w-4" />
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-500" />
              Total Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{servicesData?.count || 0}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span>Availabe services</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Car className="h-4 w-4 text-green-500" />
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{vehiclesData?.count || 0}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span>Available vehicles</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              Pending Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {bookingStatusCounts.pending}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {totalBookings} total bookings
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-purple-500" />
              Assigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assignsData?.count || 0}</div>
            <div className="text-sm text-muted-foreground mt-1">
              technicians assigned
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest service appointments</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={Plane}
                iconPlacement="right"
                effect={"expandIcon"}
              >
                <Link href="/bookings">View all</Link>
                {/* <ChevronRight className="ml-1 h-4 w-4" /> */}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">{booking.user_id?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {`${booking.vehicle_id?.make} ${booking.vehicle_id?.model}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {format(new Date(booking?.booking_date), "MMM d, yyyy")}
                    </div>
                    <Badge
                      variant={getStatusVariant(booking?.status)}
                      className={getStatusColor(booking?.status)}
                    >
                      {booking?.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Distribution of current bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm font-medium">
                    {bookingStatusCounts.pending}
                  </span>
                </div>
                <Progress
                  value={(bookingStatusCounts.pending / totalBookings) * 100}
                  className="h-2 bg-orange-100 dark:bg-orange-900/50"
                  // indicatorClassName="bg-orange-500"
                />
              </div>

              {/* <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">In Progress</span>
                  <span className="text-sm font-medium">
                    {bookingStatusCounts.inProgress}
                  </span>
                </div>
                <Progress
                  value={(bookingStatusCounts.inProgress / totalBookings) * 100}
                  className="h-2 bg-blue-100 dark:bg-blue-900/50"
                  indicatorClassName="bg-blue-500"
                />
              </div> */}

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm font-medium">
                    {bookingStatusCounts.completed}
                  </span>
                </div>
                <Progress
                  value={(bookingStatusCounts.completed / totalBookings) * 100}
                  className="h-2 bg-green-100 dark:bg-green-900/50"
                  // indicatorClassName="bg-green-500"
                />
              </div>

              {/* <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Cancelled</span>
                  <span className="text-sm font-medium">
                    {bookingStatusCounts.cancelled}
                  </span>
                </div>
                <Progress
                  value={(bookingStatusCounts.cancelled / totalBookings) * 100}
                  className="h-2 bg-red-100 dark:bg-red-900/50"
                  indicatorClassName="bg-red-500"
                />
              </div> */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Cancelled</span>
                  <span className="text-sm font-medium">
                    {bookingStatusCounts.cancelled}
                  </span>
                </div>
                <Progress
                  value={(bookingStatusCounts.cancelled / totalBookings) * 100}
                  className="h-2 bg-red-100 dark:bg-red-900/50"
                  // indicatorClassName="bg-blue-500"
                />
              </div>

              <div className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {bookingStatusCounts.pending}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {bookingStatusCounts.completed}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {bookingStatusCounts.cancelled}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cancelled
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
