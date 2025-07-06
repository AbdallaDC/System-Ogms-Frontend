'use client';

import { useFetch } from "@/hooks/useApi";
import { Booking, BookingListResponse } from "@/types/Booking";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export function RecentBookingTable() {
  const { data: bookingsData, isLoading } = useFetch<BookingListResponse>(
    "/api/v1/bookings"
  );

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  const recentBookings =
    bookingsData?.bookings
      .sort(
        (a, b) =>
          new Date(b.booking_date).getTime() -
          new Date(a.booking_date).getTime()
      )
      .slice(0, 5) || [];

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

  return (
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
  );
}