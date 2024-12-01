export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: Date;
  description: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface FinanceStats {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  budgets: Budget[];
}