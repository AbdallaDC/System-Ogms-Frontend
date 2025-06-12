"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/useApi";
import type { AssignListResponse } from "@/types/Assign";
import type { BookingListResponse } from "@/types/Booking";
import { InventoryListResponse } from "@/types/Inventory";
import type {
  ServiceListResponse,
  ServiceReportResponse,
} from "@/types/Service";
import { TransactionResponse } from "@/types/Transaction";
import type { VehicleListResponse } from "@/types/Vehicle";
import { format } from "date-fns";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Package,
  TrendingUp,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { BookingStatusChart } from "./components/booking-status-chart";
import { ServiceReportCard } from "./components/service-report-card";
import { TransactionChart } from "./components/transaction-chart";
import { RatingSummaryCard } from "./components/rating-summary-card";

export default function AdminDashboard() {
  const { data: servicesData, isLoading: isLoadingServices } =
    useFetch<ServiceListResponse>("/api/v1/services");
  const { data: bookingsData, isLoading: isLoadingBookings } =
    useFetch<BookingListResponse>("/api/v1/bookings");
  const { data: assignsData, isLoading: isLoadingAssigns } =
    useFetch<AssignListResponse>("/api/v1/assigns");
  const { data: reportsData, isLoading: isLoadingReports } =
    useFetch<ServiceReportResponse>("/api/v1/services/get/report");
  const { data: inventoryData, isLoading: isLoadingInventory } =
    useFetch<InventoryListResponse>("/api/v1/inventory");
  const { data: paymentsData, isLoading: isLoadingTransactions } =
    useFetch<TransactionResponse>("/api/v1/payments");

  const isLoading =
    isLoadingServices ||
    isLoadingBookings ||
    isLoadingAssigns ||
    isLoadingReports ||
    isLoadingInventory ||
    isLoadingTransactions;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800 bg-amber-900 text-amber-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 bg-emerald-900 text-emerald-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 bg-blue-900 text-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 bg-red-900 text-red-200";
      default:
        return "bg-gray-100 text-gray-800 bg-gray-800 text-gray-200";
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
    assigned:
      bookingsData?.bookings.filter(
        (b) => b.status.toLowerCase() === "assigned"
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

  // Calculate total revenue from service reports
  const totalRevenue =
    reportsData?.report.reduce(
      (sum, service) => sum + (service.totalRevenue || 0),
      0
    ) || 0;

  // Calculate total completed bookings from service reports
  const totalCompletedBookings =
    reportsData?.report.reduce(
      (sum, service) => sum + (service.completedBookings || 0),
      0
    ) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Welcome back! Here's what's happening with your garage today.
            </p>
          </div>
          {/* <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button> */}
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Services */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wrench className="h-4 w-4" />
                </div>
                Total Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {servicesData?.count || 0}
              </div>
              <div className="flex items-center text-sm text-blue-100">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Available services</span>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Items */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100 flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Package className="h-4 w-4" />
                </div>
                Inventory Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {inventoryData?.result || 0}
              </div>
              <div className="flex items-center text-sm text-purple-100">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Available items</span>
              </div>
            </CardContent>
          </Card>

          {/* Pending Bookings */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-100 flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="h-4 w-4" />
                </div>
                Pending Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {bookingStatusCounts.pending}
              </div>
              <div className="text-sm text-amber-100">
                {totalBookings} total bookings
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          {/* Total Payments */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CreditCard className="h-4 w-4" />
                </div>
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                $
                {paymentsData?.transactions
                  ?.filter((t) => t.status.toLowerCase() === "paid")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString() || 0}
              </div>
              <div className="flex items-center text-sm text-emerald-100">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{paymentsData?.result || 0} transactions</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Summary */}
        <RatingSummaryCard />

        {/* Service Reports Section */}
        {reportsData?.report && reportsData.report.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 ">
                Service Performance
              </h2>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                View All Services
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reportsData.report.map((service, index) => (
                <ServiceReportCard key={index} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* Charts and Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* <div className=""> */}
          {/* Booking Status Chart */}
          <Card className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 ">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Booking Status Distribution
              </CardTitle>
              <CardDescription>Current status of all bookings</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <BookingStatusChart bookingStatusCounts={bookingStatusCounts} />
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r  from-emerald-900/20 to-green-900/20">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Revenue Trends
              </CardTitle>
              <CardDescription>Daily revenue performance</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* <RevenueChart /> */}
              <TransactionChart
                transactions={paymentsData?.transactions || []}
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings and Status Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Bookings */}
          <Card className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription>Latest service appointments</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="/bookings"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4  rounded-lg transition-colors duration-200 border "
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r  p-3 rounded-full">
                        <User className="h-5 w-5 text-blue-600 " />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 ">
                          {booking.user_id?.name}
                        </div>
                        {/* <div className="text-sm text-muted-foreground">
                          {booking.vehicle_id?.model}
                        </div> */}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 ">
                        {format(new Date(booking?.booking_date), "MMM d, yyyy")}
                      </div>
                      <Badge
                        variant={getStatusVariant(booking?.status)}
                        className={`${getStatusColor(booking?.status)} mt-1`}
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
          <Card className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Booking Status Overview
              </CardTitle>
              <CardDescription>
                Distribution of current bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      Pending
                    </span>
                    <span className="text-sm font-medium">
                      {bookingStatusCounts.pending}
                    </span>
                  </div>
                  <Progress
                    value={(bookingStatusCounts.pending / totalBookings) * 100}
                    className="h-3 bg-amber-100 "
                    // indicatorClassName="bg-gradient-to-r from-amber-500 to-amber-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      Completed
                    </span>
                    <span className="text-sm font-medium">
                      {bookingStatusCounts.completed}
                    </span>
                  </div>
                  <Progress
                    value={
                      (bookingStatusCounts.completed / totalBookings) * 100
                    }
                    className="h-3 bg-emerald-100 "
                    // indicatorClassName="bg-gradient-to-r from-emerald-500 to-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Cancelled
                    </span>
                    <span className="text-sm font-medium">
                      {bookingStatusCounts.cancelled}
                    </span>
                  </div>
                  <Progress
                    value={
                      (bookingStatusCounts.cancelled / totalBookings) * 100
                    }
                    className="h-3 bg-red-100 "
                    // indicatorClassName="bg-gradient-to-r from-red-500 to-red-600"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {bookingStatusCounts.pending}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Pending
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {bookingStatusCounts.completed}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
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
    </div>
  );
}
