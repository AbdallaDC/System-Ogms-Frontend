// @ts-ignore
// utils/generateInvoicePdf.ts
import pdfMake from "pdfmake/build/pdfmake";
require("pdfmake/build/vfs_fonts");

import { format } from "date-fns";
import { InvoiceData } from "@/types/Invoice"; // Update the path to your type if needed

export function generateInvoicePdf(invoiceData: InvoiceData["invoice"]) {
  const itemsRows = invoiceData.items.map((item) => [
    `${item.item.name} (ID: ${item.item.inventory_id})`,
    item.quantity.toString(),
    `$${item.item.price.toFixed(2)}`,
    `$${(item.item.price * item.quantity).toFixed(2)}`,
  ]);

  // Add labor fee
  itemsRows.push([
    `Labor Fee (${invoiceData.service.service_name})`,
    "1",
    `$${invoiceData.labourFee.toFixed(2)}`,
    `$${invoiceData.labourFee.toFixed(2)}`,
  ]);

  const docDefinition: any = {
    content: [
      // Title
      {
        text: "🚗 Garage Pro",
        style: "title",
      },
      {
        text: "Professional Auto Service",
        style: "subtitle",
        margin: [0, 0, 0, 10],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: "#ccc",
          },
        ],
        margin: [0, 5, 0, 15],
      },

      // Invoice header
      {
        columns: [
          [
            { text: "Invoice", style: "headerLabel", margin: [0, 0, 0, 5] },
            { text: `Invoice ID: ${invoiceData.invoiceId}` },
            {
              text: `Date: ${format(
                new Date(invoiceData.date),
                "MMM dd, yyyy"
              )}`,
            },
          ],
          {
            width: "auto",
            text: invoiceData.payment.status.toUpperCase(),
            style: "paidBadge",
          },
        ],
        margin: [0, 0, 0, 20],
      },

      // Customer and service
      {
        columns: [
          [
            { text: "Bill To", style: "sectionHeader" },
            invoiceData.customer.name,
            invoiceData.customer.email,
            invoiceData.customer.phone,
          ],
          [
            { text: "Service Details", style: "sectionHeader" },
            invoiceData.service.service_name,
            `Service ID: ${invoiceData.service.service_id}`,
            `Booking ID: ${invoiceData.payment.booking_id.booking_id}`,
            `Booking Date: ${format(
              new Date(invoiceData.payment.booking_id.booking_date),
              "MMM dd, yyyy"
            )}`,
          ],
        ],
        margin: [0, 0, 0, 20],
      },

      // Table of items
      {
        text: "Items & Services",
        style: "subheader",
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", 40, 60, 60],
          body: [["Description", "Qty", "Unit Price", "Total"], ...itemsRows],
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#edf3fb" : null),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#ccc",
          vLineColor: () => "#ccc",
        },
        margin: [0, 10, 0, 10],
      },

      // Totals
      {
        table: {
          widths: ["*", "auto"],
          body: [
            ["Items Subtotal:", `$${invoiceData.itemPrice.toFixed(2)}`],
            ["Labor Fee:", `$${invoiceData.labourFee.toFixed(2)}`],
            [
              { text: "Total Amount:", bold: true },
              {
                text: `$${invoiceData.total.toFixed(2)}`,
                color: "#0077cc",
                bold: true,
              },
            ],
          ],
        },
        layout: "noBorders",
        alignment: "right",
        margin: [0, 10, 0, 20],
      },

      // Payment info
      {
        text: "💳 Payment Information",
        style: "sectionHeader",
      },
      {
        columns: [
          [
            `Payment Method: ${invoiceData.payment.method.toUpperCase()}`,
            `Transaction ID: ${invoiceData.payment.transactionId}`,
          ],
          [
            `Reference ID: ${invoiceData.payment.referenceId}`,
            `Payment Date: ${format(
              new Date(invoiceData.payment.paid_at),
              "MMM dd, yyyy 'at' h:mm a"
            )}`,
          ],
        ],
        margin: [0, 10, 0, 20],
      },

      // Footer
      {
        text: `🎉 Thank you for choosing ${invoiceData.companyName}!`,
        alignment: "center",
        color: "#1f4e79",
        bold: true,
        margin: [0, 20, 0, 4],
      },
      {
        text: "This is a computer-generated invoice.",
        alignment: "center",
        fontSize: 9,
        color: "gray",
      },
    ],
    styles: {
      title: {
        fontSize: 22,
        bold: true,
        color: "#1f4e79",
      },
      subtitle: {
        fontSize: 12,
        color: "#4f4f4f",
      },
      headerLabel: {
        fontSize: 16,
        bold: true,
        color: "#222",
      },
      paidBadge: {
        fontSize: 10,
        color: "white",
        bold: true,
        fillColor: "green",
        alignment: "center",
        margin: [0, 10, 0, 0],
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#1f4e79",
      },
      subheader: {
        fontSize: 13,
        bold: true,
        margin: [0, 10, 0, 5],
        color: "#1f4e79",
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`Invoice_${invoiceData.invoiceId}.pdf`);
}
