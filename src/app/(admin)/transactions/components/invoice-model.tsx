"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import Invoice from "./Invoice";

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
  orderId?: string;
  issuerTransactionId?: string;
  accountType?: string;
  payment_id: string;
  user_id: User;
  service_id: Service;
  booking_id: Booking;
  phone: string;
  method: string;
  item_price?: number;
  labour_fee?: number;
  amount: number;
  status: string;
  referenceId: string;
  transactionId: string;
  responseMessage: string;
  paid_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  transaction,
}: InvoiceModalProps) {
  if (!transaction) return null;

  const handleDownloadPDF = async () => {
    try {
      // Import jsPDF dynamically to avoid SSR issues
      const { default: jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      // Get the invoice element
      const invoiceElement = document.getElementById("invoice-content");
      if (!invoiceElement) return;

      // Create canvas from the invoice element
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const invoiceNumber = `INV-${
        transaction.orderId || transaction.transactionId
      }`;
      pdf.save(`${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback: open print dialog
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Ensure transaction has required fields with defaults
  const normalizedTransaction = {
    ...transaction,
    orderId: transaction.orderId || transaction.transactionId,
    item_price: transaction.item_price || transaction.amount * 0.6,
    labour_fee: transaction.labour_fee || transaction.amount * 0.4,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Invoice Preview
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div id="invoice-content" className="bg-white">
            <Invoice transaction={normalizedTransaction} hideActions={true} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
