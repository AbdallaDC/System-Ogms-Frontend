'use client';

import { useFetch } from "@/hooks/useApi";
import { BookingListResponse } from "@/types/Booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function PendingBookingsCard() {
  const { data: bookingsData, isLoading } = useFetch<BookingListResponse>(
    "/api/v1/bookings"
  );

  if (isLoading) {
    return <Skeleton className="w-full h-32" />;
  }

  const pendingBookings = bookingsData?.bookings.filter(
    (b) => b.status.toLowerCase() === "pending"
  ).length || 0;

  const totalBookings = bookingsData?.bookings.length || 0;

  return (
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
          {pendingBookings}
        </div>
        <div className="text-sm text-amber-100">
          {totalBookings} total bookings
        </div>
      </CardContent>
    </Card>
  );
}