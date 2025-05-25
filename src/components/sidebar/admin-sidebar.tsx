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
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/utils/logout";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export function AdminSidebar() {
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push("/");
  };
  const [activeItem, setActiveItem] = useState("admin-dashboard");
  return (
    <Sidebar>
      {/* Sidebar Header with Logo */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Garage Admin</span>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        {/* Dashboard Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Dashboard"
                  isActive={activeItem === "admin-dashboard"}
                  onClick={() => setActiveItem("admin-dashboard")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/admin-dashboard">
                    <BarChart className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Services"
                  isActive={activeItem === "services"}
                  onClick={() => setActiveItem("services")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/services">
                    <Wrench className="h-5 w-5" />
                    <span>Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Vehicles"
                  isActive={activeItem === "vehicles"}
                  onClick={() => setActiveItem("vehicles")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/vehicles">
                    <Car className="h-5 w-5" />
                    <span>Vehicles</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Bookings"
                  isActive={activeItem === "bookings"}
                  onClick={() => setActiveItem("bookings")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/bookings">
                    <Calendar className="h-5 w-5" />
                    <span>Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Assignments"
                  isActive={activeItem === "assignments"}
                  onClick={() => setActiveItem("assignments")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/assignments">
                    <UserCheck className="h-5 w-5" />
                    <span>Assignments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Customers"
                  isActive={activeItem === "customers"}
                  onClick={() => setActiveItem("customers")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/customers">
                    <Users className="h-5 w-5" />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Settings and Theme Toggle */}
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Preferences</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Settings"
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ThemeToggle />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Logout"
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <button onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
