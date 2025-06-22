"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  DownloadIcon,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Database,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import toast from "react-hot-toast";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  filterColumnId?: string;
  filterPlaceholder?: string;
  showRowSelection?: boolean;
  showActionButtons?: boolean;
  onExportSelected?: (selectedData: TData[]) => void;
  onDeleteSelected?: (selectedData: TData[]) => void;
  onExportAll?: (allData: TData[]) => void;
  onAddSubmit?: (values: unknown) => Promise<void> | void;
  addFormComponent?: React.ComponentType<{
    onSubmit: (values: unknown) => void;
    onClose: () => void;
    isSubmitting?: boolean;
  }>;
  pageSizeOptions?: number[];
  title?: string;
  description?: string;
}

export function DataTable<TData>({
  columns,
  data,
  filterColumnId,
  filterPlaceholder = "Search records...",
  showRowSelection = true,
  showActionButtons = false,
  onExportSelected,
  onDeleteSelected,
  onExportAll,
  addFormComponent: AddFormComponent,
  onAddSubmit,
  pageSizeOptions = [10, 20, 50, 100],
  title = "Data Table",
  description = "Manage your data with advanced filtering and sorting",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isAddFormOpen, setIsAddFormOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // pagination state
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSizeOptions[0] || 10,
  });

  const handleFormSubmit = async (values: unknown) => {
    if (!onAddSubmit) return;

    try {
      setIsSubmitting(true);
      await onAddSubmit(values);
      setIsAddFormOpen(false);
      // toast.success("Record added successfully!");
    } catch (error: any) {
      console.error("Error submitting form:", error.response);
      // toast.error(error.response?.data?.message || "Failed to add record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
  });

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original);
  const allData = table.getFilteredRowModel().rows.map((r) => r.original);

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
        {/* Background Pattern */}
        <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20'></div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 animate-bounce">
          <Sparkles className="h-6 w-6 text-white/60" />
        </div>
        <div className="absolute bottom-4 left-4 animate-pulse">
          <Database className="h-8 w-8 text-white/40" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Database className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">{title || "Data Table"}</h1>
          </div>
          <p className="text-blue-100 text-lg">
            {description ||
              "Manage your data with advanced filtering and sorting"}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              {data.length} Total Records
            </Badge>
            {selectedRows.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                {selectedRows.length} Selected
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        {filterColumnId && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder={filterPlaceholder}
              value={
                (table.getColumn(filterColumnId)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(filterColumnId)
                  ?.setFilterValue(event.target.value)
              }
              className="pl-10 h-12 bg-white/50 backdrop-blur-sm border-white/20 focus:bg-white/80 focus:border-blue-500 transition-all duration-300"
            />
          </div>
        )}

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/80 hover:border-blue-500 transition-all duration-300"
            >
              <Eye className="mr-2 h-4 w-4" />
              Columns
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white/95 backdrop-blur-sm border-white/20"
          >
            <DropdownMenuLabel className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Toggle Columns
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export Actions */}
        {showActionButtons && (
          <div className="flex gap-2">
            {onExportAll && (
              <Button
                variant="outline"
                onClick={() => onExportAll(allData)}
                className="h-12 bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/80 hover:border-emerald-500 transition-all duration-300"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export All
              </Button>
            )}

            {selectedRows.length > 0 && onExportSelected && (
              <Button
                variant="outline"
                onClick={() => onExportSelected(selectedRows)}
                className="h-12 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all duration-300"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export ({selectedRows.length})
              </Button>
            )}
          </div>
        )}

        {/* Add New Button */}
        {AddFormComponent && (
          <Button
            onClick={() => setIsAddFormOpen(true)}
            className="h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Record
          </Button>
        )}
      </div>

      {/* Table Section */}
      <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl">
        {/* Table Header Gradient */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"></div>

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-blue-100 hover:bg-blue-50/50"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-16 font-semibold text-gray-700 bg-transparent relative z-10"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`
                      border-b border-gray-100 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:shadow-md
                      ${
                        row.getIsSelected()
                          ? "bg-gradient-to-r from-blue-100 to-cyan-100 shadow-md"
                          : ""
                      }
                      ${index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"}
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-4 px-6 text-gray-700 font-medium"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <Database className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-500">
                          No results found
                        </p>
                        <p className="text-sm text-gray-400">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
        {/* Selection Info */}
        {showRowSelection && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} selected
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Rows per page:
            </span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-10 w-20 bg-white/80 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-10 w-10 p-0 bg-white/80 border-gray-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-10 w-10 p-0 bg-white/80 border-gray-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add Form Dialog */}
      {AddFormComponent && (
        <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-white/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                Add New Record
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Fill in the details below to create a new record in the system.
              </DialogDescription>
            </DialogHeader>
            <AddFormComponent
              onSubmit={handleFormSubmit}
              onClose={() => setIsAddFormOpen(false)}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
