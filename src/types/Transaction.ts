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

interface Transaction {
  _id: string;
  payment_id: string;
  user_id: User;
  service_id: Service;
  booking_id: Booking;
  phone: string;
  method: string;
  labour_fee: number;
  item_price: number;
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

interface TransactionResponse {
  status: string;
  result: number;
  transactions: Transaction[];
}

export type { User, Service, Booking, Transaction, TransactionResponse };
