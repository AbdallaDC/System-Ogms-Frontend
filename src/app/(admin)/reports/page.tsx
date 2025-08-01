"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFetch } from "@/hooks/useApi";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CreditCard,
  Phone,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronsUpDown,
  CalendarIcon,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { UserListResponse, User } from "@/types/User";
import type { ServiceListResponse } from "@/types/Service";
import PaymentReportTable, {
  defaultQuery,
} from "./components/PaymentReportTable";
import PaymentReportChart from "./components/PaymentReportChart";
import BookingReportTable, {
  defaultBookingQuery,
} from "./components/BookingReportTable";
import BookingReportChart from "./components/BookingReportChart";

export interface PaymentResponse {
  status: string;
  count: number;
  totalAmount: number;
  data: PaymentRecord[];
}

export interface PaymentRecord {
  _id: string;
  orderId: string | null;
  issuerTransactionId: string | null;
  accountType: string | null;
  payment_id: string;
  user_id: UserInfo;
  service_id: ServiceInfo;
  booking_id: string;
  phone: string | null;
  method: string | null;
  item_price: number;
  labour_fee: number;
  amount: number;
  status: string;
  description: string | null;
  referenceId: string;
  transactionId: string | null;
  responseMessage: string | null;
  paid_at: string | null;
  inventoryItems: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  id: string;
}

export interface ServiceInfo {
  _id: string;
  service_name: string;
  id: string;
}

export interface BookingResponse {
  status: string;
  count: number;
  data: BookingRecord[];
}

export interface BookingRecord {
  booking_id: string;
  customer: Customer | null;
  service: Service;
  status: string;
  createdAt: string;
  mechanic: Mechanic | null;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  id: string;
}

export interface Service {
  _id: string;
  service_name: string;
  price: number;
  id: string;
}

export interface Mechanic {
  _id: string;
  name: string;
  email: string;
  id: string;
}

const ReportPage = () => {
  // Filters state for payment report
  const [query, setQuery] = useState(defaultQuery);
  const [tempQuery, setTempQuery] = useState(defaultQuery);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [servicePopoverOpen, setServicePopoverOpen] = useState(false);
  const [fromPopoverOpen, setFromPopoverOpen] = useState(false);
  const [toPopoverOpen, setToPopoverOpen] = useState(false);

  // Filters state for booking report
  const [bookingQuery, setBookingQuery] = useState(defaultBookingQuery);
  const [bookingTempQuery, setBookingTempQuery] = useState(defaultBookingQuery);
  const [customerPopoverOpen, setCustomerPopoverOpen] = useState(false);
  const [mechanicPopoverOpen, setMechanicPopoverOpen] = useState(false);
  const [bookingServicePopoverOpen, setBookingServicePopoverOpen] =
    useState(false);
  const [bookingFromPopoverOpen, setBookingFromPopoverOpen] = useState(false);
  const [bookingToPopoverOpen, setBookingToPopoverOpen] = useState(false);

  // Fetch user and service options
  const { data: usersData } = useFetch<UserListResponse>("/api/v1/users");
  const { data: servicesData } =
    useFetch<ServiceListResponse>("/api/v1/services");

  // Build query string for endpoint
  const buildQueryString = (params: Record<string, string>) => {
    return Object.entries(params)
      .filter(([_, v]) => v && v !== "all")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
  };
  const queryString = buildQueryString(query);

  const handleApplyFilters = () => setQuery({ ...tempQuery });
  const handleClearFilters = () => {
    setQuery(defaultQuery);
    setTempQuery(defaultQuery);
  };

  const handleApplyBookingFilters = () =>
    setBookingQuery({ ...bookingTempQuery });
  const handleClearBookingFilters = () => {
    setBookingQuery(defaultBookingQuery);
    setBookingTempQuery(defaultBookingQuery);
  };

  // Helper for user/service display
  const getUserName = (id: string) =>
    id === "all"
      ? "All"
      : usersData?.users.find((u) => u._id === id)?.name || "";
  const getServiceName = (id: string) =>
    id === "all"
      ? "All"
      : servicesData?.services.find((s) => s._id === id)?.service_name || "";

  const bookingQueryString = buildQueryString(bookingQuery);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <Tabs defaultValue="booking" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="booking">Booking Report</TabsTrigger>
          <TabsTrigger value="transactions">Transactions Report</TabsTrigger>
        </TabsList>
        <TabsContent value="booking">
          <h2 className="text-xl font-semibold mb-4">Booking Report</h2>
          <Tabs defaultValue="table" className="w-full mb-4">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Report by Table</TabsTrigger>
              <TabsTrigger value="chart">Report by Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <BookingReportTable
                query={bookingQuery}
                tempQuery={bookingTempQuery}
                setTempQuery={setBookingTempQuery}
                handleApplyFilters={handleApplyBookingFilters}
                handleClearFilters={handleClearBookingFilters}
                customerPopoverOpen={customerPopoverOpen}
                setCustomerPopoverOpen={setCustomerPopoverOpen}
                mechanicPopoverOpen={mechanicPopoverOpen}
                setMechanicPopoverOpen={setMechanicPopoverOpen}
                servicePopoverOpen={bookingServicePopoverOpen}
                setServicePopoverOpen={setBookingServicePopoverOpen}
                fromPopoverOpen={bookingFromPopoverOpen}
                setFromPopoverOpen={setBookingFromPopoverOpen}
                toPopoverOpen={bookingToPopoverOpen}
                setToPopoverOpen={setBookingToPopoverOpen}
              />
            </TabsContent>
            <TabsContent value="chart">
              <BookingReportChart queryString={bookingQueryString} />
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="transactions">
          <h2 className="text-xl font-semibold mb-4">Transactions Report</h2>
          <Tabs defaultValue="table" className="w-full mb-4">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Report by Table</TabsTrigger>
              <TabsTrigger value="chart">Report by Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <PaymentReportTable
                query={query}
                tempQuery={tempQuery}
                setTempQuery={setTempQuery}
                handleApplyFilters={handleApplyFilters}
                handleClearFilters={handleClearFilters}
                userPopoverOpen={userPopoverOpen}
                setUserPopoverOpen={setUserPopoverOpen}
                servicePopoverOpen={servicePopoverOpen}
                setServicePopoverOpen={setServicePopoverOpen}
                fromPopoverOpen={fromPopoverOpen}
                setFromPopoverOpen={setFromPopoverOpen}
                toPopoverOpen={toPopoverOpen}
                setToPopoverOpen={setToPopoverOpen}
              />
            </TabsContent>
            <TabsContent value="chart">
              <PaymentReportChart queryString={queryString} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportPage;
