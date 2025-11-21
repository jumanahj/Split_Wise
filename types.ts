export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Split {
  userId: string;
  amount: number;
  isPaid: boolean;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string; // userId
  timestamp: string;
  splits: Split[];
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  inviteCode: string;
  totalBalance?: number;
  recentActivity?: string;
}

export interface RecentExpense extends Expense {
    groupName: string;
}

export interface Balance {
  total: number;
  youOwe: number;
  youAreOwed: number;
}

export interface DashboardData {
    balance: Balance;
    recentExpenses: RecentExpense[];
    spendingData: { name: string, amount: number }[];
    groups: Group[];
}

export interface GroupDetails extends Group {
    expenses: Expense[];
    debts: Debt[];
}

export interface Debt {
    from: User;
    to: User;
    amount: number;
}