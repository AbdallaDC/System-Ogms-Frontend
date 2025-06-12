export interface Inventory {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  inventory_id: string;
  __v: number;
}

export interface InventoryListResponse {
  status: string;
  result: number;
  items: Inventory[];
}
