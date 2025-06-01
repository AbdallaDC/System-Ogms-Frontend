"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch, usePost, usePut } from "@/hooks/useApi";
import { format } from "date-fns";
import {
  Calendar,
  Car,
  Clock,
  Mail,
  Phone,
  User,
  Wrench,
  Pencil,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import UpdateUserForm from "./components/UpdateUserForm";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSkeleton from "./components/LoadingSkeleton";

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
}

interface Service {
  _id: string;
  service_name: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface Booking {
  _id: string;
  vehicle_id: Vehicle;
  booking_date: string;
  status: string;
  service_id: Service;
  createdAt: string;
}

interface Assignment {
  _id: string;
  booking_id: {
    _id: string;
    user_id: Customer;
    vehicle_id: Vehicle;
    service_id: Service;
    booking_date: string;
    status: string;
  };
  status: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  is_active: boolean;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  bookings: Booking[];
  assigns: Assignment[];
}

interface UserResponse {
  status: string;
  user: User;
}

export default function UserDetailsPage({}) {
  const params = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: user,
    error,
    isLoading,
  } = useFetch<UserResponse>(`/api/v1/users/${params.id}`);

  const { putData } = usePut<User, UserResponse>(
    `/api/v1/users/${params.id}`,
    `/api/v1/users/${params.id}`
  );

  const handleEditSubmit = async (values: User) => {
    try {
      await putData(values);
      toast.success("User updated successfully");
      // mutate(`/api/v1/users/${params.id}`); // Refresh the user data
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        User not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{user.user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{user.user.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Member since{" "}
                  {format(new Date(user.user.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={user.user.is_active ? "success" : "destructive"}
                >
                  {user.user.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 capitalize">
                  {user.user.role}
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
            <UpdateUserForm
              onSubmit={handleEditSubmit}
              onClose={() => setIsEditModalOpen(false)}
              initialData={user.user}
            />
          </div>
        </div>
      )}

      {/* Content based on user role */}
      {user.user.role === "customer" ? (
        // Customer Bookings Card
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Booking History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.user.bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Car className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">
                        {booking.vehicle_id.year} {booking.vehicle_id.make}{" "}
                        {booking.vehicle_id.model}
                      </span>
                    </div>
                    <Badge
                      variant={
                        booking.status === "pending"
                          ? "warning"
                          : booking.status === "completed"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(booking.booking_date), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Service: {booking.service_id.service_name}
                  </div>
                </div>
              ))}
              {user.user.bookings.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No bookings found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Mechanic Assignments Card
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.user.assigns.map((assign) => (
                <div
                  key={assign._id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">
                        {assign.booking_id.user_id.name}
                      </span>
                    </div>
                    <Badge
                      variant={
                        assign.status === "pending"
                          ? "warning"
                          : assign.status === "completed"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {assign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">
                      {assign.booking_id.vehicle_id.year}{" "}
                      {assign.booking_id.vehicle_id.make}{" "}
                      {assign.booking_id.vehicle_id.model}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(
                        new Date(assign.booking_id.booking_date),
                        "MMMM d, yyyy"
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Service: {assign.booking_id.service_id.service_name}
                  </div>
                </div>
              ))}
              {user.user.assigns.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No assigned tasks found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
