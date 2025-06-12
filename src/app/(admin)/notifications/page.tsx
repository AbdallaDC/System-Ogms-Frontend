"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_BASE_URL, useFetch } from "@/hooks/useApi";
import type { NotificationListResponse } from "@/types/Notification";
import {
  Bell,
  BookMarkedIcon as MarkAsRead,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "@/components/notification-item";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { getUser } from "@/utils/getUser";
import { useEffect } from "react";
export default function NotificationsPage() {
  const token = getUser()?.token;
  const {
    data: notificationsData,
    isLoading,
    mutate,
  } = useFetch<NotificationListResponse>("/api/v1/notifications");

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.seen).length;
  const readCount = notifications.filter((n) => n.seen).length;

  const getNotificationsByType = (type: string) => {
    return notifications.filter((n) => n.type === type);
  };

  const getTypeStats = () => {
    return {
      info: getNotificationsByType("info").length,
      warning: getNotificationsByType("warning").length,
      success: getNotificationsByType("success").length,
      error: getNotificationsByType("error").length,
    };
  };

  const typeStats = getTypeStats();

  // useEffect(() => {
  //   if (notificationsData?.notifications.length === 0) return;
  //   const interval = setInterval(() => {
  //     mutate();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [mutate]);

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/notifications/all/seen`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        // Refresh notifications data
        mutate();
      } else {
        toast.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const clearAllNotifications = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/notifications/delete/all`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
      toast.error("Failed to clear all notifications");
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
  //       <div className="space-y-6">
  //         <Skeleton className="h-8 w-48" />
  //         <div className="grid gap-6 md:grid-cols-4">
  //           {[1, 2, 3, 4].map((i) => (
  //             <Skeleton key={i} className="h-24 rounded-xl" />
  //           ))}
  //         </div>
  //         <Skeleton className="h-96 rounded-xl" />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Stay updated with your garage activities
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={markAllAsRead}
              >
                <MarkAsRead className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            )}
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={clearAllNotifications}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{notifications.length}</div>
              <div className="text-sm text-blue-100">{unreadCount} unread</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-100 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{typeStats.warning}</div>
              <div className="text-sm text-amber-100">Needs attention</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-100 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{typeStats.info}</div>
              <div className="text-sm text-cyan-100">General updates</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{typeStats.success}</div>
              <div className="text-sm text-emerald-100">Completed tasks</div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              All Notifications
            </CardTitle>
            <CardDescription>
              Manage your notifications and stay updated
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="p-4 border-b">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">
                    All ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="info">
                    Info ({typeStats.info})
                  </TabsTrigger>
                  <TabsTrigger value="warning">
                    Warning ({typeStats.warning})
                  </TabsTrigger>
                  <TabsTrigger value="success">
                    Success ({typeStats.success})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div key={notification._id}>
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={() => mutate()}
                        showMarkAsRead={true}
                      />
                      {index < notifications.length - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="unread" className="p-4 space-y-3">
                {notifications
                  .filter((n) => !n.seen)
                  .map((notification, index) => (
                    <div key={notification._id}>
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={() => mutate()}
                        showMarkAsRead={true}
                      />
                      {index <
                        notifications.filter((n) => !n.seen).length - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="info" className="p-4 space-y-3">
                {getNotificationsByType("info").map((notification, index) => (
                  <div key={notification._id}>
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={() => mutate()}
                      showMarkAsRead={true}
                    />
                    {index < getNotificationsByType("info").length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="warning" className="p-4 space-y-3">
                {getNotificationsByType("warning").map(
                  (notification, index) => (
                    <div key={notification._id}>
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={() => mutate()}
                        showMarkAsRead={true}
                      />
                      {index < getNotificationsByType("warning").length - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  )
                )}
              </TabsContent>

              <TabsContent value="success" className="p-4 space-y-3">
                {getNotificationsByType("success").map(
                  (notification, index) => (
                    <div key={notification._id}>
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={() => mutate()}
                        showMarkAsRead={true}
                      />
                      {index < getNotificationsByType("success").length - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
