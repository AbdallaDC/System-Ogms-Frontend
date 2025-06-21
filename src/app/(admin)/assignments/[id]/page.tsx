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
  ArrowRightLeft,
  AlertTriangle,
  History,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import UpdateAssignForm from "./components/UpdateAssignForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface Assign {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    user_id?: string;
    id: string;
  };
  booking_id: {
    _id: string;
    vehicle_id: {
      _id: string;
      model: string;
      year: number;
      vehicle_id?: string;
    };
    service_id: {
      _id: string;
      service_name: string;
      price?: number;
      service_id?: string;
    };
    booking_date: string;
    status: string;
  };
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assign_id?: string;
  transferHistory?: Array<{
    from: {
      _id: string;
      name: string;
      user_id: string;
      id: string;
    };
    to: {
      _id: string;
      name: string;
      user_id: string;
      id: string;
    };
    reason: string;
    date: string;
    _id: string;
  }>;

  transferReason?: string;
  transferredBy?: string;
}

interface AssignResponse {
  status: string;
  assign: Assign;
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

  if (error || !assignData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Assignment Not Found
          </h2>
          <p className="text-gray-600">
            The assignment you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  const { assign } = assignData;

  // console.log("assign: ", assign.createdBy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  p-6">
      <div className="container mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20'></div>

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
                  <UserCheck className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">
                    Assignment #{assign.assign_id || assign._id.slice(-6)}
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Mechanic Assignment Details
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge
                  variant="secondary"
                  className={`bg-gradient-to-r ${getStatusColor(
                    assign.status
                  )} text-white border-white/30 text-lg px-4 py-2`}
                >
                  {getStatusIcon(assign.status)}
                  <span className="ml-2">{assign.status}</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {format(
                    new Date(assign.booking_id.booking_date),
                    "MMMM d, yyyy"
                  )}
                </Badge>
                {assign.transferHistory &&
                  assign.transferHistory.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      {assign.transferHistory.length} Transfer
                      {assign.transferHistory.length > 1 ? "s" : ""}
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
              Edit Assignment
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Assignment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mechanic Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 ">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-blue-500" />
                  Assigned Mechanic
                </CardTitle>
                <CardDescription>
                  Details about the mechanic assigned to this job
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${assign?.user_id.name}`}
                      alt={assign?.user_id.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-2xl">
                      {assign?.user_id.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {assign?.user_id.name}
                    </h3>
                    <p className="text-gray-600 text-lg">Mechanic</p>
                    <p className="text-sm text-gray-500">
                      {assign?.user_id.user_id || assign?.user_id.id}
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
                        {assign?.user_id.email}
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
                        {assign.user_id.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking & Vehicle Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 ">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Briefcase className="h-6 w-6 text-emerald-500" />
                  Job Details
                </CardTitle>
                <CardDescription>
                  Information about the assigned booking and service
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className=" gap-8">
                  {/* Vehicle Information */}
                  {/* <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Car className="h-5 w-5 text-blue-500" />
                      Vehicle Details
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                        <div className="p-3 bg-blue-500 rounded-lg">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">
                            Vehicle Model
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {assign.booking_id.vehicle_id.model}
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
                            {assign.booking_id.vehicle_id.year}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}

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
                            {assign.booking_id.service_id.service_name}
                          </p>
                        </div>
                      </div>

                      {assign.booking_id.service_id.price && (
                        <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                          <div className="p-3 bg-purple-500 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">
                              Service Price
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              ${assign.booking_id.service_id.price}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Status */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        Booking Status
                      </h4>
                      <p className="text-gray-600">
                        Current status of the booking
                      </p>
                    </div>
                    <Badge
                      variant={getStatusVariant(assign.booking_id.status)}
                      className="text-lg px-4 py-2"
                    >
                      {getStatusIcon(assign.booking_id.status)}
                      <span className="ml-2">{assign.booking_id.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transfer History Card */}
            {assign.transferHistory && assign.transferHistory.length > 0 && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 ">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <History className="h-6 w-6 text-purple-500" />
                    Transfer History
                    <Badge
                      variant="outline"
                      className="ml-auto bg-purple-100 text-purple-700 border-purple-200"
                    >
                      {assign.transferHistory.length} Transfer
                      {assign.transferHistory.length > 1 ? "s" : ""}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    History of mechanic transfers for this assignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {assign.transferHistory.map((transfer, index) => (
                      <div
                        key={transfer._id}
                        className={`p-6 border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                              <ArrowRightLeft className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">
                                Transfer #{index + 1}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {format(
                                  new Date(transfer.date),
                                  "MMMM d, yyyy 'at' h:mm a"
                                )}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Transfer
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-red-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium text-red-700">
                                From
                              </span>
                            </div>
                            <p className="font-bold text-gray-900 flex flex-col">
                              {transfer.from.name}
                              <span className="text-xs font-medium text-slate-700">
                                {transfer.from.user_id}
                              </span>
                            </p>
                          </div>

                          <div className="bg-emerald-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-emerald-500" />
                              <span className="text-sm font-medium text-emerald-700">
                                To
                              </span>
                            </div>
                            <p className="font-bold text-gray-900 flex flex-col">
                              {transfer.to.name}{" "}
                              <span className="text-xs font-medium text-slate-700">
                                {transfer.to.user_id}
                              </span>
                            </p>
                          </div>

                          <div className="bg-amber-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <span className="text-sm font-medium text-amber-700">
                                Reason
                              </span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">
                              {transfer.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Assignment Status */}
            <Card
              className={`overflow-hidden border-none bg-gradient-to-br ${getStatusColor(
                assign.status
              )} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    {getStatusIcon(assign.status)}
                  </div>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Assignment Status</h3>
                <p className="text-3xl font-bold capitalize">{assign.status}</p>
                <p className="text-white/80 text-sm mt-2">
                  {assign.status === "pending" && "Assignment is pending"}
                  {assign.status === "completed" &&
                    "Assignment completed successfully"}
                  {assign.status === "in-progress" &&
                    "Assignment is currently in progress"}
                  {assign.status === "cancelled" &&
                    "Assignment has been cancelled"}
                </p>
              </CardContent>
            </Card>

            {/* Assignment Information */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Assignment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Assignment ID</span>
                  </div>
                  <Badge variant="outline">
                    {assign.assign_id || assign._id.slice(-6)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">Created</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {format(new Date(assign.createdAt), "MMM d, yyyy")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Created By</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {/* {assign.createdBy} */}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Booking Date</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {format(
                      new Date(assign.booking_id.booking_date),
                      "MMM d, yyyy"
                    )}
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
                  Edit Assignment
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Transfer Mechanic
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Contact Mechanic
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  View Booking Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card> */}

            {/* Progress Indicator */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Assignment Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Assignment Created</span>
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
                    <span>Mechanic Assigned</span>
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
                    <span>Work In Progress</span>
                    <span
                      className={
                        assign.status === "in-progress" ||
                        assign.status === "completed"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }
                    >
                      {assign.status === "in-progress" ||
                      assign.status === "completed"
                        ? "✓"
                        : "○"}
                    </span>
                  </div>
                  <Progress
                    value={
                      assign.status === "in-progress" ||
                      assign.status === "completed"
                        ? 100
                        : 0
                    }
                    className="h-2"
                    // indicatorClassName="bg-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Assignment Completed</span>
                    <span
                      className={
                        assign.status === "completed"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }
                    >
                      {assign.status === "completed" ? "✓" : "○"}
                    </span>
                  </div>
                  <Progress
                    value={assign.status === "completed" ? 100 : 0}
                    className="h-2"
                    // indicatorClassName="bg-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
              <UpdateAssignForm
                onSubmit={handleEditSubmit}
                onClose={() => setIsEditModalOpen(false)}
                initialData={assign}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignDetailPage;
