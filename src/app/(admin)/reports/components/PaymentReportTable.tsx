import React, { useState } from "react";
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
import type { ServiceListResponse, Service } from "@/types/Service";
import { generatePaymentReportPdf } from "@/utils/generatePaymentReportPdf";

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

export const defaultQuery = {
  user: "",
  status: "",
  from: "",
  to: "",
  service: "",
  phone: "",
};

interface PaymentReportTableProps {
  query: typeof defaultQuery;
  tempQuery: typeof defaultQuery;
  setTempQuery: React.Dispatch<React.SetStateAction<typeof defaultQuery>>;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  userPopoverOpen: boolean;
  setUserPopoverOpen: (open: boolean) => void;
  servicePopoverOpen: boolean;
  setServicePopoverOpen: (open: boolean) => void;
  fromPopoverOpen: boolean;
  setFromPopoverOpen: (open: boolean) => void;
  toPopoverOpen: boolean;
  setToPopoverOpen: (open: boolean) => void;
}

const PaymentReportTable: React.FC<PaymentReportTableProps> = ({
  query,
  tempQuery,
  setTempQuery,
  handleApplyFilters,
  handleClearFilters,
  userPopoverOpen,
  setUserPopoverOpen,
  servicePopoverOpen,
  setServicePopoverOpen,
  fromPopoverOpen,
  setFromPopoverOpen,
  toPopoverOpen,
  setToPopoverOpen,
}) => {
  // Fetch user and service options
  const { data: usersData } = useFetch<UserListResponse>("/api/v1/users");
  const { data: servicesData } =
    useFetch<ServiceListResponse>("/api/v1/services");

  // Build query string for endpoint
  const buildQueryString = (params: Record<string, string>) => {
    return Object.entries(params)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
  };

  const queryString = buildQueryString(query);
  const endpoint = `/api/v1/payments/report${
    queryString ? `?${queryString}` : ""
  }`;
  const { data, isLoading, error } = useFetch<PaymentResponse>(endpoint);

  // Table columns (unchanged)
  const columns: ColumnDef<PaymentRecord>[] = [
    {
      accessorKey: "user_id",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original.user_id;
        return (
          <div>
            <div className="font-medium text-gray-900">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "service_id",
      header: "Service",
      cell: ({ row }) => {
        const service = row.original.service_id;
        return (
          <div>
            <div className="font-medium text-gray-900">
              {service?.service_name}
            </div>
            <div className="text-xs text-gray-500">ID: {service?.id}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-500" />
          <span className="font-bold text-emerald-600">
            ${row.original.amount.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.phone && <Phone className="h-4 w-4 text-blue-500" />}
          <span className="font-mono text-sm">
            {row.original.phone || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {row.original.method && <CreditCard className="h-3 w-3 mr-1" />}
          {row.original.method || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const getStatusIcon = (status: string) => {
          switch (status?.toLowerCase()) {
            case "success":
            case "completed":
            case "paid":
              return <CheckCircle className="h-4 w-4 text-emerald-500" />;
            case "pending":
              return <Clock className="h-4 w-4 text-amber-500" />;
            case "failed":
            case "cancelled":
              return <XCircle className="h-4 w-4 text-red-500" />;
            default:
              return <AlertTriangle className="h-4 w-4 text-gray-500" />;
          }
        };
        const getStatusVariant = (status: string) => {
          switch (status?.toLowerCase()) {
            case "success":
            case "completed":
            case "paid":
              return "success";
            case "pending":
              return "warning";
            case "failed":
            case "cancelled":
              return "destructive";
            default:
              return "outline";
          }
        };
        return (
          <Badge
            variant={getStatusVariant(status)}
            className="flex items-center gap-1 w-fit"
          >
            {getStatusIcon(status)}
            {status === "failed" ? "Cancelled" : status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "paid_at",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <div className="font-medium">
              {row.original.paid_at
                ? format(new Date(row.original.paid_at), "MMM d, yyyy")
                : "-"}
            </div>
            <div className="text-xs text-gray-500">
              {row.original.paid_at
                ? format(new Date(row.original.paid_at), "h:mm a")
                : "-"}
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Filter handlers
  // const handleApplyFilters = () => setQuery({ ...tempQuery });
  // const handleClearFilters = () => {
  //   setQuery(defaultQuery);
  //   setTempQuery(defaultQuery);
  // };

  // Helper for user/service display
  const getUserName = (id: string) =>
    usersData?.users.find((u) => u._id === id)?.name || "";
  const getServiceName = (id: string) =>
    servicesData?.services.find((s) => s._id === id)?.service_name || "";

  return (
    <div>
      {/* Download PDF Button */}
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            if (data?.data) {
              generatePaymentReportPdf(data.data, query);
            }
          }}
        >
          Download PDF
        </Button>
      </div>
      {/* Filter bar and DataTable */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        {/* User Combobox */}
        <div>
          <Label>User</Label>
          <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-48 justify-between"
              >
                {getUserName(tempQuery.user) || "Select user"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput placeholder="Search users..." />
                <CommandList>
                  <CommandEmpty>No user found.</CommandEmpty>
                  <CommandGroup>
                    {usersData?.users.map((user) => (
                      <CommandItem
                        key={user._id}
                        value={user.name}
                        onSelect={() => {
                          setTempQuery((q) => ({ ...q, user: user._id }));
                          setUserPopoverOpen(false);
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
                    {servicesData?.services.map((service) => (
                      <CommandItem
                        key={service._id}
                        value={service.service_name}
                        onSelect={() => {
                          setTempQuery((q) => ({
                            ...q,
                            service: service._id,
                          }));
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
        {/* Status Select */}
        {/* <div>
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="fail">Fail</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        {/* Phone Input */}
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={tempQuery.phone}
            onChange={(e) =>
              setTempQuery((q) => ({ ...q, phone: e.target.value }))
            }
            className="w-40"
            placeholder="Phone"
          />
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
          filterColumnId="user_id"
          filterPlaceholder="Search by customer name..."
          showRowSelection={true}
          showActionButtons={false}
          title="Payment Report"
          description="Detailed payment transactions report with filters"
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>
    </div>
  );
};

export default PaymentReportTable;
