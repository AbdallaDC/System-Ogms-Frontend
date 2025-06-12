"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  User,
  Wrench,
  Receipt,
  Download,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

interface UserType {
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

interface Transaction {
  _id: string;
  payment_id: string;
  user_id: UserType;
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
}

interface TransactionDetailsProps {
  transactionId: string;
}

export default function TransactionDetails({
  transactionId,
}: TransactionDetailsProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTransactionDetails();
  }, [transactionId]);

  const fetchTransactionDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your actual API endpoint
      const response = await fetch(
        `http://localhost:8800/api/v1/payments/${transactionId}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transaction details");
      }

      const data = await response.json();
      setTransaction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "completed":
      case "paid":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
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

  const downloadReceipt = () => {
    if (!transaction) return;

    const receiptContent = `
TRANSACTION RECEIPT
==================

Transaction ID: ${transaction.transactionId}
Reference ID: ${transaction.referenceId}
Date: ${format(new Date(transaction.paid_at), "PPP p")}

Customer Information:
- Name: ${transaction.user_id.name}
- Email: ${transaction.user_id.email}
- Phone: ${transaction.phone}

Service Details:
- Service: ${transaction.service_id.service_name}
- Service ID: ${transaction.service_id.service_id}
- Amount: $${transaction.amount.toLocaleString()}

Payment Information:
- Method: ${transaction.method}
- Status: ${transaction.status}
- Response: ${transaction.responseMessage}

${transaction.orderId ? `Order ID: ${transaction.orderId}` : ""}
${
  transaction.issuerTransactionId
    ? `Issuer Transaction ID: ${transaction.issuerTransactionId}`
    : ""
}
${transaction.accountType ? `Account Type: ${transaction.accountType}` : ""}

Generated on: ${format(new Date(), "PPP p")}
    `.trim();

    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `receipt_${transaction.transactionId}.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Receipt downloaded successfully");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Transaction Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              {error || "The requested transaction could not be found."}
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Transaction Details
            </h1>
            <p className="text-gray-600">
              Complete information for transaction {transaction.transactionId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={getStatusVariant(transaction.status)}
            className="flex items-center gap-2 px-3 py-1"
          >
            {getStatusIcon(transaction.status)}
            {transaction.status}
          </Badge>
          <Button onClick={downloadReceipt} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Overview */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-500" />
                Transaction Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Transaction ID
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {transaction.transactionId}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            transaction.transactionId,
                            "Transaction ID"
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Reference ID
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {transaction.referenceId}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            transaction.referenceId,
                            "Reference ID"
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Payment Method
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <CreditCard className="h-3 w-3 mr-1" />
                      {transaction.method}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Amount
                    </span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      <span className="font-bold text-emerald-600 text-lg">
                        ${transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Payment Date
                    </span>
                    <div className="text-right">
                      <div className="font-medium">
                        {format(new Date(transaction.paid_at), "MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(transaction.paid_at), "h:mm a")}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Created
                    </span>
                    <div className="text-right">
                      <div className="font-medium">
                        {format(new Date(transaction.createdAt), "MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(transaction.createdAt), "h:mm a")}
                      </div>
                    </div>
                  </div>

                  {transaction.orderId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Order ID
                      </span>
                      <span className="font-mono text-sm">
                        {transaction.orderId}
                      </span>
                    </div>
                  )}

                  {transaction.issuerTransactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Issuer Transaction ID
                      </span>
                      <span className="font-mono text-sm">
                        {transaction.issuerTransactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {transaction.responseMessage && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Response Message
                    </span>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {transaction.responseMessage}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {transaction.service_id.service_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Service ID: {transaction.service_id.service_id}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    ${transaction.service_id.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Service Price</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Booking ID</span>
                  <p className="font-mono">{transaction.booking_id._id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Vehicle ID</span>
                  <p className="font-mono">
                    {transaction.booking_id.vehicle_id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${transaction.user_id.name}`}
                    alt={transaction.user_id.name}
                  />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {transaction.user_id.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {transaction.user_id.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer ID: {transaction.user_id.user_id}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{transaction.user_id.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-mono">{transaction.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/users/${transaction.user_id._id}`)}
              >
                <User className="h-4 w-4 mr-2" />
                View Customer Profile
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  router.push(`/bookings/${transaction.booking_id._id}`)
                }
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Booking Details
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  router.push(`/services/${transaction.service_id._id}`)
                }
              >
                <Wrench className="h-4 w-4 mr-2" />
                View Service Details
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`tel:${transaction.phone}`, "_self")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  window.open(`mailto:${transaction.user_id.email}`, "_self")
                }
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
