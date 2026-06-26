export type MenuItemCategory =
  | 'main'
  | 'side'
  | 'dessert'
  | 'drink'
  | 'set'
  | 'addon'
  | 'other';

export type ChargeType =
  | 'service_charge'
  | 'service_tax'
  | 'government_tax'
  | 'discount'
  | 'rounding'
  | 'other';

export type MenuItem = {
  id: string;
  name: string;
  category: MenuItemCategory;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type MenuCharge = {
  id: string;
  name: string;
  type: ChargeType;
  percentage?: number;
  amount: number;
};

export type PaymentSummary = {
  subtotal: number;
  totalCharges: number;
  totalDiscounts: number;
  grandTotal: number;
};

export type Menu = {
  id: string;
  merchantName?: string;
  branchName?: string;
  receiptNumber?: string;
  purchasedAt?: number;
  items: MenuItem[];
  charges: MenuCharge[];
  summary: PaymentSummary;
};