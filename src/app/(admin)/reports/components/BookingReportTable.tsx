import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useApi";
import type { ServiceListResponse } from "@/types/Service";
import type { UserListResponse } from "@/types/User";
import { generateBookingReportPdf } from "@/utils/generateBookingReportPdf";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import React from "react";
export interface BookingResponse {
  status: string;
  count: number;
  data: BookingRecord[];
}

export interface BookingRecord {
  _id: string;
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

export const defaultBookingQuery = {
  status: "all",
  customer: "all",
  mechanic: "all",
  service: "all",
  from: "",
  to: "",
};

interface BookingReportTableProps {
  query: typeof defaultBookingQuery;
  tempQuery: typeof defaultBookingQuery;
  setTempQuery: React.Dispatch<
    React.SetStateAction<typeof defaultBookingQuery>
  >;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  customerPopoverOpen: boolean;
  setCustomerPopoverOpen: (open: boolean) => void;
  mechanicPopoverOpen: boolean;
  setMechanicPopoverOpen: (open: boolean) => void;
  servicePopoverOpen: boolean;
  setServicePopoverOpen: (open: boolean) => void;
  fromPopoverOpen: boolean;
  setFromPopoverOpen: (open: boolean) => void;
  toPopoverOpen: boolean;
  setToPopoverOpen: (open: boolean) => void;
}

const BookingReportTable: React.FC<BookingReportTableProps> = ({
  query,
  tempQuery,
  setTempQuery,
  handleApplyFilters,
  handleClearFilters,
  customerPopoverOpen,
  setCustomerPopoverOpen,
  mechanicPopoverOpen,
  setMechanicPopoverOpen,
  servicePopoverOpen,
  setServicePopoverOpen,
  fromPopoverOpen,
  setFromPopoverOpen,
  toPopoverOpen,
  setToPopoverOpen,
}) => {
  // Fetch options
  const { data: customersData } = useFetch<UserListResponse>("/api/v1/users");
  const { data: mechanicsData } = useFetch<UserListResponse>(
    "/api/v1/users/role/mechanic"
  );
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
  const endpoint = `/api/v1/bookings/report${
    queryString ? `?${queryString}` : ""
  }`;
  const { data, isLoading, error } = useFetch<BookingResponse>(endpoint);

  // Table columns
  const columns: ColumnDef<BookingRecord>[] = [
    {
      accessorKey: "booking_date",
      header: "Date",
      cell: ({ row }) =>
        row.original.createdAt
          ? format(new Date(row.original.createdAt), "yyyy-MM-dd")
          : "-",
    },
    {
      accessorKey: "booking_id",
      header: "Booking ID",
    },
    {
      accessorKey: "customer_id",
      header: "Customer",
      cell: ({ row }) => row.original.customer?.name || "-",
    },
    {
      accessorKey: "service_id",
      header: "Service",
      cell: ({ row }) => row.original.service?.service_name || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color =
          status === "completed"
            ? "success"
            : status === "assigned"
            ? "default"
            : status === "pending"
            ? "warning"
            : status === "cancelled"
            ? "destructive"
            : "outline";
        return <Badge variant={color}>{status}</Badge>;
      },
    },
  ];

  // Helper for display
  const getCustomerName = (id: string) =>
    id === "all"
      ? "All"
      : customersData?.users.find((u) => u._id === id)?.name || "";
  const getMechanicName = (id: string) =>
    id === "all"
      ? "All"
      : mechanicsData?.users.find((u) => u._id === id)?.name || "";
  const getServiceName = (id: string) =>
    id === "all"
      ? "All"
      : servicesData?.services.find((s) => s._id === id)?.service_name || "";

  return (
    <div>
      {/* Download PDF Button */}
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            if (data?.data) {
              generateBookingReportPdf(data.data as BookingRecord[], query);
            }
          }}
        >
          Download PDF
        </Button>
      </div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        {/* Status Select */}
        <div>
          <Label>Status</Label>
          <Select
            value={tempQuery.status}
            onValueChange={(value) =>
              setTempQuery((q) => ({ ...q, status: value }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Customer Combobox */}
        <div>
          <Label>Customer</Label>
          <Popover
            open={customerPopoverOpen}
            onOpenChange={setCustomerPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-48 justify-between"
              >
                {getCustomerName(tempQuery.customer) || "Select customer"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput placeholder="Search customers..." />
                <CommandList>
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key="all"
                      value="All"
                      onSelect={() => {
                        setTempQuery((q) => ({ ...q, customer: "all" }));
                        setCustomerPopoverOpen(false);
                      }}
                    >
                      All
                    </CommandItem>
                    {customersData?.users.map((user) => (
                      <CommandItem
                        key={user._id}
                        value={user.name}
                        onSelect={() => {
                          setTempQuery((q) => ({ ...q, customer: user._id }));
                          setCustomerPopoverOpen(false);
                        }}
                      >
                        {user.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {/* Mechanic Combobox */}
        <div>
          <Label>Mechanic</Label>
          <Popover
            open={mechanicPopoverOpen}
            onOpenChange={setMechanicPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-48 justify-between"
              >
                {getMechanicName(tempQuery.mechanic) || "Select mechanic"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput placeholder="Search mechanics..." />
                <CommandList>
                  <CommandEmpty>No mechanic found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key="all"
                      value="All"
                      onSelect={() => {
                        setTempQuery((q) => ({ ...q, mechanic: "all" }));
                        setMechanicPopoverOpen(false);
                      }}
                    >
                      All
                    </CommandItem>
                    {mechanicsData?.users.map((user) => (
                      <CommandItem
                        key={user._id}
                        value={user.name}
                        onSelect={() => {
                          setTempQuery((q) => ({ ...q, mechanic: user._id }));
                          setMechanicPopoverOpen(false);
                        }}
                      >
                        {user.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {/* Service Combobox */}
        <div>
          <Label>Service</Label>
          <Popover
            open={servicePopoverOpen}
            onOpenChange={setServicePopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-48 justify-between"
              >
                {getServiceName(tempQuery.service) || "Select service"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput placeholder="Search services..." />
                <CommandList>
                  <CommandEmpty>No service found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key="all"
                      value="All"
                      onSelect={() => {
                        setTempQuery((q) => ({ ...q, service: "all" }));
                        setServicePopoverOpen(false);
                      }}
                    >
                      All
                    </CommandItem>
                    {servicesData?.services.map((service) => (
                      <CommandItem
                        key={service._id}
                        value={service.service_name}
                        onSelect={() => {
                          setTempQuery((q) => ({ ...q, service: service._id }));
                          setServicePopoverOpen(false);
                        }}
                      >
                        {service.service_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {/* From Date Picker */}
        <div>
          <Label>From</Label>
          <Popover open={fromPopoverOpen} onOpenChange={setFromPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-36 justify-start text-left font-normal"
              >
                {tempQuery.from
                  ? format(new Date(tempQuery.from), "PPP")
                  : "Pick a date"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePicker
                mode="single"
                selected={tempQuery.from ? new Date(tempQuery.from) : undefined}
                onSelect={(date) => {
                  setTempQuery((q) => ({
                    ...q,
                    from: date ? format(date, "yyyy-MM-dd") : "",
                  }));
                  setFromPopoverOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* To Date Picker */}
        <div>
          <Label>To</Label>
          <Popover open={toPopoverOpen} onOpenChange={setToPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-36 justify-start text-left font-normal"
              >
                {tempQuery.to
                  ? format(new Date(tempQuery.to), "PPP")
                  : "Pick a date"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePicker
                mode="single"
                selected={tempQuery.to ? new Date(tempQuery.to) : undefined}
                onSelect={(date) => {
                  setTempQuery((q) => ({
                    ...q,
                    to: date ? format(date, "yyyy-MM-dd") : "",
                  }));
                  setToPopoverOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleApplyFilters} className="h-9">
          Apply
        </Button>
        <Button onClick={handleClearFilters} variant="outline" className="h-9">
          Clear
        </Button>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={data?.data || []}
          // filterColumnId="customer_id"
          // filterPlaceholder="Search by customer name..."
          showRowSelection={true}
          showActionButtons={false}
          title="Booking Report"
          description="Detailed booking report with filters"
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>
    </div>
  );
};

export default BookingReportTable;
