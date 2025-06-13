"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  Calendar,
  User,
  Phone,
  Mail,
  CreditCard,
  Package,
  Wrench,
  Building,
} from "lucide-react";
import { format } from "date-fns";
import { useFetch } from "@/hooks/useApi";
import { generateInvoicePdf } from "@/utils/generateInvoicePdf";
import { InvoiceData } from "@/types/Invoice";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  paymentId,
}: InvoiceModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: invoiceData, isLoading: isLoadingInvoice } =
    useFetch<InvoiceData>(`/api/v1/invoices/${paymentId}`);

  const downloadPDF = async () => {
    if (!invoiceData) return;
    generateInvoicePdf(invoiceData.invoice);
  };

  const printInvoice = () => {
    const printContent = document.getElementById("invoice-content");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #111827;
              font-size: 14px;
            }
  
            h1, h2, h3 {
              color: #1e40af;
              margin: 0;
            }
  
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 24px;
            }
  
            .subtitle {
              font-size: 12px;
              color: #6b7280;
            }
  
            .paid-badge {
              background-color: #d1fae5;
              color: #065f46;
              font-size: 12px;
              padding: 2px 8px;
              border-radius: 12px;
              display: inline-block;
              margin-top: 6px;
            }
  
            .section {
              margin-bottom: 30px;
            }
  
            .two-col {
              display: flex;
              justify-content: space-between;
              gap: 30px;
            }
  
            .label {
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 8px;
              display: block;
            }
  
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              font-size: 13px;
            }
  
            th, td {
              border: 1px solid #d1d5db;
              padding: 8px;
              vertical-align: top;
            }
  
            th {
              background-color: #f3f4f6;
              text-align: left;
            }
  
            .meta {
              font-size: 11px;
              color: #6b7280;
            }
  
            .totals {
              width: 300px;
              margin-left: auto;
              margin-top: 20px;
            }
  
            .totals div {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
            }
  
            .total-bold {
              font-weight: bold;
              color: #1d4ed8;
              font-size: 15px;
            }
  
            .payment-box {
              background-color: #f9fafb;
              padding: 16px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            }
  
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
  
            @media print {
              body {
                margin: 0;
                padding: 40px;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const invoice = invoiceData?.invoice;
  const isBookingInvoice = invoice?.type === "booking";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Invoice Details
          </DialogTitle>
        </DialogHeader>

        {isLoadingInvoice ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading invoice...</span>
          </div>
        ) : invoice ? (
          <div className="space-y-6">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={printInvoice}>
                <FileText className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={downloadPDF}
                disabled={isDownloading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>

            <div
              id="invoice-content"
              className="bg-white p-8 rounded-lg border"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">
                      {invoice.companyName}
                    </h1>
                  </div>
                  <p className="text-gray-600">Professional Auto Service</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    INVOICE
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Invoice ID:</strong> {invoice.invoiceId}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {format(new Date(invoice.date), "MMM dd, yyyy")}
                    </p>
                    <Badge
                      variant="default"
                      className="mt-2 bg-green-100 text-green-800"
                    >
                      {invoice.payment.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {invoice.customer && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Bill To
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {invoice.customer.name}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {invoice.customer.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {invoice.customer.phone}
                      </p>
                    </div>
                  </div>
                )}

                {isBookingInvoice && invoice.service && invoice.booking && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-blue-600" />
                      Service Details
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {invoice.service.service_name}
                      </p>
                      <p>Service ID: {invoice.service.service_id}</p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {format(
                          new Date(invoice.booking.booking_date),
                          "MMM dd, yyyy"
                        )}
                      </p>
                      <p>Booking: {invoice.booking.booking_id}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="mb-6" />

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  Items & Services
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border px-4 py-2 text-left text-sm font-medium text-gray-900">
                          Description
                        </th>
                        <th className="border px-4 py-2 text-center text-sm font-medium text-gray-900">
                          Qty
                        </th>
                        <th className="border px-4 py-2 text-right text-sm font-medium text-gray-900">
                          Unit Price
                        </th>
                        <th className="border px-4 py-2 text-right text-sm font-medium text-gray-900">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2 text-sm">
                            <div>
                              <p className="font-medium">{item.item.name}</p>
                              <p className="text-gray-500 text-xs">
                                ID: {item.item.inventory_id}
                              </p>
                            </div>
                          </td>
                          <td className="border px-4 py-2 text-center text-sm">
                            {item.quantity}
                          </td>
                          <td className="border px-4 py-2 text-right text-sm">
                            ${item.item.price.toFixed(2)}
                          </td>
                          <td className="border px-4 py-2 text-right text-sm font-medium">
                            ${(item.item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      {isBookingInvoice && (
                        <tr>
                          <td className="border px-4 py-2 text-sm">
                            <div>
                              <p className="font-medium">Labor Fee</p>
                              <p className="text-gray-500 text-xs">
                                {invoice.service.service_name}
                              </p>
                            </div>
                          </td>
                          <td className="border px-4 py-2 text-center text-sm">
                            1
                          </td>
                          <td className="border px-4 py-2 text-right text-sm">
                            ${invoice.labourFee.toFixed(2)}
                          </td>
                          <td className="border px-4 py-2 text-right text-sm font-medium">
                            ${invoice.labourFee.toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items Subtotal:</span>
                    <span className="font-medium">
                      ${invoice.itemPrice.toFixed(2)}
                    </span>
                  </div>
                  {isBookingInvoice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Labor Fee:</span>
                      <span className="font-medium">
                        ${invoice.labourFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">
                      ${invoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Payment Method:</strong>{" "}
                      {invoice.payment.method.toUpperCase()}
                    </p>
                    <p>
                      <strong>Transaction ID:</strong>{" "}
                      {invoice.payment.transactionId}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Reference ID:</strong>{" "}
                      {invoice.payment.referenceId}
                    </p>
                    <p>
                      <strong>Payment Date:</strong>{" "}
                      {format(
                        new Date(invoice.payment.paid_at),
                        "MMM dd, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>Thank you for choosing {invoice.companyName}!</p>
                <p className="mt-1">This is a computer-generated invoice.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load invoice data</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
