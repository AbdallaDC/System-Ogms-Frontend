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
import { Assign, AssignListResponse } from "@/types/Assign";
import AssignForm from "./AssignForm";
import toast from "react-hot-toast";
import { useDelete, usePost, usePut } from "@/hooks/useApi";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransferForm from "./transfer-form";

interface AssignTableProps {
  data: Assign[];
}

export default function AssignTable({ data }: AssignTableProps) {
  const { postData } = usePost<Assign, AssignListResponse>(
    "/api/v1/assigns",
    "/api/v1/assigns"
  );
  const { putData } = usePut<Assign, AssignListResponse>(
    "/api/v1/assigns",
    "/api/v1/assigns"
  );

  const { deleteData } = useDelete(`/api/v1/assigns/`, "/api/v1/assigns");

  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedAssignForTransfer, setSelectedAssignForTransfer] =
    useState<Assign | null>(null);

  const handleTransferSubmit = async (values: {
    new_user_id: string;
    reason: string;
  }) => {
    if (!selectedAssignForTransfer) return;

    try {
      // await putData(values)
      toast.success("Assignment transferred successfully!");
      setTransferDialogOpen(false);
      setSelectedAssignForTransfer(null);
    } catch (error: any) {
      console.error("Error transferring assignment:", error);
      toast.error(
        error.response?.data?.message || "Failed to transfer assignment"
      );
    }
  };

  const columns: ColumnDef<Assign>[] = [
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
      accessorFn: (row) => row.booking_id?.service_id?.service_name || "N/A", // Handle potential undefined values
      cell: ({ row }) => {
        const serviceName = row.getValue("serviceName") as string | undefined;
        console.log("Owner Name:", serviceName);

        return <div className="">{serviceName ? serviceName : "N/A"}</div>;
      },
    },

    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const assign = row.original;

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
                <Link href={`/assignments/${assign._id}`}>
                  View Assignment details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAssignForTransfer(assign);
                  setTransferDialogOpen(true);
                }}
              >
                Transfer
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 text-center cursor-pointer"
                onClick={async () => {
                  try {
                    await deleteData(assign._id, "/api/v1/assigns"); // Pass ID and endpoint base
                    toast.success("Assign deleted successfully");
                  } catch (error) {
                    console.error("Error deleting assign:", error);
                    toast.error("Error deleting assign");
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
  const handleAddSubmit = async (values: unknown) => {
    console.log("Add form values:", values);
    // Implement your add logic here

    try {
      const response = await postData(values as Assign);

      toast.success("Assign added successfully!");
    } catch (error: any) {
      console.error("Error adding assign:", error.response.data.message);
      toast.error(error.response.data.message || "Failed to add assign");
      return;
    }
  };
  return (
    <>
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Assignment</DialogTitle>
          </DialogHeader>
          {selectedAssignForTransfer && (
            <TransferForm
              assignId={selectedAssignForTransfer._id}
              currentUserId={selectedAssignForTransfer.user_id._id}
              currentUserName={selectedAssignForTransfer.user_id.name}
              // onSubmit={handleTransferSubmit}
              onClose={() => {
                setTransferDialogOpen(false);
                setSelectedAssignForTransfer(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={data}
        filterColumnId="userName"
        filterPlaceholder="filter user"
        showActionButtons
        //onExportSelected={handleExportSelected}
        onDeleteSelected={handleDeleteSelected}
        //onExportAll={handleExportAll}
        addFormComponent={AssignForm}
        onAddSubmit={handleAddSubmit}
      />
    </>
  );
}
