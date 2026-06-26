import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type OrderLine } from '../constants/menu';
import { StorageKeys, getItem, setItem } from './tokenContext';

type MenuContextValue = {
  /** The current selection (what's being ordered now). */
  lines: OrderLine[];
  /** Who's paying — shown in the personalised bill. */
  payerName: string;
  setPayerName: (name: string) => void;
  /** The previously saved order, for the "what did you eat last time?" prompt. */
  lastOrder: OrderLine[];
  isHydrated: boolean;
  /** Quantity currently selected for an item. */
  quantityOf: (itemId: string) => number;
  addItem: (itemId: string) => void;
  decrement: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
  /** Persist the current order as "last time" (the receipt you just paid). */
  saveOrder: () => Promise<void>;
  /** Load the last saved order back into the current selection. */
  reorderLast: () => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [payerName, setPayerName] = useState('');
  const [lastOrder, setLastOrder] = useState<OrderLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore the previous order once on mount (powers the recall prompt).
  useEffect(() => {
    let active = true;
    getItem<OrderLine[]>(StorageKeys.menuLastOrder, []).then((stored) => {
      if (active) {
        setLastOrder(stored);
        setIsHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const quantityOf = useCallback(
    (itemId: string) => lines.find((l) => l.itemId === itemId)?.quantity ?? 0,
    [lines],
  );

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setLines((prev) => {
      const others = prev.filter((l) => l.itemId !== itemId);
      return quantity > 0 ? [...others, { itemId, quantity }] : others;
    });
  }, []);

  const addItem = useCallback((itemId: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.itemId === itemId);
      if (existing) {
        return prev.map((l) => (l.itemId === itemId ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { itemId, quantity: 1 }];
    });
  }, []);

  const decrement = useCallback((itemId: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.itemId === itemId ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setLines((prev) => prev.filter((l) => l.itemId !== itemId));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setPayerName('');
  }, []);

  const saveOrder = useCallback(async () => {
    setLastOrder(lines);
    await setItem(StorageKeys.menuLastOrder, lines);
  }, [lines]);

  const reorderLast = useCallback(() => setLines(lastOrder), [lastOrder]);

  const value = useMemo<MenuContextValue>(
    () => ({
      lines,
      lastOrder,
      isHydrated,
      quantityOf,
      addItem,
      decrement,
      setQuantity,
      removeItem,
      clear,
      saveOrder,
      reorderLast,
    }),
    [
      lines,
      lastOrder,
      isHydrated,
      quantityOf,
      addItem,
      decrement,
      setQuantity,
      removeItem,
      clear,
      saveOrder,
      reorderLast,
    ],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = (): MenuContextValue => {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error('useMenu must be used within a <MenuProvider>');
  }
  return ctx;
};
