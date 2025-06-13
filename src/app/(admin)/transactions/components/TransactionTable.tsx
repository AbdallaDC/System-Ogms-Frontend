"use client";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Eye,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  CreditCard,
  Phone,
  Calendar,
  DollarSign,
  Paperclip,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { API_BASE_URL, usePost } from "@/hooks/useApi";
import axios from "axios";
import { useState } from "react";
import InvoiceModal from "./invoice-model";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  user_id: string;
  id: string;
}

interface Service {
  _id: string;
  service_name: string;
  price: number;
  service_id: string;
  id: string;
}

interface Booking {
  _id: string;
  vehicle_id: string;
  service_id: string;
  booking_date: string;
  status: string;
}

interface InventoryItem {
  item: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  _id: string;
}

interface Transaction {
  _id: string;
  payment_id: string;
  user_id: User;
  service_id: Service;
  booking_id: Booking;
  phone: string;
  method: string;
  amount: number;
  status: string;
  referenceId: string;
  transactionId: string;
  responseMessage: string;
  paid_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  orderId?: string;
  issuerTransactionId?: string;
  accountType?: string;
  inventoryItems?: InventoryItem[];
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const handleGenerateInvoice = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsInvoiceModalOpen(true);
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      // accessorKey: "user_id.name",
      // header: "Customer",
      accessorKey: "user_id", // Optional, just for column id
      header: "Customer",
      accessorFn: (row) => row.user_id?.name ?? "", // This enables filtering/sorting
      id: "customer", // Explicit ID to use as filterColumnId
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${transaction.user_id.name}`}
                alt={transaction.user_id.name}
              />
              <AvatarFallback className="bg-blue-500 text-white text-xs">
                {transaction.user_id.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">
                {transaction.user_id.name}
              </div>
              <div className="text-xs text-gray-500">
                {transaction.user_id.email}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "service_id",
      header: "Service / Item",
      cell: ({ row }) => {
        const transaction = row.original;

        // Booking-based (with service)
        if (transaction.service_id) {
          return (
            <div className="space-y-1">
              <div className="font-medium text-gray-900">
                {transaction.service_id.service_name}
              </div>
              <div className="text-xs text-gray-500">
                ID: {transaction.service_id.service_id}
              </div>
            </div>
          );
        }

        // Inventory-based (with items)
        if (
          transaction.inventoryItems &&
          transaction.inventoryItems.length > 0
        ) {
          return (
            <div className="space-y-1">
              {transaction.inventoryItems.map((inv, idx) => (
                <div key={idx}>
                  <div className="font-medium text-gray-900">
                    {inv.item.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Qty: {inv.quantity}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        return <span className="text-gray-400 italic">N/A</span>;
      },
    },

    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span className="font-bold text-emerald-600">
              ${amount.toLocaleString()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string;
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-500" />
            <span className="font-mono text-sm">{phone}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => {
        const method = row.getValue("method") as string;
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <CreditCard className="h-3 w-3 mr-1" />
            {method}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={getStatusVariant(status)}
            className="flex items-center gap-1 w-fit"
          >
            {getStatusIcon(status)}
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "paid_at",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("paid_at") as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">
                {format(new Date(date), "MMM d, yyyy")}
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(date), "h:mm a")}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleGenerateInvoice(transaction._id)}
                className="cursor-pointer"
              >
                <Paperclip className="mr-2 h-4 w-4" />
                Generate Invoice
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  copyToClipboard(transaction.transactionId, "Transaction ID")
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Transaction ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  copyToClipboard(transaction.referenceId, "Reference ID")
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Reference ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <Link href={`/transactions/${transaction._id}`}>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </Link> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleExportSelected = (selectedTransactions: Transaction[]) => {
    const csvContent = [
      // CSV Headers
      [
        "Transaction ID",
        "Customer Name",
        "Customer Email",
        "Phone",
        "Service",
        "Amount",
        "Method",
        "Status",
        "Reference ID",
        "Date",
        "Response Message",
      ].join(","),
      // CSV Data
      ...selectedTransactions.map((transaction) =>
        [
          transaction.transactionId,
          transaction.user_id.name,
          transaction.user_id.email,
          transaction.phone,
          transaction.service_id.service_name,
          transaction.amount,
          transaction.method,
          transaction.status,
          transaction.referenceId,
          format(new Date(transaction.paid_at), "yyyy-MM-dd HH:mm:ss"),
          `"${transaction.responseMessage}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${selectedTransactions.length} transactions`);
  };

  const handleExportAll = (allTransactions: Transaction[]) => {
    handleExportSelected(allTransactions);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={transactions}
        filterColumnId="customer" // Optional, just for column id
        filterPlaceholder="Search by customer name..."
        showRowSelection={true}
        showActionButtons={true}
        onExportSelected={handleExportSelected}
        onExportAll={handleExportAll}
        title="Transaction Records"
        description="Complete list of all payment transactions with advanced filtering and export capabilities"
        pageSizeOptions={[10, 25, 50, 100]}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        paymentId={selectedPaymentId}
      />
    </>
  );
};

export default TransactionTable;
