// types/Invoice.ts

export interface InventoryItem {
  item: {
    name: string;
    inventory_id: string;
    price: number;
  };
  quantity: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Payment {
  method: string;
  transactionId: string;
  referenceId: string;
  status: string;
  paid_at: string;
  booking_id?: {
    booking_id: string;
    booking_date: string;
  };
}

export interface BookingInfo {
  booking_id: string;
  booking_date: string;
}

export interface ServiceInfo {
  service_name: string;
  service_id: string;
}

export interface BaseInvoice {
  companyName: string;
  invoiceId: string;
  date: string;
  customer: Customer;
  items: InventoryItem[];
  itemPrice: number;
  total: number;
  payment: Payment;
  type: "inventory" | "booking";
}

export interface InventoryInvoice extends BaseInvoice {
  type: "inventory";
}

export interface BookingInvoice extends BaseInvoice {
  type: "booking";
  service: ServiceInfo;
  labourFee: number;
  booking: BookingInfo;
}

export type Invoice = InventoryInvoice | BookingInvoice;

export interface InvoiceData {
  status: "success";
  invoice: Invoice;
}
