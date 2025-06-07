// components/services-table.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Delete, MoreHorizontal } from "lucide-react";
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
import { Booking, BookingListResponse } from "@/types/Booking";
import { format } from "date-fns";
import BookingForm from "./BookingForm";
import { useDelete, usePost } from "@/hooks/useApi";
import toast from "react-hot-toast";
import Link from "next/link";

interface BookingTableProps {
  data: Booking[];
}

export default function BookingTable({ data }: BookingTableProps) {
  const { postData } = usePost<Booking, BookingListResponse>(
    "/api/v1/bookings",
    "/api/v1/bookings"
  );

  const { deleteData } = useDelete(`/api/v1/bookings/`, "/api/v1/bookings");

  const columns: ColumnDef<Booking>[] = [
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
      accessorKey: "booking_id",
      header: "ID",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("booking_id")}</div>
      ),
    },
    {
      id: "userName",
      header: "User",
      accessorFn: (row) => row.user_id?.name || "N/A", // Handle potential undefined values
      cell: ({ row }) => {
        const userName = row.getValue("userName") as string | undefined;

        return <div className="">{userName}</div>;
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
      accessorKey: "booking_date",
      header: "Booking Date",
      cell: ({ row }) => {
        // Use date-fns to format the date as "MMM dd, yyyy, h:mm a"
        // Make sure to import { format } from "date-fns" at the top of your file
        const bookingDate = row.getValue("booking_date") as string;
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
      accessorFn: (row) => row.service_id?.service_name || "N/A", // Handle potential undefined values
      cell: ({ row }) => {
        const serviceName = row.getValue("serviceName") as string | undefined;

        return <div className="">{serviceName}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const booking = row.original;

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

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/bookings/${booking._id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 text-center cursor-pointer"
                onClick={async () => {
                  try {
                    await deleteData(booking._id, "/api/v1/bookings"); // Pass ID and endpoint base
                    toast.success("Booking deleted successfully");
                  } catch (error) {
                    console.error("Error deleting booking:", error);
                    toast.error("Error deleting booking");
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleExportSelected = (selectedBookings: Booking[]) => {
    console.log("Export selected:", selectedBookings);
    // Implement your export logic here
  };

  const handleDeleteSelected = (selectedBookings: Booking[]) => {
    console.log("Delete selected:", selectedBookings);
    // Implement your delete logic here
  };

  const handleExportAll = (allBookings: Booking[]) => {
    console.log("Export all:", allBookings);
    // Implement your export all logic here
  };
  const handleAddSubmit = async (values: unknown) => {
    console.log("Add form values:", values);
    // Implement your add logic here

    try {
      const response = await postData(values as Booking);

      toast.success("Booking added successfully!");
    } catch (error: any) {
      console.error("Error adding booking:", error.response.data.message);
      toast.error(error.response.data.message || "Failed to add booking");
      return;
    }
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumnId="userName"
      filterPlaceholder="filter by user"
      showActionButtons
      //onExportSelected={handleExportSelected}
      onDeleteSelected={handleDeleteSelected}
      //onExportAll={handleExportAll}
      addFormComponent={BookingForm}
      onAddSubmit={handleAddSubmit}
    />
  );
}
