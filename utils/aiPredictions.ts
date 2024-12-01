import * as tf from '@tensorflow/tfjs';
import { Transaction } from '../types/finance';
import { startOfMonth, subMonths } from 'date-fns';

export async function predictNextMonthExpenses(transactions: Transaction[]) {
  // Group expenses by category and month
  const monthlyExpenses = new Map<string, number[]>();
  
  // Get last 6 months of data
  const today = new Date();
  const months = Array.from({ length: 6 }, (_, i) => 
    startOfMonth(subMonths(today, i))
  );

  // Initialize categories
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      if (!monthlyExpenses.has(t.category)) {
        monthlyExpenses.set(t.category, Array(6).fill(0));
      }
    });

  // Fill in the data
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const monthIndex = months.findIndex(m => 
        startOfMonth(t.date).getTime() === m.getTime()
      );
      if (monthIndex !== -1) {
        const expenses = monthlyExpenses.get(t.category)!;
        expenses[monthIndex] += t.amount;
      }
    });

  // Prepare predictions
  const predictions: { category: string; amount: number }[] = [];

  // Create and train a simple model for each category
  for (const [category, expenses] of monthlyExpenses.entries()) {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 8, inputShape: [6], activation: 'relu' }),
        tf.layers.dense({ units: 1 }),
      ],
    });

    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    // Prepare training data
    const x = tf.tensor2d([expenses], [1, 6]);
    const y = tf.tensor2d([[expenses[0]]], [1, 1]);

    // Train the model
    await model.fit(x, y, { epochs: 100, verbose: 0 });

    // Make prediction
    const prediction = model.predict(x) as tf.Tensor;
    const predictedAmount = Math.max(0, Math.round(prediction.dataSync()[0]));

    predictions.push({
      category,
      amount: predictedAmount,
    });
  }

  return predictions;
}