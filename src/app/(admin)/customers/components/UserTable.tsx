// components/services-table.tsx
"use client";

import { DataTable } from "@/components/data-table";
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
import { User } from "@/types/User";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "name",
    header: "name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="">{row.getValue("phone")}</div>,
  },
  //   {
  //     id: "ownerName",
  //     header: "Owner",
  //     accessorFn: (row) => row.owner?.name || "N/A", // Handle potential undefined values
  //     cell: ({ row }) => {
  //       const ownerName = row.getValue("ownerName") as string | undefined;
  //       console.log("Owner Name:", ownerName);

  //       return <div className="">{ownerName}</div>;
  //     },
  //   },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = (row.getValue("role") as string)?.toLowerCase();
      let bgColor = "bg-gray-200";
      let textColor = "text-gray-800";
      switch (role) {
        case "admin":
          bgColor = "bg-blue-100";
          textColor = "text-blue-800";
          break;
        case "customer":
          bgColor = "bg-green-100";
          textColor = "text-green-800";
          break;
        case "mechanic":
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-800";
          break;
        default:
          bgColor = "bg-gray-200";
          textColor = "text-gray-800";
      }
      return (
        <div
          className={`inline-block px-3 py-1 rounded-full font-medium text-xs ${bgColor} ${textColor}`}
        >
          {row.getValue("role")}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      // Use date-fns to format the date as "x time ago"
      // Assumes createdAt is an ISO string
      // You need to have: import { formatDistanceToNow } from "date-fns";
      // If not already imported, add at the top: import { formatDistanceToNow } from "date-fns";
      const createdAt = row.getValue("createdAt") as string;
      return (
        <div className="">
          {createdAt
            ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
            : ""}
        </div>
      );
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

interface UserTableProps {
  data: User[];
}

export default function UserTable({ data }: UserTableProps) {
  const handleExportSelected = (selectedUsers: User[]) => {
    console.log("Export selected:", selectedUsers);
    // Implement your export logic here
  };

  const handleDeleteSelected = (selectedUsers: User[]) => {
    console.log("Delete selected:", selectedUsers);
    // Implement your delete logic here
  };

  const handleExportAll = (allUsers: User[]) => {
    console.log("Export all:", allUsers);
    // Implement your export all logic here
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumnId="email"
      filterPlaceholder="Search by Email"
      showActionButtons
      onExportSelected={handleExportSelected}
      onDeleteSelected={handleDeleteSelected}
      onExportAll={handleExportAll}
    />
  );
}
