// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useFetch, usePut } from "@/hooks/useApi";
// import { format } from "date-fns";
// import { Clock, DollarSign, Mail, Pencil, Wrench } from "lucide-react";
// import { useParams } from "next/navigation";
// import { useState } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import UpdateServiceForm from "./components/UpdateServiceForm";

// interface Service {
//   _id: string;
//   service_name: string;
//   description: string;
//   price: number;
//   createdBy: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ServiceResponse {
//   status: string;
//   service: Service;
// }

// const LoadingSkeleton = () => {
//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <Card>
//         <CardHeader>
//           <Skeleton className="h-8 w-48" />
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <Skeleton className="h-6 w-full" />
//               <Skeleton className="h-6 w-full" />
//               <Skeleton className="h-6 w-full" />
//             </div>
//             <div className="space-y-4">
//               <Skeleton className="h-6 w-full" />
//               <Skeleton className="h-6 w-full" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// const ServiceDetailsPage = () => {
//   const params = useParams();
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const {
//     data: serviceData,
//     error,
//     isLoading,
//   } = useFetch<ServiceResponse>(`/api/v1/services/${params.id}`);

//   const { data: serviceHistory, isLoading: isLoadingHistory } = useFetch<any>(
//     `/api/v1/history/service/${params.id}`
//   );

//   const { putData } = usePut<Service, ServiceResponse>(
//     `/api/v1/services/${params.id}`,
//     `/api/v1/services/${params.id}`
//   );

//   const handleEditSubmit = async (values: Service) => {
//     try {
//       await putData(values);
//       toast.success("Service updated successfully");
//       setIsEditModalOpen(false);
//     } catch (error) {
//       toast.error("Failed to update service");
//       console.error(error);
//     }
//   };

//   if (isLoading) {
//     return <LoadingSkeleton />;
//   }

//   if (error || !serviceData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Service not found
//       </div>
//     );
//   }

//   const { service } = serviceData;

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       {/* Service Details Card */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-2xl font-bold">Service Details</CardTitle>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setIsEditModalOpen(true)}
//           >
//             <Pencil className="h-4 w-4 mr-2" />
//             Edit Service
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Wrench className="w-5 h-5 text-gray-500" />
//                 <span className="text-gray-700 font-medium">
//                   {service.service_name}
//                 </span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <DollarSign className="w-5 h-5 text-gray-500" />
//                 <span className="text-gray-700">${service.price}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Mail className="w-5 h-5 text-gray-500" />
//                 <span className="text-gray-700">{service.createdBy}</span>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-gray-500" />
//                 <span className="text-gray-700">
//                   Created on{" "}
//                   {format(new Date(service.createdAt), "MMMM d, yyyy")}
//                 </span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-gray-500" />
//                 <span className="text-gray-700">
//                   Last updated{" "}
//                   {format(new Date(service.updatedAt), "MMMM d, yyyy")}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Description Section */}
//           <div className="mt-6 pt-6 border-t">
//             <h3 className="text-lg font-semibold mb-2">Description</h3>
//             <p className="text-gray-700">{service.description}</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <UpdateServiceForm
//               onSubmit={handleEditSubmit}
//               onClose={() => setIsEditModalOpen(false)}
//               initialData={service}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServiceDetailsPage;

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch, usePut } from "@/hooks/useApi";
import { format } from "date-fns";
import {
  Clock,
  DollarSign,
  Mail,
  Pencil,
  Wrench,
  Calendar,
  User,
  Car,
  History,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import UpdateServiceForm from "./components/UpdateServiceForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface ServiceHistoryItem {
  booking_id: string;

  service: {
    _id: string;
    service_name: string;
    description: string;
    price: number;
    createdBy: string;
    service_id: string;
  };
  date: string;
  status: string;
  mechanic: {
    _id: string;
    email: string;
    user_id: string;
    phone: string;
  } | null;
}

interface ServiceHistoryResponse {
  status: string;
  result: number;
  history: ServiceHistoryItem[];
}

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  p-6">
      <div className="container mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8">
          <Skeleton className="h-8 w-64 bg-white/20" />
          <Skeleton className="h-4 w-96 bg-white/20 mt-2" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
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

  const { data: serviceHistory, isLoading: isLoadingHistory } =
    useFetch<ServiceHistoryResponse>(`/api/v1/history/service/${params.id}`);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "unassigned":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "unassigned":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !serviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Service Not Found
          </h2>
          <p className="text-gray-600">
            The service you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  const { service } = serviceData;

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
            <Wrench className="h-8 w-8 text-white/40" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Wrench className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{service.service_name}</h1>
                  <p className="text-blue-100 text-lg">
                    Service Details & History
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 text-lg px-4 py-2"
                >
                  ${service.price}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {serviceHistory?.result || 0} Bookings
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Pencil className="h-5 w-5 mr-2" />
              Edit Service
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 ">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Activity className="h-6 w-6 text-blue-500" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Service Name
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {service.service_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                      <div className="p-3 bg-emerald-500 rounded-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Price
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ${service.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Created By
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {service.createdBy}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                      <div className="p-3 bg-amber-500 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Created On
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {format(new Date(service.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors">
                      <div className="p-3 bg-cyan-500 rounded-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Last Updated
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {format(new Date(service.updatedAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Wrench className="h-5 w-5 text-white" />
                    </div>
                    Description
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service History Card */}
            {serviceHistory && serviceHistory.history.length > 0 && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 ">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <History className="h-6 w-6 text-emerald-500" />
                    Service History
                    <Badge
                      variant="outline"
                      className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200"
                    >
                      {serviceHistory.result} Records
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {serviceHistory.history.map((item, index) => (
                      <div
                        key={item.booking_id}
                        className={`p-6 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                              <Car className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">
                                {item.booking_id}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {format(new Date(item.date), "MMMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={getStatusVariant(item.status)}
                            className="flex items-center gap-1"
                          >
                            {getStatusIcon(item.status)}
                            {item.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-emerald-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="h-4 w-4 text-emerald-500" />
                              <span className="text-sm font-medium text-emerald-700">
                                Service
                              </span>
                            </div>
                            <p className="font-bold text-gray-900">
                              {item.service.service_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${item.service.price}
                            </p>
                          </div>

                          <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium text-purple-700">
                                Mechanic
                              </span>
                            </div>
                            {item.mechanic ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.mechanic.email}`}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {item.mechanic.email
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <p className="font-medium text-gray-900 text-sm">
                                  {item.mechanic.email}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">
                                Not assigned
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold">
                  $
                  {(
                    (serviceHistory?.result || 0) * service.price
                  ).toLocaleString()}
                </p>
                <p className="text-emerald-100 text-sm mt-2">
                  From {serviceHistory?.result || 0} completed bookings
                </p>
              </CardContent>
            </Card>

            {/* Service Status Overview */}
            {serviceHistory && serviceHistory.history.length > 0 && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(
                    serviceHistory.history.reduce((acc, item) => {
                      acc[item.status] = (acc[item.status] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="font-medium capitalize">{status}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-between bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Service
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  View All Bookings
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Generate Report
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
              <UpdateServiceForm
                onSubmit={handleEditSubmit}
                onClose={() => setIsEditModalOpen(false)}
                initialData={service}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
