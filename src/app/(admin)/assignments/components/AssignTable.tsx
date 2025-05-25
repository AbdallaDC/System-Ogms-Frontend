// components/services-table.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table";
import { Vehicle } from "@/types/Vehicle";
import { Booking } from "@/types/Booking";
import { format } from "date-fns";
import { Assign } from "@/types/Assign";

export const columns: ColumnDef<Assign>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "userName",
    header: "Assigned User",
    accessorFn: (row) => row.user_id.name || "N/A", // Handle potential undefined values
    cell: ({ row }) => {
      const userName = row.getValue("userName") as string | undefined;

      return <div className="">{userName ? userName : "N/A"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      // Define color classes for different statuses
      let bgColor = "bg-gray-200";
      let textColor = "text-gray-800";
      switch (status?.toLowerCase()) {
        case "pending":
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-800";
          break;
        case "confirmed":
          bgColor = "bg-blue-100";
          textColor = "text-blue-800";
          break;
        case "completed":
          bgColor = "bg-green-100";
          textColor = "text-green-800";
          break;
        case "cancelled":
        case "canceled":
          bgColor = "bg-red-100";
          textColor = "text-red-800";
          break;
        default:
          bgColor = "bg-gray-200";
          textColor = "text-gray-800";
      }
      return (
        <div
          className={`inline-block px-3 py-1 rounded-full font-medium text-xs ${bgColor} ${textColor}`}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "bookingDate",
    header: "Booking Date",
    accessorFn: (row) => row.booking_id?.booking_date || "N/A", // Handle potential undefined values
    cell: ({ row }) => {
      const bookingDate = row.getValue("bookingDate") as string | undefined;
      console.log("Owner Name:", bookingDate);

      return (
        <div className="">
          {bookingDate
            ? format(new Date(bookingDate), "MMM dd, yyyy, h:mm a")
            : ""}
        </div>
      );
    },
  },

  {
    id: "serviceName",
    header: "Service",
    accessorFn: (row) => row.booking_id?.service_id.service_name || "N/A", // Handle potential undefined values
    cell: ({ row }) => {
      const serviceName = row.getValue("serviceName") as string | undefined;
      console.log("Owner Name:", serviceName);

      return <div className="">{serviceName ? serviceName : "N/A"}</div>;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const service = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(service._id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface AssignTableProps {
  data: Assign[];
}

export default function AssignTable({ data }: AssignTableProps) {
  const handleExportSelected = (selectedAssigns: Assign[]) => {
    console.log("Export selected:", selectedAssigns);
    // Implement your export logic here
  };

  const handleDeleteSelected = (selectedAssigns: Assign[]) => {
    console.log("Delete selected:", selectedAssigns);
    // Implement your delete logic here
  };

  const handleExportAll = (allAssignments: Assign[]) => {
    console.log("Export all:", allAssignments);
    // Implement your export all logic here
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumnId="userName"
      filterPlaceholder="filter user"
      showActionButtons
      onExportSelected={handleExportSelected}
      onDeleteSelected={handleDeleteSelected}
      onExportAll={handleExportAll}
    />
  );
}
