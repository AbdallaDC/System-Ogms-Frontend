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
  Phone,
  User,
  Wrench,
  Pencil,
  CheckCircle,
  XCircle,
  Clock3,
  Sparkles,
  Settings,
  ArrowRight,
  Activity,
  PenToolIcon as Tool,
  TrendingUp,
  History,
  Shield,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import UpdateUserForm from "./components/UpdateUserForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface Service {
  _id: string;
  service_name: string;
  price?: number;
  service_id?: string;
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
  // vehicle_id: Vehicle;
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
    // vehicle_id: Vehicle;
    service_id: Service;
    booking_date: string;
    status: string;
  };
  status: string;
  createdAt: string;
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  is_active: boolean;
  phone: string;
  role: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  bookings?: Booking[];
  assigns?: Assignment[];
}

interface UserResponse {
  status: string;
  user: UserType;
}

interface CustomerHistoryResponse {
  status: string;
  result: number;
  history: Array<{
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
      price: number;
      service_id: string;
    };
    date: string;
    status: string;
    mechanic: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      user_id: string;
    };
  }>;
}

interface MechanicHistoryResponse {
  status: string;
  result: number;
  history: Array<{
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
      price: number;
      service_id: string;
    };
    date: string;
    status: string;
    mechanic: string;
  }>;
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

export default function UserDetailsPage() {
  const params = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: userData,
    error,
    isLoading,
  } = useFetch<UserResponse>(`/api/v1/users/${params.id}`);

  const { data: customerHistory, isLoading: isLoadingCustomerHistory } =
    useFetch<CustomerHistoryResponse>(
      userData?.user.role === "customer"
        ? `/api/v1/history/customer/${params.id}`
        : ""
    );

  const { data: mechanicHistory, isLoading: isLoadingMechanicHistory } =
    useFetch<MechanicHistoryResponse>(
      userData?.user.role === "mechanic"
        ? `/api/v1/history/mechanic/${params.id}`
        : ""
    );

  const { putData } = usePut<UserType, UserResponse>(
    `/api/v1/users/${params.id}`,
    `/api/v1/users/${params.id}`
  );

  const handleEditSubmit = async (values: UserType) => {
    try {
      await putData(values);
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending":
        return <Clock3 className="h-4 w-4 text-amber-500" />;
      case "in-progress":
      case "assigned":
        return <Activity className="h-4 w-4 text-blue-500" />;
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
      case "pending":
        return "warning";
      case "in-progress":
      case "assigned":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "customer":
        return <User className="h-6 w-6" />;
      case "mechanic":
        return <Wrench className="h-6 w-6" />;
      case "admin":
        return <Shield className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "customer":
        return "from-blue-500 to-cyan-500";
      case "mechanic":
        return "from-emerald-500 to-green-500";
      case "admin":
        return "from-purple-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600">
            The user you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  const { user } = userData;

  // Calculate statistics
  const totalHistory =
    user.role === "customer"
      ? customerHistory?.result || 0
      : mechanicHistory?.result || 0;
  const completedCount =
    user.role === "customer"
      ? customerHistory?.history.filter(
          (h) => h.status.toLowerCase() === "completed"
        ).length || 0
      : mechanicHistory?.history.filter(
          (h) => h.status.toLowerCase() === "completed"
        ).length || 0;

  const totalRevenue =
    user.role === "customer"
      ? customerHistory?.history.reduce((sum, h) => sum + h.service.price, 0) ||
        0
      : mechanicHistory?.history.reduce((sum, h) => sum + h.service.price, 0) ||
        0;

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
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white/20">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                />
                <AvatarFallback className="bg-white/20 text-white text-3xl font-bold">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{user.name}</h1>
                <p className="text-blue-100 text-lg capitalize">{user.role}</p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge
                    variant="secondary"
                    className={`bg-gradient-to-r ${getRoleColor(
                      user.role
                    )} text-white border-white/30 text-lg px-4 py-2`}
                  >
                    {getRoleIcon(user.role)}
                    <span className="ml-2 capitalize">{user.role}</span>
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`${
                      user.is_active ? "bg-emerald-500/20" : "bg-red-500/20"
                    } text-white border-white/30`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    {totalHistory}{" "}
                    {user.role === "customer" ? "Bookings" : "Assignments"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Pencil className="h-5 w-5 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - User Details & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 ">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-blue-500" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Personal details and account information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Email Address
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Address
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {user.address || "Not provided"}
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
                          {user.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Member Since
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {format(new Date(user.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                      <div className="p-3 bg-amber-500 rounded-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Last Updated
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {format(new Date(user.updatedAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Card */}
            {((user.role === "customer" && customerHistory) ||
              (user.role === "mechanic" && mechanicHistory)) && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <History className="h-6 w-6 text-emerald-500" />
                    {user.role === "customer"
                      ? "Booking History"
                      : "Assignment History"}
                    <Badge
                      variant="outline"
                      className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200"
                    >
                      {totalHistory} Records
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {user.role === "customer"
                      ? "Complete history of all bookings and services"
                      : "Complete history of all assignments and completed work"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {user.role === "customer" &&
                      customerHistory?.history.map((item, index) => (
                        <CustomerHistoryItem
                          key={item.booking_id}
                          item={item}
                          index={index}
                        />
                      ))}
                    {user.role === "mechanic" &&
                      mechanicHistory?.history.map((item, index) => (
                        <MechanicHistoryItem
                          key={item.booking_id}
                          item={item}
                          index={index}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <Card
              className={`overflow-hidden border-none bg-gradient-to-br ${getRoleColor(
                user.role
              )} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    {getRoleIcon(user.role)}
                  </div>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {user.role === "customer" ? "Total Spent" : "Total Earned"}
                </h3>
                <p className="text-3xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-white/80 text-sm mt-2">
                  From {totalHistory}{" "}
                  {user.role === "customer" ? "bookings" : "assignments"}
                </p>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Completed{" "}
                      {user.role === "customer" ? "Bookings" : "Assignments"}
                    </span>
                    <span className="font-medium">
                      {completedCount} of {totalHistory}
                    </span>
                  </div>
                  <Progress
                    value={
                      totalHistory > 0
                        ? (completedCount / totalHistory) * 100
                        : 0
                    }
                    className="h-3"
                    // indicatorClassName="bg-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalHistory}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">
                      {completedCount}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Status</span>
                  </div>
                  <Badge variant={user.is_active ? "success" : "destructive"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">Role</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Joined</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {format(new Date(user.createdAt), "MMM yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>

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
                  Edit Profile
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  {user.role === "customer"
                    ? "New Booking"
                    : "View Assignments"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Contact User
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
              <UpdateUserForm
                onSubmit={handleEditSubmit}
                onClose={() => setIsEditModalOpen(false)}
                initialData={user}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Customer History Item Component
const CustomerHistoryItem = ({
  item,
  index,
}: {
  item: CustomerHistoryResponse["history"][0];
  index: number;
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending":
        return <Clock3 className="h-4 w-4 text-amber-500" />;
      case "assigned":
        return <Activity className="h-4 w-4 text-blue-500" />;
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
      case "pending":
        return "warning";
      case "assigned":
        return "default";
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
            <Car className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">
              Booking #{item.booking_id}
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
            <Wrench className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">
              Service
            </span>
          </div>
          <p className="font-bold text-gray-900">{item.service.service_name}</p>
          <p className="text-sm text-gray-600">${item.service.price}</p>
          <p className="text-xs text-gray-500">{item.service.service_id}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">
              Mechanic
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.mechanic.name}`}
              />
              <AvatarFallback className="text-xs bg-purple-500 text-white">
                {item.mechanic.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {item.mechanic.name}
              </p>
              <p className="text-xs text-gray-500">{item.mechanic.user_id}</p>
            </div>
          </div>
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

// Mechanic History Item Component
const MechanicHistoryItem = ({
  item,
  index,
}: {
  item: MechanicHistoryResponse["history"][0];
  index: number;
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending":
        return <Clock3 className="h-4 w-4 text-amber-500" />;
      case "assigned":
        return <Activity className="h-4 w-4 text-blue-500" />;
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
      case "pending":
        return "warning";
      case "assigned":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div
      className={`p-6 border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">
              Assignment #{item.booking_id}
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
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Car className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Vehicle</span>
          </div>
          {/* <p className="font-bold text-gray-900">{item.vehicle.model}</p>
          <p className="text-sm text-gray-600">Year: {item.vehicle.year}</p>
          <p className="text-xs text-gray-500">{item.vehicle.vehicle_id}</p> */}
        </div>

        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">
              Service
            </span>
          </div>
          <p className="font-bold text-gray-900">{item.service.service_name}</p>
          <p className="text-sm text-gray-600">${item.service.price}</p>
          <p className="text-xs text-gray-500">{item.service.service_id}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
        >
          View Assignment
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
