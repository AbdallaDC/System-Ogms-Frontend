"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch, usePut } from "@/hooks/useApi";
import { format } from "date-fns";
import { Calendar, Car, Clock, Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import UpdateVehicleForm from "./components/UpdateVehicleForm";
import LoadingSkeleton from "./components/LoadingSkeleton";

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

interface VehicleResponse {
  status: string;
  vehicle: Vehicle;
}

interface FormValues {
  make: string;
  model: string;
  year: number;
}

const VehicleDetailPage = () => {
  const params = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: vehicleData,
    error,
    isLoading,
  } = useFetch<VehicleResponse>(`/api/v1/vehicles/${params.id}`);

  const { putData } = usePut<Vehicle, VehicleResponse>(
    `/api/v1/vehicles/${params.id}`,
    `/api/v1/vehicles/${params.id}`
  );

  const handleEditSubmit = async (values: FormValues) => {
    try {
      if (!vehicleData) return;

      await putData({
        ...vehicleData.vehicle,
        ...values,
      });
      toast.success("Vehicle updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update vehicle");
      console.error(error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !vehicleData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Vehicle not found
      </div>
    );
  }

  const { vehicle } = vehicleData;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Vehicle Details Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Vehicle Details</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Vehicle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-gray-700 font-medium">
                    {vehicle.make} {vehicle.model}
                  </span>
                  <p className="text-sm text-gray-500">Year: {vehicle.year}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Created on{" "}
                  {format(new Date(vehicle.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Last updated{" "}
                  {format(new Date(vehicle.updatedAt), "MMMM d, yyyy")}
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
            <UpdateVehicleForm
              onSubmit={handleEditSubmit}
              onClose={() => setIsEditModalOpen(false)}
              initialData={vehicle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailPage;
