// @ts-ignore
// utils/generateInvoicePdf.ts
import pdfMake from "pdfmake/build/pdfmake";
require("pdfmake/build/vfs_fonts");

import { format } from "date-fns";
// import { format } from "date-fns";
import { InvoiceData, Invoice, BookingInvoice } from "@/types/Invoice";

export function generateInvoicePdf(invoice: Invoice) {
  const isBooking = invoice.type === "booking";

  const itemsTableBody = [
    ["Description", "Qty", "Unit Price", "Total"],
    ...invoice.items.map((item) => [
      {
        stack: [
          { text: item.item.name, bold: true },
          {
            text: `ID: ${item.item.inventory_id}`,
            fontSize: 8,
            color: "#888888",
          },
        ],
      },
      item.quantity.toString(),
      `$${item.item.price.toFixed(2)}`,
      `$${(item.item.price * item.quantity).toFixed(2)}`,
    ]),
  ];

  if (isBooking) {
    itemsTableBody.push([
      {
        stack: [
          { text: "Labor Fee", bold: true },
          { text: invoice.service.service_name, fontSize: 8, color: "#888888" },
        ],
      },
      "1",
      `$${invoice.labourFee.toFixed(2)}`,
      `$${invoice.labourFee.toFixed(2)}`,
    ]);
  }

  const docDefinition: any = {
    content: [
      {
        columns: [
          [
            { text: "Garage Pro", style: "title" },
            { text: "Professional Auto Service", style: "subtitle" },
          ],
          [
            { text: "INVOICE", style: "invoiceHeader" },
            { text: `Invoice ID: ${invoice.invoiceId}`, style: "meta" },
            {
              text: `Date: ${format(new Date(invoice.date), "MMM dd, yyyy")}`,
              style: "meta",
            },
            {
              text: invoice.payment.status.toUpperCase(),
              style: "badge",
              alignment: "right",
            },
          ],
        ],
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
            lineColor: "#ddd",
          },
        ],
        margin: [0, 10, 0, 10],
      },

      {
        columns: [
          [
            { text: "Bill To", style: "sectionHeader" },
            { text: invoice.customer.name },
            { text: invoice.customer.email },
            { text: invoice.customer.phone },
          ],
          isBooking
            ? [
                { text: "Service Details", style: "sectionHeader" },
                { text: invoice.service.service_name },
                { text: `Service ID: ${invoice.service.service_id}` },
                {
                  text: `${format(
                    new Date(invoice.booking.booking_date),
                    "MMM dd, yyyy"
                  )}`,
                },
                { text: `Booking: ${invoice.booking.booking_id}` },
              ]
            : [],
        ],
        columnGap: 50,
        margin: [0, 10, 0, 10],
      },

      { text: "Items & Services", style: "sectionHeader" },
      {
        table: {
          headerRows: 1,
          widths: ["*", 40, 60, 60],
          body: itemsTableBody,
        },
        layout: {
          fillColor: (i: number) => (i === 0 ? "#f1f5f9" : null),
          hLineColor: () => "#ddd",
          vLineColor: () => "#ddd",
        },
        margin: [0, 10, 0, 10],
      },

      {
        columns: [
          { width: "*", text: "" },
          {
            table: {
              body: [
                ["Items Subtotal:", `$${invoice.itemPrice.toFixed(2)}`],
                isBooking
                  ? ["Labor Fee:", `$${invoice.labourFee.toFixed(2)}`]
                  : [],
                [
                  { text: "Total Amount:", bold: true },
                  {
                    text: `$${invoice.total.toFixed(2)}`,
                    bold: true,
                    color: "#2563eb",
                  },
                ],
              ].filter((row) => row.length > 0),
            },
            layout: "noBorders",
          },
        ],
        margin: [0, 10, 0, 20],
      },

      { text: "Payment Information", style: "sectionHeader" },
      {
        columns: [
          [
            {
              text: `Payment Method: ${invoice.payment.method.toUpperCase()}`,
              style: "meta",
            },
            {
              text: `Transaction ID: ${invoice.payment.transactionId}`,
              style: "meta",
            },
          ],
          [
            {
              text: `Reference ID: ${invoice.payment.referenceId}`,
              style: "meta",
            },
            {
              text: `Payment Date: ${format(
                new Date(invoice.payment.paid_at),
                "MMM dd, yyyy 'at' h:mm a"
              )}`,
              style: "meta",
            },
          ],
        ],
        margin: [0, 10, 0, 30],
      },

      {
        text: `Thank you for choosing ${invoice.companyName}!`,
        style: "footer",
      },
      {
        text: "This is a computer-generated invoice.",
        style: "meta",
        alignment: "center",
      },
    ],
    styles: {
      title: { fontSize: 18, bold: true, color: "#1e40af" },
      subtitle: { fontSize: 10, color: "#6b7280" },
      invoiceHeader: { fontSize: 14, bold: true, alignment: "right" },
      badge: {
        fontSize: 8,
        color: "#065f46",
        bold: true,
        background: "#d1fae5",
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        margin: [0, 12, 0, 4],
        color: "#1e40af",
      },
      meta: { fontSize: 9, color: "#374151" },
      footer: { alignment: "center", margin: [0, 10, 0, 5], color: "#1f2937" },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake.createPdf(docDefinition).download(`Invoice_${invoice.invoiceId}.pdf`);
}
