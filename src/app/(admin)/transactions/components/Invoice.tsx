"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Download,
  Printer,
  CreditCard,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

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
  service_id: string;
  booking_date: string;
  status: string;
}

interface Transaction {
  _id: string;
  orderId: string;
  issuerTransactionId?: string;
  accountType?: string;
  payment_id: string;
  user_id: User;
  service_id: Service;
  booking_id: Booking;
  phone: string;
  method: string;
  item_price: number;
  labour_fee: number;
  amount: number;
  status: string;
  referenceId: string;
  transactionId: string;
  responseMessage: string;
  paid_at: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceProps {
  transaction: Transaction;
  hideActions?: boolean;
}

export default function Invoice({
  transaction,
  hideActions = false,
}: InvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log("Downloading invoice...");
  };

  const invoiceNumber = `INV-${transaction.orderId}`;
  const invoiceDate = format(new Date(transaction.paid_at), "MMMM d, yyyy");
  const dueDate = format(new Date(transaction.paid_at), "MMMM d, yyyy");

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header Actions - Hidden when in modal */}
      {!hideActions && (
        <div className="flex justify-end gap-2 mb-6 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
              <div className="space-y-1">
                <p className="text-blue-100">Invoice #{invoiceNumber}</p>
                <p className="text-blue-100">Date: {invoiceDate}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">Your Company</h2>
              <div className="text-blue-100 mt-2 space-y-1">
                <p className="flex items-center justify-end gap-2">
                  <MapPin className="h-4 w-4" />
                  123 Business Street, City, State 12345
                </p>
                <p className="flex items-center justify-end gap-2">
                  <Phone className="h-4 w-4" />
                  +1 (555) 123-4567
                </p>
                <p className="flex items-center justify-end gap-2">
                  <Mail className="h-4 w-4" />
                  contact@yourcompany.com
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Status Badge */}
          <div className="flex justify-between items-center mb-8">
            <Badge
              variant={transaction.status === "paid" ? "default" : "secondary"}
              className="bg-green-100 text-green-800 border-green-200 px-3 py-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {transaction.status.toUpperCase()}
            </Badge>
            <div className="text-right text-sm text-gray-600">
              <p>Transaction ID: {transaction.transactionId}</p>
              <p>Reference: {transaction.referenceId}</p>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bill To:
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {transaction.user_id.name}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Mail className="h-4 w-4" />
                  {transaction.user_id.email}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4" />
                  {transaction.phone}
                </p>
                <p className="text-gray-600 mt-1">
                  Customer ID: {transaction.user_id.user_id}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Invoice Details:
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Date:</span>
                  <span className="font-medium">{invoiceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium">{dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <Badge variant="outline" className="ml-2">
                    <CreditCard className="h-3 w-3 mr-1" />
                    {transaction.method.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-medium">
                    {format(
                      new Date(transaction.booking_id.booking_date),
                      "MMM d, yyyy"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Service Details:
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service ID
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Labour Fee
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {transaction.service_id.service_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Professional service
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.service_id.service_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${transaction.item_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${transaction.labour_fee.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Item Price:</span>
                    <span className="font-medium">
                      ${transaction.item_price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Labour Fee:</span>
                    <span className="font-medium">
                      ${transaction.labour_fee.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Amount Paid:</span>
                    <span className="font-medium">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Balance Due:</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Payment Received</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Payment of ${transaction.amount.toFixed(2)} was successfully
              processed on {invoiceDate} via {transaction.method.toUpperCase()}.
            </p>
            <p className="text-green-700 text-sm mt-1">
              Response: {transaction.responseMessage}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-1">
              For questions about this invoice, please contact us at
              contact@yourcompany.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
