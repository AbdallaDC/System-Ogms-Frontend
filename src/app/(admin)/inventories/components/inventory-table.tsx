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

import { useDelete, usePost } from "@/hooks/useApi";
import toast from "react-hot-toast";
import InventoryForm from "./InventoryForm";
import Link from "next/link";
import { Inventory, InventoryListResponse } from "@/types/Inventory";

interface InventoryTableProps {
  data: Inventory[];
}

export function InventoryTable({ data }: InventoryTableProps) {
  const { deleteData } = useDelete(`/api/v1/inventory/`, "/api/v1/inventory");
  const { postData } = usePost<Inventory, InventoryListResponse>(
    "/api/v1/inventory",
    "/api/v1/inventory"
  );
  const columns: ColumnDef<Inventory>[] = [
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
      accessorKey: "inventory_id",
      header: "ID",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("inventory_id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <div className="">{row.getValue("price")}</div>,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => <div className="">{row.getValue("quantity")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const inventory = row.original;

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
                <Link href={`/inventories/${inventory._id}`}>
                  View Inventory details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 text-center cursor-pointer"
                onClick={async () => {
                  try {
                    await deleteData(inventory._id, "/api/v1/inventory"); // Pass ID and endpoint base
                    toast.success("inventory deleted successfully");
                  } catch (error: any) {
                    console.error(
                      "Error deleting inventory:",
                      error.response.data.message
                    );
                    toast.error(
                      error.response.data.message || "Error deleting inventory"
                    );
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

  const handleExportSelected = (selectedInventory: Inventory[]) => {
    console.log("Export selected:", selectedInventory);
    // Implement your export logic here
  };

  const handleDeleteSelected = (selectedInventory: Inventory[]) => {
    console.log("Delete selected:", selectedInventory);
    // Implement your delete logic here
  };

  const handleExportAll = (allInventories: Inventory[]) => {
    console.log("Export all:", allInventories);
    // Implement your export all logic here
  };

  const handleAddSubmit = async (values: unknown) => {
    console.log("Add form values:", values);
    // Implement your add logic here
    try {
      const response = await postData(values as Inventory);
      console.log("response", response);

      toast.success("Inventory item added successfully");
    } catch (error: any) {
      console.error("Error adding Inventory:", error.response.data.message);
      toast.error(error.response.data.message || "Failed to add Inventory");
      return;
    }
  };

  return (
    <DataTable
      title="Services"
      description="Manage your inventory items"
      columns={columns}
      data={data}
      filterColumnId="name"
      filterPlaceholder="Filter inventories..."
      showActionButtons
      //onExportSelected={handleExportSelected}
      onDeleteSelected={handleDeleteSelected}
      //onExportAll={handleExportAll}
      onAddSubmit={handleAddSubmit}
      addFormComponent={InventoryForm}
    />
  );
}
