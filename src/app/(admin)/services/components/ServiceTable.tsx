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
import { Service, ServiceListResponse } from "@/types/Service";
import { useState } from "react";
import { useDelete, usePost } from "@/hooks/useApi";
import toast from "react-hot-toast";
import ServiceForm from "./ServiceForm";
import Link from "next/link";

interface ServicesTableProps {
  data: Service[];
}

export function ServicesTable({ data }: ServicesTableProps) {
  const { deleteData } = useDelete(`/api/v1/services/`, "/api/v1/services");
  const { postData } = usePost<Service, ServiceListResponse>(
    "/api/v1/services",
    "/api/v1/services"
  );
  const columns: ColumnDef<Service>[] = [
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
      accessorKey: "service_name",
      header: "Service Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("service_name")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue("price")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="">{row.getValue("description")}</div>,
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

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/services/${service._id}`}>
                  View Service details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 text-center cursor-pointer"
                onClick={async () => {
                  try {
                    await deleteData(service._id, "/api/v1/services"); // Pass ID and endpoint base
                    toast.success("Service deleted successfully");
                  } catch (error) {
                    console.error("Error deleting service:", error);
                    toast.error("Error deleting service");
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

  const handleExportSelected = (selectedServices: Service[]) => {
    console.log("Export selected:", selectedServices);
    // Implement your export logic here
  };

  const handleDeleteSelected = (selectedServices: Service[]) => {
    console.log("Delete selected:", selectedServices);
    // Implement your delete logic here
  };

  const handleExportAll = (allServices: Service[]) => {
    console.log("Export all:", allServices);
    // Implement your export all logic here
  };

  const handleAddSubmit = async (values: unknown) => {
    console.log("Add form values:", values);
    // Implement your add logic here
    try {
      const response = await postData(values as Service);
      console.log("response", response);

      toast.success("Service added successfully");
    } catch (error: any) {
      console.error("Error adding service:", error.response.data.message);
      toast.error(error.response.data.message || "Failed to add service");
      return;
    }
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumnId="service_name"
      filterPlaceholder="Filter services..."
      showActionButtons
      //onExportSelected={handleExportSelected}
      onDeleteSelected={handleDeleteSelected}
      //onExportAll={handleExportAll}
      onAddSubmit={handleAddSubmit}
      addFormComponent={ServiceForm}
    />
  );
}
