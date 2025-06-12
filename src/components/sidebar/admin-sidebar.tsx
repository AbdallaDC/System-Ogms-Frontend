"use client";

import {
  Car,
  Calendar,
  Settings,
  Wrench,
  UserCheck,
  Users,
  BarChart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Home,
  Sparkles,
  DollarSign,
  Package,
  Store,
} from "lucide-react";
import { logout } from "@/utils/logout";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/utils/getUser";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "../notification-bell";
import { NotificationListResponse } from "@/types/Notification";
import { useFetch } from "@/hooks/useApi";

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [mounted, setMounted] = useState(false);

  // Get user data
  const userData = getUser();
  const { user_id, name, email, phone, role } = userData?.user;

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Menu items configuration
  const menuItems = [
    {
      group: "Dashboard",
      items: [
        {
          name: "Dashboard",
          icon: <BarChart className="h-5 w-5" />,
          path: "/admin-dashboard",
          badge: null,
        },
        // {
        //   name: "Home",
        //   icon: <Home className="h-5 w-5" />,
        //   path: "/",
        //   badge: null,
        // },
      ],
    },
    {
      group: "Management",
      items: [
        {
          name: "Services",
          icon: <Wrench className="h-5 w-5" />,
          path: "/services",
          badge: null,
        },
        // {
        //   name: "Vehicles",
        //   icon: <Car className="h-5 w-5" />,
        //   path: "/vehicles",
        //   badge: null,
        // },
        {
          name: "Bookings",
          icon: <Calendar className="h-5 w-5" />,
          path: "/bookings",
          badge: null,
        },
        {
          name: "Assignments",
          icon: <UserCheck className="h-5 w-5" />,
          path: "/assignments",
          badge: null,
        },
        {
          name: "Users",
          icon: <Users className="h-5 w-5" />,
          path: "/users",
          badge: null,
        },
        {
          name: "Transactions",
          icon: <DollarSign className="h-5 w-5" />,
          path: "/transactions",
          badge: null,
        },
        {
          name: "Inventories",
          icon: <Package className="h-5 w-5" />,
          path: "/inventories",
          badge: null,
        },
      ],
    },
    {
      group: "Preferences",
      items: [
        {
          name: "Settings",
          icon: <Settings className="h-5 w-5" />,
          path: "/settings",
          badge: null,
        },
        // {
        //   name: "Notifications",
        //   icon: <Bell className="h-5 w-5" />,
        //   path: "/notifications",
        //   badge: notifications,
        // },
      ],
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative h-screen transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64",
        "bg-blue-50/90 backdrop-blur-md border-r border-blue-200"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Sidebar Header with Logo and Notifications */}
      <div className="flex h-16 items-center justify-between border-b border-blue-200 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
            <Car className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-blue-800">
                Garage Pro
              </span>
              <span className="text-xs text-blue-600">Admin Portal</span>
            </div>
          )}
        </div>
        {!collapsed && <NotificationBell />}
      </div>

      {/* User Profile */}
      <div
        className={cn(
          "relative my-4 px-4 transition-all duration-300",
          collapsed ? "flex justify-center" : "block"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-3 transition-all duration-300",
            collapsed ? "justify-center" : "bg-white/60 hover:bg-white/80"
          )}
        >
          <Avatar className="h-10 w-10 border-2 border-blue-200">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
              alt={name}
            />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              {name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate font-medium text-blue-900">{name}</span>
              <span className="truncate text-xs text-blue-700">{email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="custom-scrollbar h-[calc(100vh-13rem)] overflow-y-auto px-3">
        {menuItems.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {!collapsed && (
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-blue-800">
                {group.group}
              </h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item, itemIndex) => {
                const isActive = pathname === item.path;
                return (
                  <li key={itemIndex}>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.path}
                            className={cn(
                              "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out",
                              isActive
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                                : "text-blue-800 hover:bg-white/60",
                              collapsed && "justify-center"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
                                isActive
                                  ? "bg-white/20"
                                  : "bg-white/60 group-hover:bg-white/80"
                              )}
                            >
                              {item.icon}
                            </div>
                            {!collapsed && (
                              <>
                                <span className="flex-1 font-medium">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <Badge
                                    className={cn(
                                      "h-5 min-w-5 justify-center rounded-full px-1.5",
                                      isActive
                                        ? "bg-white/20 text-white hover:bg-white/30"
                                        : "bg-blue-500 text-white"
                                    )}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </>
                            )}
                            {collapsed && item.badge && (
                              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-blue-500 px-1.5 text-white">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right">
                            {item.name}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-blue-200 bg-white/60 p-4">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className={cn(
                  "w-full justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
                  collapsed ? "px-2" : ""
                )}
              >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span className="font-medium">Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute bottom-20 left-4 h-24 w-24 animate-pulse opacity-20">
        <Sparkles className="h-full w-full text-cyan-500" />
      </div>
      <div className="pointer-events-none absolute right-4 top-20 h-16 w-16 animate-pulse opacity-20">
        <Sparkles className="h-full w-full text-blue-500" />
      </div>
    </div>
  );
}
