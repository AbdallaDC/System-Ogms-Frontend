import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { format } from "date-fns";
import type { PaymentRecord } from "@/app/(admin)/reports/components/PaymentReportTable";

export function generatePaymentReportPdf(
  data: PaymentRecord[],
  filters: Record<string, string>
) {
  // Table header
  const tableHeader = [
    "Date",
    "Customer",
    "Service",
    "Amount",
    "Status",
    "Method",
    "Phone",
  ];

  // Table body
  const tableBody = [
    tableHeader,
    ...data.map((row) => [
      row.paid_at ? format(new Date(row.paid_at), "yyyy-MM-dd") : "-",
      row.user_id?.name || "-",
      row.service_id?.service_name || "-",
      `$${row.amount.toLocaleString()}`,
      row.status,
      row.method || "-",
      row.phone || "-",
    ]),
  ];

  const docDefinition: any = {
    content: [
      { text: "Payment Report", style: "header" },
      {
        text: `Generated: ${format(new Date(), "yyyy-MM-dd HH:mm")}`,
        style: "subheader",
        margin: [0, 0, 0, 10],
      },
      {
        style: "dataTable",
        table: {
          headerRows: 1,
          widths: [70, 100, 100, 60, 60, 60, 80],
          body: tableBody,
        },
        layout: {
          fillColor: (i: number) => (i === 0 ? "#f1f5f9" : null),
          hLineColor: () => "#ddd",
          vLineColor: () => "#ddd",
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: "#1e40af",
        margin: [0, 0, 0, 8],
      },
      subheader: { fontSize: 10, color: "#6b7280" },
      tableHeader: { bold: true, fontSize: 12, color: "#374151" },
      dataTable: { margin: [0, 10, 0, 0] },
    },
    defaultStyle: {
      fontSize: 10,
    },
    pageOrientation: "landscape",
  };

  pdfMake.createPdf(docDefinition).download("payment_report.pdf");
}
