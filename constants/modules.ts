import { type ComponentProps } from 'react';
import { type MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href } from 'expo-router';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type ModuleStatus = 'planning' | 'in-progress' | 'done';

export type FinanceModule = {
  key: string;
  name: string;
  goal: string;
  icon: IconName;
  status: ModuleStatus;
  /** In-app route, once the module has real screens to navigate to. */
  route?: Href;
};

/** Mirrors the Finance category in about.md - keep both in sync when a module's status changes. */
export const financeModules: FinanceModule[] = [
  {
    key: 'kutu',
    name: 'Kutu Tracker',
    goal: 'Manage kutu groups from start to payout',
    icon: 'account-group',
    status: 'in-progress',
    route: '/kutu',
  },
  {
    key: 'money',
    name: 'Money Tracker',
    goal: 'Track income, expenses, and monthly budgets in one place',
    icon: 'cash-multiple',
    status: 'planning',
  },
  {
    key: 'bill',
    name: 'Bill Split',
    goal: 'Split shared expenses with friends and family',
    icon: 'receipt-text-outline',
    status: 'planning',
  },
  {
    key: 'saving',
    name: 'Savings Goals',
    goal: 'Track progress towards savings targets',
    icon: 'piggy-bank-outline',
    status: 'planning',
  },
];
