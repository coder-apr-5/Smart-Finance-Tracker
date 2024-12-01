import { create } from 'zustand';
import { Transaction, Budget, FinanceStats } from '../types/finance';
import { predictNextMonthExpenses } from '../utils/aiPredictions';

interface FinanceStore {
  transactions: Transaction[];
  budgets: Budget[];
  stats: FinanceStats;
  predictions: { category: string; amount: number }[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  calculateStats: () => void;
  generatePredictions: () => void;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  budgets: [],
  stats: {
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
    budgets: [],
  },
  predictions: [],

  addTransaction: (transaction) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    set((state) => ({
      transactions: [...state.transactions, newTransaction],
    }));
    get().calculateStats();
    get().generatePredictions();
  },

  updateBudget: (budget) => {
    set((state) => ({
      budgets: [
        ...state.budgets.filter((b) => b.category !== budget.category),
        budget,
      ],
    }));
    get().calculateStats();
  },

  calculateStats: () => {
    const { transactions, budgets } = get();
    
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const updatedBudgets = budgets.map((budget) => ({
      ...budget,
      spent: transactions
        .filter((t) => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0),
    }));

    set({
      stats: {
        totalIncome,
        totalExpenses,
        savings: totalIncome - totalExpenses,
        budgets: updatedBudgets,
      },
    });
  },

  generatePredictions: async () => {
    const { transactions } = get();
    const predictions = await predictNextMonthExpenses(transactions);
    set({ predictions });
  },
}));