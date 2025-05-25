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

export const columns: ColumnDef<Vehicle>[] = [
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
    accessorKey: "make",
    header: "Make",
    cell: ({ row }) => <div className="capitalize">{row.getValue("make")}</div>,
  },
  {
    accessorKey: "model",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Model
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("model")}</div>,
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => <div className="">{row.getValue("year")}</div>,
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

interface VehicleTableProps {
  data: Vehicle[];
}

export default function VehicleTable({ data }: VehicleTableProps) {
  const handleExportSelected = (selectedVehicles: Vehicle[]) => {
    console.log("Export selected:", selectedVehicles);
    // Implement your export logic here
  };

  const handleDeleteSelected = (selectedVehicles: Vehicle[]) => {
    console.log("Delete selected:", selectedVehicles);
    // Implement your delete logic here
  };

  const handleExportAll = (allVehicles: Vehicle[]) => {
    console.log("Export all:", allVehicles);
    // Implement your export all logic here
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumnId="make"
      filterPlaceholder="Search Vehicles"
      showActionButtons
      onExportSelected={handleExportSelected}
      onDeleteSelected={handleDeleteSelected}
      onExportAll={handleExportAll}
    />
  );
}
