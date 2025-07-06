"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/useApi";
import { API_BASE_URL } from "@/lib/config";

import type { NotificationListResponse } from "@/types/Notification";
import { NotificationItem } from "./notification-item";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import toast from "react-hot-toast";
import { getUser } from "@/utils/getUser";
import { useEffect } from "react";

export function NotificationBell() {
  const token = getUser()?.token;

  const {
    data: notificationsData,
    isLoading,
    mutate,
  } = useFetch<NotificationListResponse>("/api/v1/notifications");

  const unreadCount =
    notificationsData?.notifications.filter((n) => !n.seen).length || 0;
  const notifications = notificationsData?.notifications || [];

  // Show only first 3 notifications
  const displayNotifications = notifications.slice(0, 3);

  // fetch notifications every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 5000);

    return () => clearInterval(interval);
  }, [mutate]);

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
        >
          <Bell className="h-5 w-5 text-blue-700" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-red-500 px-1.5 text-xs text-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0 bg-white/95 backdrop-blur-md border border-blue-200 shadow-xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-100">
          <h3 className="font-semibold text-blue-900">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {unreadCount} new
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 px-2"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-80">
          {/* {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-blue-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-blue-50 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : */}
          {displayNotifications.length === 0 ? (
            <div className="p-8 text-center text-blue-600">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="p-2">
              {displayNotifications.map((notification, index) => (
                <div key={notification._id}>
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={() => mutate()}
                    showMarkAsRead={true}
                  />
                  {index < displayNotifications.length - 1 && (
                    <Separator className="my-1 bg-blue-100" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t mt-5 border-blue-100">
            <Button
              variant="ghost"
              className="w-full text-blue-600 hover:bg-blue-50"
              size="sm"
              asChild
            >
              <Link href="/notifications">
                See All Notifications ({notifications.length})
              </Link>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
