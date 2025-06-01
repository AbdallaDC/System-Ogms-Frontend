"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch, usePut } from "@/hooks/useApi";
import { format } from "date-fns";
import { Clock, DollarSign, Mail, Pencil, Wrench } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import UpdateServiceForm from "./components/UpdateServiceForm";

interface Service {
  _id: string;
  service_name: string;
  description: string;
  price: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceResponse {
  status: string;
  service: Service;
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

const ServiceDetailsPage = () => {
  const params = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: serviceData,
    error,
    isLoading,
  } = useFetch<ServiceResponse>(`/api/v1/services/${params.id}`);

  const { putData } = usePut<Service, ServiceResponse>(
    `/api/v1/services/${params.id}`,
    `/api/v1/services/${params.id}`
  );

  const handleEditSubmit = async (values: Service) => {
    try {
      await putData(values);
      toast.success("Service updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update service");
      console.error(error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !serviceData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Service not found
      </div>
    );
  }

  const { service } = serviceData;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Service Details Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Service Details</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Service
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium">
                  {service.service_name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">${service.price}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{service.createdBy}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Created on{" "}
                  {format(new Date(service.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Last updated{" "}
                  {format(new Date(service.updatedAt), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{service.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <UpdateServiceForm
              onSubmit={handleEditSubmit}
              onClose={() => setIsEditModalOpen(false)}
              initialData={service}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailsPage;
