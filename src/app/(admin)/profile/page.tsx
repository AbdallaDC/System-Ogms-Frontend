"use client";
import { useFetch, usePost, usePut } from "@/hooks/useApi";
import { getUser } from "@/utils/getUser";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Pencil,
  Shield,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import UpdateProfileForm from "./components/UpdateProfileForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import { User } from "@/types/User";

interface UserTypeResponse {
  status: string;
  user: User;
}

const ProfilePage = () => {
  const currentUser = getUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const {
    data: userData,
    error,
    isLoading,
  } = useFetch<UserTypeResponse>(`/api/v1/users/${currentUser?.user?._id}`);

  console.log("userData", userData);

  const { putData: updateUser } = usePut(
    `/api/v1/users/${currentUser?.user?._id}`,
    `/api/v1/users/${currentUser?.user?._id}`
  );

  const { postData: changePassword } = usePost(
    `/api/v1/auth/change-password`,
    "/api/v1/auth/change-password"
  );

  const handleEditSubmit = async (data: any) => {
    try {
      await updateUser(data);
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (data: any) => {
    try {
      await changePassword(data);
      toast.success("Password changed successfully!");
      setIsChangePasswordModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="container mx-auto space-y-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8">
            <div className="h-8 w-64 bg-white/20 rounded-lg animate-pulse"></div>
            <div className="h-4 w-96 bg-white/20 mt-2 rounded-lg animate-pulse"></div>
          </div>
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
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600">
            Failed to load your profile information.
          </p>
        </Card>
      </div>
    );
  }

  const profileUser = userData.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="container mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
          <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20'></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white/20">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${profileUser.name}`}
                  alt={profileUser.name}
                />
                <AvatarFallback className="bg-white/20 text-white text-3xl font-bold">
                  {profileUser.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{profileUser.name}</h1>
                <p className="text-blue-100 text-lg capitalize">
                  {profileUser.role}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    {profileUser.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    Member since{" "}
                    {format(new Date(profileUser?.createdAt), "MMMM yyyy")}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 cursor-pointer"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Pencil className="h-5 w-5 mr-2" />
              Edit Profile 1
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <UserIcon className="h-6 w-6 text-blue-500" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your personal details and account information
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
                          {profileUser.email}
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
                          {profileUser.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Phone Number
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {profileUser.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Member Since
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {format(
                            new Date(profileUser.createdAt),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Account Status & Quick Actions */}
          <div className="space-y-6">
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
                    <UserIcon className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Role</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {profileUser.role}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">Status</span>
                  </div>
                  <Badge
                    variant={profileUser.is_active ? "success" : "destructive"}
                  >
                    {profileUser.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-between bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white cursor-pointer"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                >
                  Change Password
                  <Settings className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
              <UpdateProfileForm
                onSubmit={handleEditSubmit}
                onClose={() => setIsEditModalOpen(false)}
                initialData={profileUser}
              />
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {isChangePasswordModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
              <ChangePasswordForm
                onSubmit={handleChangePassword}
                onClose={() => setIsChangePasswordModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
