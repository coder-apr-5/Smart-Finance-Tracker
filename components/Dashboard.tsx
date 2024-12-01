import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';
import { AutoSavingsTransfer } from './AutoSavingsTransfer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Dashboard() {
  const { stats, predictions } = useFinanceStore();

  const chartData = {
    labels: ['Current', 'Predicted'],
    datasets: predictions.map((pred) => ({
      label: pred.category,
      data: [
        stats.budgets.find((b) => b.category === pred.category)?.spent || 0,
        pred.amount,
      ],
      borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      tension: 0.4,
    })),
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Income</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(stats.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(stats.totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Savings</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(stats.savings)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">AI Predictions</h2>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                title: {
                  display: true,
                  text: 'Expense Predictions by Category',
                },
              },
            }}
          />
        </div>
      </div>

      <AutoSavingsTransfer />
    </div>
  );
}