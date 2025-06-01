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
import UpdateAssignForm from "./components/UpdateAssignForm";

interface Assign {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    id: string;
  };
  booking_id: {
    _id: string;
    vehicle_id: {
      _id: string;
      make: string;
      model: string;
      year: number;
    };
    service_id: {
      _id: string;
      service_name: string;
    };
    booking_date: string;
    status: string;
  };
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface AssignResponse {
  status: string;
  assign: Assign;
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

const AssignDetailPage = () => {
  const params = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: assignData,
    error,
    isLoading,
  } = useFetch<AssignResponse>(`/api/v1/assigns/${params.id}`);

  const { putData } = usePut<Assign, AssignResponse>(
    `/api/v1/assigns/${params.id}`,
    `/api/v1/assigns/${params.id}`
  );

  const handleEditSubmit = async (values: Assign) => {
    try {
      await putData(values);
      toast.success("Assignment updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update assignment");
      console.error(error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !assignData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Assignment not found
      </div>
    );
  }

  const { assign } = assignData;

  console.log("assign", assign);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Assignment Details Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Assignment Details
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Assignment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-gray-700 font-medium">
                    {assign.user_id.name}
                  </span>
                  <p className="text-sm text-gray-500">
                    {assign.user_id.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-gray-700 font-medium">
                    {assign.booking_id.vehicle_id.make}{" "}
                    {assign.booking_id.vehicle_id.model}
                  </span>
                  <p className="text-sm text-gray-500">
                    Year: {assign.booking_id.vehicle_id.year}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-gray-700 font-medium">
                    {assign.booking_id.service_id?.service_name}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Booking Date:{" "}
                  {format(
                    new Date(assign.booking_id.booking_date),
                    "MMMM d, yyyy"
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    assign.status === "completed"
                      ? "success"
                      : assign.status === "pending"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {assign.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Created by: {assign.createdBy}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Created on{" "}
                  {format(new Date(assign.createdAt), "MMMM d, yyyy")}
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
            <UpdateAssignForm
              onSubmit={handleEditSubmit}
              onClose={() => setIsEditModalOpen(false)}
              initialData={assign}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignDetailPage;
