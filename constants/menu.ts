/**
 * Menu model ("reversed bill split")
 * ----------------------------------
 * Bill-split divides a known total; this builds a total up from chosen items:
 * pick what you ate → line subtotals → charges (service charge, tax) → grand
 * total, modelled on the real Sunthai receipt in constants/receipt.jpeg:
 *
 *   Sunthai
 *   ├── Tomyum Fried Rice (Seafood) ×2 ..... RM27.90
 *   ├── Thai Milk Tea ×9 ................... RM71.10
 *   ├── Set for 4 Person ×1 ............... RM99.90   (set — not itemised)
 *   ├── ...
 *   └── Bill
 *       ├── Subtotal .................. RM820.00
 *       ├── Service Charge (10%) ...... RM82.00
 *       ├── Service Tax (6%) .......... RM49.20
 *       └── Net Total ................. RM951.20
 *
 * The CATALOG below is reference data transcribed from that receipt. The set
 * is a single line — its contents are intentionally not broken out. The user's
 * selection lives in menuContext and starts empty.
 */

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

/* -------------------------------------------------------------------------- */
/*  Display config                                                            */
/* -------------------------------------------------------------------------- */

export const CURRENCY_PREFIX = 'RM';

export const formatCurrency = (n: number): string => `${CURRENCY_PREFIX}${n.toFixed(2)}`;

export const CATEGORY_LABELS: Record<MenuItemCategory, string> = {
  main: 'Mains',
  side: 'Sides',
  dessert: 'Desserts',
  drink: 'Drinks',
  set: 'Set Menu',
  addon: 'Add-ons',
  other: 'Other',
};

/** Display order of categories on the menu screen. */
export const CATEGORY_ORDER: MenuItemCategory[] = [
  'set',
  'main',
  'side',
  'dessert',
  'drink',
  'addon',
  'other',
];

/* -------------------------------------------------------------------------- */
/*  Catalog (selectable items)                                                */
/* -------------------------------------------------------------------------- */

/** A choosable item. Order lines reference these by id. */
export type CatalogItem = {
  id: string;
  name: string;
  category: MenuItemCategory;
  unitPrice: number;
  emoji?: string;
};

// Transcribed from the Sunthai receipt (constants/receipt.jpeg). Item codes
// from the receipt are kept as ids; unit prices are derived from each line's
// total ÷ quantity. The set is a single line — its contents aren't itemised.
export const CATALOG: CatalogItem[] = [
  // Set
  { id: 's009', name: 'Set for 4 Person', category: 'set', unitPrice: 99.9, emoji: '🍱' },

  // Mains
  { id: '080', name: 'Tomyum Fried Rice (Seafood)', category: 'main', unitPrice: 13.95, emoji: '🍚' },
  { id: '081', name: 'Pineapple Fried Rice', category: 'main', unitPrice: 13.9, emoji: '🍍' },
  { id: '100', name: 'Pad Thai (Seafood)', category: 'main', unitPrice: 17.9, emoji: '🍤' },
  { id: '091', name: 'Pad Kra Pao with Rice', category: 'main', unitPrice: 14.9, emoji: '🌶️' },
  { id: '092', name: 'Pad Kreng Keng with Rice', category: 'main', unitPrice: 14.9, emoji: '🍛' },
  { id: '097', name: 'Thai Sauce Chicken Chop', category: 'main', unitPrice: 14.9, emoji: '🍗' },
  { id: '099', name: 'Sweet & Sour Chicken Chop', category: 'main', unitPrice: 14.9, emoji: '🍗' },
  { id: '045', name: 'Fried Garlic Chicken', category: 'main', unitPrice: 17.9, emoji: '🧄' },
  { id: '094', name: 'Fried Garlic Chicken with Rice', category: 'main', unitPrice: 14.9, emoji: '🍗' },
  { id: '095', name: 'Fried Garlic Beef with Rice', category: 'main', unitPrice: 15.9, emoji: '🥩' },
  { id: '096', name: 'Stir Fried Petai Chicken', category: 'main', unitPrice: 14.9, emoji: '🫛' },
  { id: '104', name: 'Stir Fried Glass Noodle', category: 'main', unitPrice: 22.9, emoji: '🍜' },
  { id: '106', name: 'Tomyum Soup (Glass Noodle, Seafood)', category: 'main', unitPrice: 26.0, emoji: '🍲' },
  { id: '132', name: 'Fish Ball & Chicken Meat', category: 'main', unitPrice: 21.9, emoji: '🍢' },

  // Sides
  { id: '126', name: 'White Rice', category: 'side', unitPrice: 3.0, emoji: '🍚' },
  { id: '127', name: 'Fried Egg', category: 'side', unitPrice: 2.0, emoji: '🍳' },

  // Desserts
  { id: '122', name: 'Fruit Bowl', category: 'dessert', unitPrice: 3.0, emoji: '🍉' },
  { id: 'r12', name: 'Thai Kaya Toast (2 Pcs)', category: 'dessert', unitPrice: 5.0, emoji: '🍞' },
  { id: 'r11', name: 'Thai Kaya Toast (1 Pc)', category: 'dessert', unitPrice: 3.0, emoji: '🍞' },
  { id: 'r3', name: 'Banana Roti + Nutella', category: 'dessert', unitPrice: 7.9, emoji: '🍌' },
  { id: 'r4', name: 'Banana Roti + Both Topping', category: 'dessert', unitPrice: 7.9, emoji: '🍌' },
  { id: 'r2', name: 'Banana Roti + Condensed Milk', category: 'dessert', unitPrice: 7.9, emoji: '🍌' },

  // Drinks
  { id: '801', name: 'Thai Milk Tea', category: 'drink', unitPrice: 7.9, emoji: '🧋' },
  { id: '802', name: 'Thai Green Milk Tea', category: 'drink', unitPrice: 11.9, emoji: '🍵' },
  { id: 'b03', name: 'Lime Juice', category: 'drink', unitPrice: 6.9, emoji: '🍋' },
  { id: '810', name: 'Watermelon Juice', category: 'drink', unitPrice: 8.9, emoji: '🍉' },
  { id: '823', name: 'Plum Soda', category: 'drink', unitPrice: 9.9, emoji: '🥤' },
  { id: '830', name: 'Mango Ice Blended', category: 'drink', unitPrice: 10.9, emoji: '🥭' },
  { id: '858', name: 'Sky Juice', category: 'drink', unitPrice: 1.0, emoji: '💧' },
];

export const catalogItem = (id: string): CatalogItem | undefined =>
  CATALOG.find((i) => i.id === id);

/* -------------------------------------------------------------------------- */
/*  Order config + math                                                       */
/* -------------------------------------------------------------------------- */

/** Defaults — 10% service charge, then 6% service tax on top. */
export const SERVICE_CHARGE_RATE = 0.1;
export const SERVICE_TAX_RATE = 0.06;

/** Shared sheet where everyone ticks that they've paid and how much. */
export const PAYMENT_RECORD_URL =
  'https://daythreedigitalberhad.sharepoint.com/:x:/s/DigitalTransformationDepartment/IQBtE6APypp7Rrj6YRP84AT8AVJO68A1yVRClzKfw3pmKbs?e=DIkWdY';

/** A chosen catalog item and how many. */
export type OrderLine = {
  itemId: string;
  quantity: number;
};

const roundCents = (n: number): number => Math.round(n * 100) / 100;

/** Resolve order lines into priced MenuItem rows (drops unknown / empty). */
export const buildItems = (
  lines: OrderLine[],
  catalog: CatalogItem[] = CATALOG,
): MenuItem[] => {
  const byId = new Map(catalog.map((i) => [i.id, i]));
  return lines
    .filter((l) => l.quantity > 0)
    .map((l) => {
      const item = byId.get(l.itemId);
      if (!item) return null;
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: l.quantity,
        unitPrice: item.unitPrice,
        subtotal: roundCents(item.unitPrice * l.quantity),
      } satisfies MenuItem;
    })
    .filter((x): x is MenuItem => x !== null);
};

export type ChargeOptions = {
  serviceChargeRate?: number;
  serviceTaxRate?: number;
};

/** Standard service charge + service tax stacked on a subtotal. */
export const computeCharges = (subtotal: number, opts?: ChargeOptions): MenuCharge[] => {
  const serviceRate = opts?.serviceChargeRate ?? SERVICE_CHARGE_RATE;
  const taxRate = opts?.serviceTaxRate ?? SERVICE_TAX_RATE;
  const serviceCharge = roundCents(subtotal * serviceRate);
  const tax = roundCents((subtotal + serviceCharge) * taxRate);
  return [
    {
      id: 'service_charge',
      name: `Service Charge (${Math.round(serviceRate * 100)}%)`,
      type: 'service_charge',
      percentage: serviceRate * 100,
      amount: serviceCharge,
    },
    {
      id: 'service_tax',
      name: `Service Tax (${Math.round(taxRate * 100)}%)`,
      type: 'service_tax',
      percentage: taxRate * 100,
      amount: tax,
    },
  ];
};

/** Roll items + charges into the payment summary. */
export const summarize = (items: MenuItem[], charges: MenuCharge[]): PaymentSummary => {
  const subtotal = roundCents(items.reduce((s, i) => s + i.subtotal, 0));
  const totalCharges = roundCents(
    charges.filter((c) => c.type !== 'discount').reduce((s, c) => s + c.amount, 0),
  );
  const totalDiscounts = roundCents(
    charges.filter((c) => c.type === 'discount').reduce((s, c) => s + c.amount, 0),
  );
  return {
    subtotal,
    totalCharges,
    totalDiscounts,
    grandTotal: roundCents(subtotal + totalCharges - totalDiscounts),
  };
};

/** One-shot: order lines → fully priced items, charges and summary. */
export const computeOrder = (
  lines: OrderLine[],
  opts?: ChargeOptions,
): { items: MenuItem[]; charges: MenuCharge[]; summary: PaymentSummary } => {
  const items = buildItems(lines);
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const charges = items.length ? computeCharges(subtotal, opts) : [];
  return { items, charges, summary: summarize(items, charges) };
};

/** Group the catalog by category in display order, dropping empty sections. */
export const catalogByCategory = (catalog: CatalogItem[] = CATALOG) =>
  CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: catalog.filter((i) => i.category === category),
  })).filter((section) => section.items.length > 0);
