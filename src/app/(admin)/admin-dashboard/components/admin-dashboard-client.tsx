"use client";

import { useRouter } from "next/navigation";
import { BookingStatusChart } from "./booking-status-chart";
import { ServiceReportCard } from "./service-report-card";
import { TransactionChart } from "./transaction-chart";
import { RatingSummaryCard } from "./rating-summary-card";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFetch } from "@/hooks/useApi";
import { ServiceReportResponse } from "@/types/Service";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentBookingTable } from "./recent-booking-table";
import { BookingStatusOverview } from "./booking-status-overview";
import { TotalServicesCard } from "./total-services-card";
import { InventoryItemsCard } from "./inventory-items-card";
import { PendingBookingsCard } from "./pending-bookings-card";
import { TotalRevenueCard } from "./total-revenue-card";

export function AdminDashboardClient() {
  const router = useRouter();
  const { data: reportsData, isLoading: isLoadingReports } =
    useFetch<ServiceReportResponse>("/api/v1/services/get/report");

  return (
    <div className="min-h-screen max-w-7xl bg-gradient-to-br from-slate-50 to-blue-50 p-6">
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
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <TotalServicesCard />
          <InventoryItemsCard />
          <PendingBookingsCard />
          <TotalRevenueCard />
        </div>

        {/* Rating Summary */}
        <RatingSummaryCard />

        {/* Service Reports Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 ">
              Service Performance
            </h2>
            <Button
              onClick={() => router.push("/services")}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              View All Services
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="space-y-4 p-2">
                {isLoadingReports ? (
                  <Skeleton className="w-full h-64" />
                ) : (
                  reportsData?.report.map((service, index) => (
                    <CarouselItem
                      key={index}
                      className="sm:basis-1/2 lg:basis-1/3"
                    >
                      <ServiceReportCard service={service} />
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious className="ml-4 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer" />
              <CarouselNext className="mr-4 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer" />
            </Carousel>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
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
              <BookingStatusChart />
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
              <TransactionChart />
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
              <RecentBookingTable />
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
              <BookingStatusOverview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
