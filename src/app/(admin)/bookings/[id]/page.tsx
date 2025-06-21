"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useFetch, usePut } from "@/hooks/useApi";
import { format } from "date-fns";
import {
  Calendar,
  Car,
  Clock,
  Mail,
  Pencil,
  User,
  Wrench,
  CheckCircle,
  XCircle,
  Clock3,
  Sparkles,
  Settings,
  ArrowRight,
  Phone,
  FileText,
  Activity,
  PenToolIcon as Tool,
  TrendingUp,
  Star,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Booking } from "@/types/Booking";
import UpdateBookingForm from "./components/UpdateBookingForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface BookingResponse {
  status: string;
  booking: Booking;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : star - 0.5 <= rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-lg font-semibold text-gray-700">
        {rating.toFixed(1)}/5.0
      </span>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  p-6">
      <div className="container mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8">
          <div className="h-8 w-64 bg-white/20 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-white/20 mt-2 rounded-lg animate-pulse"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 rounded-2xl bg-white/50 animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-2xl bg-white/50 animate-pulse"></div>
            <div className="h-64 rounded-2xl bg-white/50 animate-pulse"></div>
          </div>
        </div>
      </div>
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

  const { data: feedbackData } = useFetch<{
    status: string;
    feedback: {
      _id: string;
      booking_id: string;
      customer_id: string;
      mechanic_id: string;
      rating: number;
      comment: string;
      createdAt: string;
      updatedAt: string;
      feedback_id: string;
    };
  }>(`/api/v1/feedback/booking/${params.id}`);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "pending":
        return <Clock3 className="h-5 w-5 text-amber-500" />;
      case "in-progress":
        return <Activity className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "in-progress":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "from-emerald-500 to-emerald-600";
      case "pending":
        return "from-amber-500 to-amber-600";
      case "in-progress":
        return "from-blue-500 to-blue-600";
      case "cancelled":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600">
            The booking you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  const { booking } = bookingData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  p-6">
      <div className="container mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20'></div>

          {/* Floating Elements */}
          <div className="absolute top-4 right-4 animate-bounce">
            <Sparkles className="h-6 w-6 text-white/60" />
          </div>
          <div className="absolute bottom-4 left-4 animate-pulse">
            <Settings className="h-8 w-8 text-white/40" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">
                    Booking #{booking.booking_id}
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Service Appointment Details
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge
                  variant="secondary"
                  className={`bg-gradient-to-r ${getStatusColor(
                    booking.status
                  )} text-white border-white/30 text-lg px-4 py-2`}
                >
                  {getStatusIcon(booking.status)}
                  <span className="ml-2">{booking.status}</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {format(new Date(booking.booking_date), "MMMM d, yyyy")}
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Pencil className="h-5 w-5 mr-2" />
              Edit Booking
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 ">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-blue-500" />
                  Customer Information
                </CardTitle>
                <CardDescription>
                  Details about the customer who made this booking
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.user_id?.name}`}
                      alt={booking.user_id?.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-2xl">
                      {booking.user_id?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {booking.user_id?.name}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {booking.user_id?.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Email Address
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {booking.user_id?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                    <div className="p-3 bg-emerald-500 rounded-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Phone Number
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {booking.user_id?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle & Service Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 ">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Car className="h-6 w-6 text-emerald-500" />
                  Service Details
                </CardTitle>
                <CardDescription>
                  Information about the requested service
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className=" gap-8">
                  {/* Vehicle Information */}

                  {/* Service Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-emerald-500" />
                      Service Details
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                        <div className="p-3 bg-emerald-500 rounded-lg">
                          <Wrench className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">
                            Service Name
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {booking.service_id?.service_name}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 font-medium mb-2">
                          Service Description
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {booking.service_id?.description ||
                            "No description Provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Timeline Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 ">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Clock className="h-6 w-6 text-purple-500" />
                  Booking Timeline
                </CardTitle>
                <CardDescription>
                  Track the progress of this booking
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="p-3 bg-blue-500 rounded-full">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">
                        Booking Created
                      </h4>
                      <p className="text-gray-600">
                        {format(
                          new Date(booking.createdAt),
                          "MMMM d, yyyy 'at' h:mm a"
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created by: {booking.createdBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                    <div className="p-3 bg-amber-500 rounded-full">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">
                        Scheduled Date
                      </h4>
                      <p className="text-gray-600">
                        {format(
                          new Date(booking.booking_date),
                          "MMMM d, yyyy 'at' h:mm a"
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Service appointment time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <div className="p-3 bg-purple-500 rounded-full">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">
                        Current Status
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(booking.status)}
                        <span className="font-medium capitalize">
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Last updated:{" "}
                        {format(new Date(booking.updatedAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Status Overview */}
            <Card
              className={`overflow-hidden border-none bg-gradient-to-br ${getStatusColor(
                booking.status
              )} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    {getStatusIcon(booking.status)}
                  </div>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Booking Status</h3>
                <p className="text-3xl font-bold capitalize">
                  {booking.status}
                </p>
                <p className="text-white/80 text-sm mt-2">
                  {booking.status === "pending" && "Waiting for confirmation"}
                  {booking.status === "completed" &&
                    "Service completed successfully"}
                  {booking.status === "in-progress" &&
                    "Service is currently in progress"}
                  {booking.status === "cancelled" &&
                    "Booking has been cancelled"}
                </p>
              </CardContent>
            </Card>

            {/* Booking Information */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Booking ID</span>
                  </div>
                  <Badge variant="outline">{booking.booking_id}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">Created</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {format(new Date(booking.createdAt), "MMM d, yyyy")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Created By</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {booking.createdBy}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {/* <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tool className="h-5 w-5 text-blue-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-between bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Booking
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Contact Customer
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Assign Mechanic
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Generate Invoice
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card> */}

            {/* Progress Indicator */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Service Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Booking Created</span>
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <Progress
                    value={100}
                    className="h-2"
                    // indicatorClassName="bg-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service Scheduled</span>
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <Progress
                    value={100}
                    className="h-2"
                    // indicatorClassName="bg-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>In Progress</span>
                    <span
                      className={
                        booking.status === "in-progress" ||
                        booking.status === "completed"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }
                    >
                      {booking.status === "in-progress" ||
                      booking.status === "completed"
                        ? "✓"
                        : "○"}
                    </span>
                  </div>
                  <Progress
                    value={
                      booking.status === "in-progress" ||
                      booking.status === "completed"
                        ? 100
                        : 0
                    }
                    className="h-2"
                    // indicatorClassName="bg-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span
                      className={
                        booking.status === "completed"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }
                    >
                      {booking.status === "completed" ? "✓" : "○"}
                    </span>
                  </div>
                  <Progress
                    value={booking.status === "completed" ? 100 : 0}
                    className="h-2"

                    // indicatorClassName="bg-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Feedback */}
            {feedbackData?.feedback && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Customer Feedback
                  </CardTitle>
                  <CardDescription>
                    Rating and review for this service
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <StarRating rating={feedbackData.feedback.rating} />
                    <p className="text-sm text-gray-500 mt-1">
                      Feedback ID: {feedbackData.feedback.feedback_id}
                    </p>
                  </div>

                  {feedbackData.feedback.comment && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Customer Comment
                      </h4>
                      <p className="text-gray-700 leading-relaxed italic">
                        "{feedbackData.feedback.comment}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                    <span>Submitted on</span>
                    <span>
                      {format(
                        new Date(feedbackData.feedback.createdAt),
                        "MMM d, yyyy"
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
              <UpdateBookingForm
                onSubmit={handleEditSubmit}
                onClose={() => setIsEditModalOpen(false)}
                initialData={booking}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailPage;
