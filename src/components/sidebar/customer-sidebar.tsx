"use client";

import {
  Car,
  Calendar,
  Settings,
  FileText,
  User,
  CreditCard,
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export function CustomerSidebar() {
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push("/");
  };
  const [activeItem, setActiveItem] = useState("cutomer-dashboard");
  return (
    <Sidebar>
      {/* Sidebar Header with Logo */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Garage Portal</span>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        {/* My Garage Section */}
        <SidebarGroup>
          <SidebarGroupLabel>My Garage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Dashboard"
                  isActive={activeItem === "cutomer-dashboard"}
                  onClick={() => setActiveItem("cutomer-dashboard")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/customer">
                    <FileText className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="My Vehicles"
                  isActive={activeItem === "my-vehicles"}
                  onClick={() => setActiveItem("my-vehicles")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/customer/vehicles">
                    <Car className="h-5 w-5" />
                    <span>My Vehicles</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="My Bookings"
                  isActive={activeItem === "my-bookings"}
                  onClick={() => setActiveItem("my-bookings")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/customer/bookings">
                    <Calendar className="h-5 w-5" />
                    <span>My Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Services Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Book Service"
                  isActive={activeItem === "book-service"}
                  onClick={() => setActiveItem("book-service")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/customer/book">
                    <Calendar className="h-5 w-5" />
                    <span>Book Service</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Service History"
                  isActive={activeItem === "service-history"}
                  onClick={() => setActiveItem("service-history")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/customer/history">
                    <FileText className="h-5 w-5" />
                    <span>Service History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Payments"
                  isActive={activeItem === "payments"}
                  onClick={() => setActiveItem("payments")}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/customer/payments">
                    <CreditCard className="h-5 w-5" />
                    <span>Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Account and Theme Toggle */}
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Profile"
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/customer/profile">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Settings"
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/customer/settings">
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
