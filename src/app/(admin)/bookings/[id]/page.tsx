"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch, usePut } from "@/hooks/useApi";
import { format } from "date-fns";
import { Calendar, Car, Clock, Mail, Pencil, User, Wrench } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Booking } from "@/types/Booking";
import UpdateBookingForm from "./components/UpdateBookingForm";

interface BookingResponse {
  status: string;
  booking: Booking;
}

const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const BookingDetailPage = () => {
  const params = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: bookingData,
    error,
    isLoading,
  } = useFetch<BookingResponse>(`/api/v1/bookings/${params.id}`);

  const { putData } = usePut<Booking, BookingResponse>(
    `/api/v1/bookings/${params.id}`,
    `/api/v1/bookings/${params.id}`
  );

  const handleEditSubmit = async (values: Booking) => {
    try {
      await putData(values);
      toast.success("Booking updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update booking");
      console.error(error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Booking not found
      </div>
    );
  }

  const { booking } = bookingData;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Booking Details Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Booking Details</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Booking
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-gray-700 font-medium">
                    {booking.user_id?.name}
                  </span>
                  <p className="text-sm text-gray-500">
                    {booking.user_id?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-gray-700 font-medium">
                    {booking.vehicle_id && booking.vehicle_id.make}{" "}
                    {booking.vehicle_id.model}
                  </span>
                  <p className="text-sm text-gray-500">
                    Year: {booking.vehicle_id.year}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-gray-700 font-medium">
                    {booking.service_id && booking.service_id.service_name}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Booking Date:{" "}
                  {format(new Date(booking.booking_date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    booking.status === "completed"
                      ? "success"
                      : booking.status === "pending"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {booking.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Created by: {booking.createdBy}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Created on{" "}
                  {format(new Date(booking.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <UpdateBookingForm
              onSubmit={handleEditSubmit}
              onClose={() => setIsEditModalOpen(false)}
              initialData={booking}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailPage;
