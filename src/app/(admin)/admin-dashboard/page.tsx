// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useFetch } from "@/hooks/useApi";
// import { ServiceListResponse, ServiceReportResponse } from "@/types/Service";
// import { VehicleListResponse } from "@/types/Vehicle";
// import { BookingListResponse } from "@/types/Booking";
// import { AssignListResponse } from "@/types/Assign";
// import {
//   Wrench,
//   Car,
//   Calendar,
//   ClipboardList,
//   ArrowRight,
//   User,
//   TrendingUp,
//   ChevronRight,
//   Plane,
// } from "lucide-react";
// import { format } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function AdminDashboard() {
//   const { data: servicesData, isLoading: isLoadingServices } =
//     useFetch<ServiceListResponse>("/api/v1/services");
//   const { data: vehiclesData, isLoading: isLoadingVehicles } =
//     useFetch<VehicleListResponse>("/api/v1/vehicles");
//   const { data: bookingsData, isLoading: isLoadingBookings } =
//     useFetch<BookingListResponse>("/api/v1/bookings");
//   const { data: assignsData, isLoading: isLoadingAssigns } =
//     useFetch<AssignListResponse>("/api/v1/assigns");

//   const { data: reportsData, isLoading: isLoadingReports } =
//     useFetch<ServiceReportResponse>("/api/v1/services/get/report");

//   const isLoading =
//     isLoadingServices ||
//     isLoadingVehicles ||
//     isLoadingBookings ||
//     isLoadingAssigns;

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 bg-yellow-900 text-yellow-200";
//       case "completed":
//         return "bg-green-100 text-green-800 bg-green-900 text-green-200";
//       case "in progress":
//         return "bg-blue-100 text-blue-800 bg-blue-900 text-blue-200";
//       case "cancelled":
//         return "bg-red-100 text-red-800 bg-red-900 text-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 bg-gray-800 text-gray-200";
//     }
//   };

//   const getStatusVariant = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "pending":
//         return "warning";
//       case "completed":
//         return "success";
//       case "in progress":
//         return "default";
//       case "cancelled":
//         return "destructive";
//       default:
//         return "outline";
//     }
//   };

//   const bookingStatusCounts = {
//     pending:
//       bookingsData?.bookings.filter((b) => b.status.toLowerCase() === "pending")
//         .length || 0,
//     inProgress:
//       bookingsData?.bookings.filter(
//         (b) => b.status.toLowerCase() === "in progress"
//       ).length || 0,
//     completed:
//       bookingsData?.bookings.filter(
//         (b) => b.status.toLowerCase() === "completed"
//       ).length || 0,
//     cancelled:
//       bookingsData?.bookings.filter(
//         (b) => b.status.toLowerCase() === "cancelled"
//       ).length || 0,
//   };

//   const totalBookings = bookingsData?.bookings.length || 0;

//   const recentBookings =
//     bookingsData?.bookings
//       .sort(
//         (a, b) =>
//           new Date(b.booking_date).getTime() -
//           new Date(a.booking_date).getTime()
//       )
//       .slice(0, 5) || [];

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <Skeleton className="h-8 w-48" />
//           <Skeleton className="h-10 w-32" />
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {[1, 2, 3, 4].map((i) => (
//             <Card key={i} className="animate-pulse">
//               <CardHeader className="pb-4">
//                 <Skeleton className="h-6 w-32" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-10 w-16 mb-2" />
//                 <Skeleton className="h-4 w-40" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <div className="grid gap-4 md:grid-cols-2">
//           <Card>
//             <CardHeader>
//               <Skeleton className="h-6 w-48" />
//               <Skeleton className="h-4 w-64" />
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div key={i} className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <Skeleton className="h-10 w-10 rounded-full" />
//                       <div>
//                         <Skeleton className="h-4 w-24 mb-2" />
//                         <Skeleton className="h-3 w-32" />
//                       </div>
//                     </div>
//                     <Skeleton className="h-6 w-16" />
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <Skeleton className="h-6 w-48" />
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-6">
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <Skeleton className="h-4 w-24" />
//                     <Skeleton className="h-4 w-8" />
//                   </div>
//                   <Skeleton className="h-3 w-full" />
//                 </div>
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <Skeleton className="h-4 w-24" />
//                     <Skeleton className="h-4 w-8" />
//                   </div>
//                   <Skeleton className="h-3 w-4/5" />
//                 </div>
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <Skeleton className="h-4 w-24" />
//                     <Skeleton className="h-4 w-8" />
//                   </div>
//                   <Skeleton className="h-3 w-3/5" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//           <p className="text-muted-foreground mt-2">
//             Overview of your garage management system
//           </p>
//         </div>
//         {/* <Button variant="outline">
//           View Reports <ArrowRight className="ml-2 h-4 w-4" />
//         </Button> */}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="border-l-4 border-blue-500">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-sm font-medium flex items-center gap-2">
//               <Wrench className="h-4 w-4 text-blue-500" />
//               Total Services
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">{servicesData?.count || 0}</div>
//             <div className="flex items-center text-sm text-muted-foreground mt-1">
//               <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//               <span>Availabe services</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-l-4 border-green-500">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-sm font-medium flex items-center gap-2">
//               <Car className="h-4 w-4 text-green-500" />
//               Active Vehicles
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">{vehiclesData?.count || 0}</div>
//             <div className="flex items-center text-sm text-muted-foreground mt-1">
//               <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//               <span>Available vehicles</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-l-4 border-orange-500">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-sm font-medium flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-orange-500" />
//               Pending Bookings
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">
//               {bookingStatusCounts.pending}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">
//               {totalBookings} total bookings
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-l-4 border-purple-500">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-sm font-medium flex items-center gap-2">
//               <ClipboardList className="h-4 w-4 text-purple-500" />
//               Assigned Tasks
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">{assignsData?.count || 0}</div>
//             <div className="text-sm text-muted-foreground mt-1">
//               technicians assigned
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2">
//         {/* Recent Bookings */}
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <div>
//                 <CardTitle>Recent Bookings</CardTitle>
//                 <CardDescription>Latest service appointments</CardDescription>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 icon={Plane}
//                 iconPlacement="right"
//                 effect={"expandIcon"}
//               >
//                 <Link href="/bookings">View all</Link>
//                 {/* <ChevronRight className="ml-1 h-4 w-4" /> */}
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentBookings.map((booking) => (
//                 <div
//                   key={booking._id}
//                   className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="bg-blue-100 bg-blue-900/50 p-2 rounded-full">
//                       <User className="h-5 w-5 text-blue-600 text-blue-400" />
//                     </div>
//                     <div>
//                       <div className="font-medium">{booking.user_id?.name}</div>
//                       <div className="text-sm text-muted-foreground">
//                         {`${booking.vehicle_id?.model}`}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-medium">
//                       {format(new Date(booking?.booking_date), "MMM d, yyyy")}
//                     </div>
//                     <Badge
//                       variant={getStatusVariant(booking?.status)}
//                       className={getStatusColor(booking?.status)}
//                     >
//                       {booking?.status}
//                     </Badge>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Booking Status Overview */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Booking Status</CardTitle>
//             <CardDescription>Distribution of current bookings</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium">Pending</span>
//                   <span className="text-sm font-medium">
//                     {bookingStatusCounts.pending}
//                   </span>
//                 </div>
//                 <Progress
//                   value={(bookingStatusCounts.pending / totalBookings) * 100}
//                   className="h-2 bg-orange-100 bg-orange-900/50"
//                   // indicatorClassName="bg-orange-500"
//                 />
//               </div>

//               {/* <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium">In Progress</span>
//                   <span className="text-sm font-medium">
//                     {bookingStatusCounts.inProgress}
//                   </span>
//                 </div>
//                 <Progress
//                   value={(bookingStatusCounts.inProgress / totalBookings) * 100}
//                   className="h-2 bg-blue-100 bg-blue-900/50"
//                   indicatorClassName="bg-blue-500"
//                 />
//               </div> */}

//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium">Completed</span>
//                   <span className="text-sm font-medium">
//                     {bookingStatusCounts.completed}
//                   </span>
//                 </div>
//                 <Progress
//                   value={(bookingStatusCounts.completed / totalBookings) * 100}
//                   className="h-2 bg-green-100 bg-green-900/50"
//                   // indicatorClassName="bg-green-500"
//                 />
//               </div>

//               {/* <div className="flex items-center space-x-2">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm font-medium">Cancelled</span>
//                   <span className="text-sm font-medium">
//                     {bookingStatusCounts.cancelled}
//                   </span>
//                 </div>
//                 <Progress
//                   value={(bookingStatusCounts.cancelled / totalBookings) * 100}
//                   className="h-2 bg-red-100 bg-red-900/50"
//                   indicatorClassName="bg-red-500"
//                 />
//               </div> */}
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium">Cancelled</span>
//                   <span className="text-sm font-medium">
//                     {bookingStatusCounts.cancelled}
//                   </span>
//                 </div>
//                 <Progress
//                   value={(bookingStatusCounts.cancelled / totalBookings) * 100}
//                   className="h-2 bg-red-100 bg-red-900/50"
//                   // indicatorClassName="bg-blue-500"
//                 />
//               </div>

//               <div className="pt-4">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold">
//                       {bookingStatusCounts.pending}
//                     </div>
//                     <div className="text-sm text-muted-foreground">Pending</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold">
//                       {bookingStatusCounts.completed}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       Completed
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold">
//                       {bookingStatusCounts.cancelled}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       Cancelled
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetch } from "@/hooks/useApi";
import type {
  ServiceListResponse,
  ServiceReportResponse,
} from "@/types/Service";
import type { VehicleListResponse } from "@/types/Vehicle";
import type { BookingListResponse } from "@/types/Booking";
import type { AssignListResponse } from "@/types/Assign";
import {
  Wrench,
  Car,
  Calendar,
  ArrowRight,
  User,
  TrendingUp,
  ChevronRight,
  DollarSign,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ServiceReportCard } from "./components/service-report-card";
import { BookingStatusChart } from "./components/booking-status-chart";
import { RevenueChart } from "./components/revenue-chart";

export default function AdminDashboard() {
  const { data: servicesData, isLoading: isLoadingServices } =
    useFetch<ServiceListResponse>("/api/v1/services");
  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    useFetch<VehicleListResponse>("/api/v1/vehicles");
  const { data: bookingsData, isLoading: isLoadingBookings } =
    useFetch<BookingListResponse>("/api/v1/bookings");
  const { data: assignsData, isLoading: isLoadingAssigns } =
    useFetch<AssignListResponse>("/api/v1/assigns");
  const { data: reportsData, isLoading: isLoadingReports } =
    useFetch<ServiceReportResponse>("/api/v1/services/get/report");

  const isLoading =
    isLoadingServices ||
    isLoadingVehicles ||
    isLoadingBookings ||
    isLoadingAssigns ||
    isLoadingReports;

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
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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

          {/* Active Vehicles */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-100 flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Car className="h-4 w-4" />
                </div>
                Active Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {vehiclesData?.count || 0}
              </div>
              <div className="flex items-center text-sm text-cyan-100">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Available vehicles</span>
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
          <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <DollarSign className="h-4 w-4" />
                </div>
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                ${totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-emerald-100">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+8% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

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
        {/* <div className="grid gap-6 md:grid-cols-2"> */}
        <div className="">
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
          {/* <Card className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 from-emerald-900/20 to-green-900/20">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Revenue Trends
              </CardTitle>
              <CardDescription>Monthly revenue performance</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <RevenueChart />
            </CardContent>
          </Card> */}
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
                        <div className="text-sm text-muted-foreground">
                          {booking.vehicle_id?.model}
                        </div>
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
                    indicatorClassName="bg-gradient-to-r from-amber-500 to-amber-600"
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
                    indicatorClassName="bg-gradient-to-r from-emerald-500 to-emerald-600"
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
                    indicatorClassName="bg-gradient-to-r from-red-500 to-red-600"
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
