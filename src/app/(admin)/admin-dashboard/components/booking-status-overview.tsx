'use client';

import { useFetch } from "@/hooks/useApi";
import { BookingListResponse } from "@/types/Booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export function BookingStatusOverview() {
  const { data: bookingsData, isLoading } = useFetch<BookingListResponse>(
    "/api/v1/bookings"
  );

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

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

  return (
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
  );
}