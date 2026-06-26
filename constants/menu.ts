/**
 * Menu model ("reversed bill split")
 * ----------------------------------
 * Bill-split divides a known total; this builds a total up from chosen items:
 * pick what you ate → line subtotals → charges (service charge, tax) → grand
 * total, modelled on a real receipt:
 *
 *   Sunthai
 *   ├── Main
 *   │   ├── Tom Yum Fried Rice ×2 .......... RM27.80
 *   │   └── Pad Thai Seafood ×1 ............ RM17.90
 *   ├── Drinks
 *   │   └── Thai Milk Tea ×1 ............... RM7.10
 *   └── Bill
 *       ├── Subtotal .................. RM820.00
 *       ├── Service Charge (10%) ...... RM82.00
 *       ├── Service Tax (6%) .......... RM49.20
 *       └── Net Total ................. RM951.20
 *
 * The CATALOG below is reference data (you need items to show). The user's
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

export const CATALOG: CatalogItem[] = [
  { id: 'set_4pax', name: 'Set for 4 Person', category: 'set', unitPrice: 99.9, emoji: '🍱' },
  { id: 'tom_yum_fried_rice', name: 'Tom Yum Fried Rice', category: 'main', unitPrice: 13.9, emoji: '🍚' },
  { id: 'pad_thai_seafood', name: 'Pad Thai Seafood', category: 'main', unitPrice: 17.9, emoji: '🍤' },
  { id: 'pad_kra_pao', name: 'Pad Kra Pao with Rice', category: 'main', unitPrice: 15.9, emoji: '🌶️' },
  { id: 'garlic_chicken', name: 'Fried Garlic Chicken', category: 'main', unitPrice: 17.4, emoji: '🍗' },
  { id: 'pineapple_fried_rice', name: 'Pineapple Fried Rice', category: 'main', unitPrice: 13.9, emoji: '🍍' },
  { id: 'white_rice', name: 'White Rice', category: 'side', unitPrice: 3.0, emoji: '🍚' },
  { id: 'fried_egg', name: 'Fried Egg', category: 'side', unitPrice: 2.0, emoji: '🍳' },
  { id: 'kailan', name: 'Stir Fried Kailan', category: 'side', unitPrice: 12.9, emoji: '🥬' },
  { id: 'mango_sticky_rice', name: 'Mango Sticky Rice', category: 'dessert', unitPrice: 11.9, emoji: '🥭' },
  { id: 'banana_roti', name: 'Banana Roti + Nutella', category: 'dessert', unitPrice: 7.9, emoji: '🍌' },
  { id: 'thai_milk_tea', name: 'Thai Milk Tea', category: 'drink', unitPrice: 7.1, emoji: '🧋' },
  { id: 'lime_juice', name: 'Lime Juice', category: 'drink', unitPrice: 6.9, emoji: '🍋' },
  { id: 'berry_juice', name: 'Berry Juice', category: 'drink', unitPrice: 11.0, emoji: '🫐' },
];

export const catalogItem = (id: string): CatalogItem | undefined =>
  CATALOG.find((i) => i.id === id);

/* -------------------------------------------------------------------------- */
/*  Order config + math                                                       */
/* -------------------------------------------------------------------------- */

/** Defaults — 10% service charge, then 6% service tax on top. */
export const SERVICE_CHARGE_RATE = 0.1;
export const SERVICE_TAX_RATE = 0.06;

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
