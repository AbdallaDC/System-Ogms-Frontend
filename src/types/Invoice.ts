export interface InvoiceData {
  status: string;
  invoice: {
    companyName: string;
    payment: {
      _id: string;
      payment_id: string;
      user_id: {
        _id: string;
        name: string;
        email: string;
        phone: string;
      };
      service_id: {
        _id: string;
        service_name: string;
        description: string;
        price: number;
        service_id: string;
      };
      booking_id: {
        _id: string;
        booking_id: string;
        booking_date: string;
        status: string;
      };
      phone: string;
      method: string;
      item_price: number;
      labour_fee: number;
      amount: number;
      status: string;
      referenceId: string;
      transactionId: string;
      paid_at: string;
    };
    customer: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    service: {
      _id: string;
      service_name: string;
      description: string;
      price: number;
      service_id: string;
    };
    items: Array<{
      item: {
        _id: string;
        name: string;
        type: string;
        price: number;
        inventory_id: string;
      };
      quantity: number;
    }>;
    total: number;
    labourFee: number;
    itemPrice: number;
    date: string;
    invoiceId: string;
  };
}
