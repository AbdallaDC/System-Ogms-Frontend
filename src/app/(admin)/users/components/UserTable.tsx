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
import { User, UserListResponse } from "@/types/User";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow, set } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import UserForm from "./UserForm";
import { useDelete, usePost } from "@/hooks/useApi";
import { mutate } from "swr";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

interface UserTableProps {
  data: User[];
}

export default function UserTable({ data }: UserTableProps) {
  const { postData } = usePost<User, UserListResponse>(
    "/api/v1/auth/register",
    "/api/v1/users"
  );
  const { deleteData } = useDelete(`/api/v1/users/`, "/api/v1/users");

  const columns: ColumnDef<User>[] = [
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
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
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
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

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
              <DropdownMenuItem
                className="text-red-500 text-center cursor-pointer"
                onClick={async () => {
                  try {
                    await deleteData(user._id, "/api/v1/users"); // Pass ID and endpoint base
                    toast.success("user deleted successfully");
                  } catch (error) {
                    console.error("Error deleting user:", error);
                    toast.error("Error deleting user");
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/users/${user._id}`}>View details</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const exportToCsv = (data: any[], fileName: string) => {
    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Usage in ServicesTable component
  const handleExportAll = (allUsers: User[]) => {
    exportToCsv(allUsers, "all-users.csv");
  };

  const handleExportSelected = (selectedUsers: User[]) => {
    exportToCsv(selectedUsers, "selected-users.csv");
  };

  const handleDeleteSelected = (selectedUser: User[]) => {
    console.log("Delete selected:", selectedUser);
    // Implement your delete logic here
  };

  const handleAddSubmit = async (values: unknown) => {
    try {
      const response = await postData(values as User);
      // console.log("response", response);

      toast.success("User added successfully");
    } catch (error: any) {
      console.error("Error adding user:", error.response.data.message);
      toast.error(error.response.data.message || "Failed to add user");
      return;
    }
    postData(values as User);
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumnId="email"
      filterPlaceholder="Search by Email"
      showActionButtons
      //onExportSelected={handleExportSelected}
      onDeleteSelected={handleDeleteSelected}
      //onExportAll={handleExportAll}
      addFormComponent={UserForm}
      onAddSubmit={handleAddSubmit}
    />
  );
}
