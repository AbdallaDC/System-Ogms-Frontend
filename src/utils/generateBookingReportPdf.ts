import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { format } from "date-fns";
// Use BookingRecord type for compatibility with API response
export interface BookingRecord {
  _id: string;
  booking_id: string;
  customer: { name: string } | null;
  service: { service_name: string };
  status: string;
  createdAt: string;
  mechanic: { name: string } | null;
}

export function generateBookingReportPdf(
  data: BookingRecord[],
  filters: Record<string, string>
) {
  // Table header
  const tableHeader = ["Date", "Booking ID", "Customer", "Service", "Status"];

  // Table body
  const tableBody = [
    tableHeader,
    ...data.map((row) => [
      row.createdAt ? format(new Date(row.createdAt), "yyyy-MM-dd") : "-",
      row.booking_id || "-",
      row.customer?.name || "-",
      row.service?.service_name || "-",
      row.status,
    ]),
  ];

  const docDefinition: any = {
    content: [
      { text: "Booking Report", style: "header" },
      {
        text: `Generated: ${format(new Date(), "yyyy-MM-dd HH:mm")}`,
        style: "subheader",
        margin: [0, 0, 0, 10],
      },
      {
        style: "dataTable",
        table: {
          headerRows: 1,
          widths: [70, 100, 100, 100, 60],
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

  pdfMake.createPdf(docDefinition).download("booking_report.pdf");
}
