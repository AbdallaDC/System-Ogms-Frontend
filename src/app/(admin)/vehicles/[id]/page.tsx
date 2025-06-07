// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useFetch, usePut } from "@/hooks/useApi";
// import { format } from "date-fns";
// import { Calendar, Car, Clock, Pencil } from "lucide-react";
// import { useParams } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import UpdateVehicleForm from "./components/UpdateVehicleForm";
// import LoadingSkeleton from "./components/LoadingSkeleton";

// interface Vehicle {
//   _id: string;
//   make: string;
//   model: string;
//   year: number;
//   createdAt: string;
//   updatedAt: string;
// }

// interface VehicleResponse {
//   status: string;
//   vehicle: Vehicle;
// }

// interface FormValues {
//   make: string;
//   model: string;
//   year: number;
// }

// const VehicleDetailPage = () => {
//   const params = useParams();
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const {
//     data: vehicleData,
//     error,
//     isLoading,
//   } = useFetch<VehicleResponse>(`/api/v1/vehicles/${params.id}`);

//   const { data: vehicleHistory, isLoading: isLoadingHistory } = useFetch<any>(
//     `/api/v1/history/vehicle/${params.id}`
//   );
//   console.log("vehicleHistory", vehicleHistory);

//   const { putData } = usePut<Vehicle, VehicleResponse>(
//     `/api/v1/vehicles/${params.id}`,
//     `/api/v1/vehicles/${params.id}`
//   );

//   const handleEditSubmit = async (values: FormValues) => {
//     try {
//       if (!vehicleData) return;

//       await putData({
//         ...vehicleData.vehicle,
//         ...values,
//       });
//       toast.success("Vehicle updated successfully");
//       setIsEditModalOpen(false);
//     } catch (error) {
//       toast.error("Failed to update vehicle");
//       console.error(error);
//     }
//   };

//   if (isLoading) {
//     return <LoadingSkeleton />;
//   }

//   if (error || !vehicleData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Vehicle not found
//       </div>
//     );
//   }

//   const { vehicle } = vehicleData;

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       {/* Vehicle Details Card */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-2xl font-bold">Vehicle Details</CardTitle>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setIsEditModalOpen(true)}
//           >
//             <Pencil className="h-4 w-4 mr-2" />
//             Edit Vehicle
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Car className="w-5 h-5 text-gray-500" />
//                 <div>
//                   <span className="text-gray-700 font-medium">
//                     {vehicle.make} {vehicle.model}
//                   </span>
//                   <p className="text-sm text-gray-500">Year: {vehicle.year}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Calendar className="w-5 h-5 text-gray-500" />
//                 <span className="text-gray-700">
//                   Created on{" "}
//                   {format(new Date(vehicle.createdAt), "MMMM d, yyyy")}
//                 </span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-gray-500" />
//                 <span className="text-gray-700">
//                   Last updated{" "}
//                   {format(new Date(vehicle.updatedAt), "MMMM d, yyyy")}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <UpdateVehicleForm
//               onSubmit={handleEditSubmit}
//               onClose={() => setIsEditModalOpen(false)}
//               initialData={vehicle}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VehicleDetailPage;

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
  Pencil,
  Settings,
  Wrench,
  CheckCircle,
  AlertCircle,
  Clock3,
  XCircle,
  Sparkles,
  History,
  BarChart3,
  ArrowRight,
  PenToolIcon as Tool,
  User,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import UpdateVehicleForm from "./components/UpdateVehicleForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface ServiceHistoryItem {
  booking_id: string;
  vehicle: {
    _id: string;
    model: string;
    year: number;
    vehicle_id: string;
  };
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
    user_id?: string;
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
          <div className="h-8 w-64 bg-white/20 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-white/20 mt-2 rounded-lg animate-pulse"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 rounded-2xl bg-white/50 animate-pulse"></div>
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

const VehicleDetailPage = () => {
  const params = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: vehicleData,
    error,
    isLoading,
  } = useFetch<VehicleResponse>(`/api/v1/vehicles/${params.id}`);

  const { data: vehicleHistory, isLoading: isLoadingHistory } =
    useFetch<ServiceHistoryResponse>(`/api/v1/history/vehicle/${params.id}`);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "in-progress":
        return <Clock3 className="h-4 w-4 text-blue-500" />;
      case "unassigned":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "in-progress":
        return "default";
      case "unassigned":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-500";
      case "in-progress":
        return "bg-blue-500";
      case "unassigned":
        return "bg-amber-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Group history items by status
  const groupedHistory = vehicleHistory?.history.reduce((acc, item) => {
    const status = item.status.toLowerCase();
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(item);
    return acc;
  }, {} as Record<string, ServiceHistoryItem[]>);

  // Get up to 3 items from each status group
  const limitedHistory = groupedHistory
    ? Object.entries(groupedHistory).reduce((acc, [status, items]) => {
        acc[status] = items.slice(0, 3);
        return acc;
      }, {} as Record<string, ServiceHistoryItem[]>)
    : {};

  // Calculate total service cost
  const totalServiceCost =
    vehicleHistory?.history.reduce(
      (total, item) => total + item.service.price,
      0
    ) || 0;

  // Calculate status counts
  const statusCounts =
    vehicleHistory?.history.reduce((acc, item) => {
      const status = item.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !vehicleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vehicle Not Found
          </h2>
          <p className="text-gray-600">
            The vehicle you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  const { vehicle } = vehicleData;

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
                  <Car className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">
                    {vehicle.make} {vehicle.model}
                  </h1>
                  <p className="text-blue-100 text-lg">Year: {vehicle.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {vehicleHistory?.result || 0} Service Records
                </Badge>
                {vehicleHistory && vehicleHistory.history.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    ${totalServiceCost.toLocaleString()} Total Service Value
                  </Badge>
                )}
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Pencil className="h-5 w-5 mr-2" />
              Edit Vehicle
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Vehicle Details & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 ">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Car className="h-6 w-6 text-blue-500" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Model
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                      <div className="p-3 bg-amber-500 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Year
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {vehicle.year}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                      <div className="p-3 bg-emerald-500 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Created On
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {format(new Date(vehicle.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Last Updated
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {format(new Date(vehicle.updatedAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service History Card */}
            {vehicleHistory && vehicleHistory.history.length > 0 && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 ">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <History className="h-6 w-6 text-blue-500" />
                      Service History
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700 border-blue-200"
                    >
                      {vehicleHistory.result} Records
                    </Badge>
                  </div>
                  <CardDescription>
                    View all service records for this vehicle
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs
                    defaultValue="all"
                    className="w-full"
                    onValueChange={setActiveTab}
                  >
                    <div className="px-6 pt-6">
                      <TabsList className="grid w-full grid-cols-4 bg-blue-50">
                        <TabsTrigger
                          value="all"
                          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        >
                          All
                        </TabsTrigger>
                        <TabsTrigger
                          value="completed"
                          className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                        >
                          Completed
                        </TabsTrigger>
                        <TabsTrigger
                          value="in-progress"
                          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        >
                          In Progress
                        </TabsTrigger>
                        <TabsTrigger
                          value="unassigned"
                          className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                        >
                          Unassigned
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="all" className="mt-0">
                      <div className="space-y-0">
                        {vehicleHistory.history.map((item, index) => (
                          <ServiceHistoryItem
                            key={item.booking_id}
                            item={item}
                            index={index}
                          />
                        ))}
                      </div>
                    </TabsContent>

                    {Object.entries(limitedHistory).map(([status, items]) => (
                      <TabsContent key={status} value={status} className="mt-0">
                        <div className="space-y-0">
                          {items.map((item, index) => (
                            <ServiceHistoryItem
                              key={item.booking_id}
                              item={item}
                              index={index}
                            />
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Service Status Overview */}
            {vehicleHistory && vehicleHistory.history.length > 0 && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Service Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(
                              status
                            )}`}
                          ></div>
                          <span className="font-medium capitalize">
                            {status}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {count} of {vehicleHistory.result}
                        </span>
                      </div>
                      <Progress
                        value={(count / vehicleHistory.result) * 100}
                        className="h-2"
                        //indicatorClassName={getStatusColor(status)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Service Cost Summary */}
            {vehicleHistory && vehicleHistory.history.length > 0 && (
              <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <DollarSign className="h-8 w-8" />
                    </div>
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Total Service Cost
                  </h3>
                  <p className="text-3xl font-bold">
                    ${totalServiceCost.toLocaleString()}
                  </p>
                  <p className="text-emerald-100 text-sm mt-2">
                    From {vehicleHistory.result} service records
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Recent Mechanics */}
            {vehicleHistory && vehicleHistory.history.length > 0 && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Recent Mechanics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vehicleHistory.history
                    .filter((item) => item.mechanic)
                    .slice(0, 3)
                    .map((item) => (
                      <div
                        key={item.booking_id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.mechanic?.email}`}
                            />
                            <AvatarFallback className="bg-blue-500 text-white">
                              {item.mechanic?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {item.mechanic?.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(item.date), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
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
                  Edit Vehicle
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Schedule Service
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  View Maintenance History
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
              <UpdateVehicleForm
                onSubmit={handleEditSubmit}
                onClose={() => setIsEditModalOpen(false)}
                initialData={vehicle}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Service History Item Component
const ServiceHistoryItem = ({
  item,
  index,
}: {
  item: ServiceHistoryItem;
  index: number;
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "in-progress":
        return <Clock3 className="h-4 w-4 text-blue-500" />;
      case "unassigned":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "in-progress":
        return "default";
      case "unassigned":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div
      className={`p-6 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Wrench className="h-5 w-5 text-white" />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Service</span>
          </div>
          <p className="font-bold text-gray-900">{item.service.service_name}</p>
          <p className="text-sm text-gray-600">${item.service.price}</p>
          <p className="text-xs text-gray-500">{item.service.service_id}</p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">Date</span>
          </div>
          <p className="font-bold text-gray-900">
            {format(new Date(item.date), "MMMM d, yyyy")}
          </p>
          <p className="text-sm text-gray-600">
            {format(new Date(item.date), "h:mm a")}
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
                <AvatarFallback className="text-xs bg-purple-500 text-white">
                  {item.mechanic.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-gray-900 text-sm">
                {item.mechanic.email}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Not assigned</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
