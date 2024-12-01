import React from 'react';
import { Wallet } from 'lucide-react';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Dashboard } from './components/Dashboard';
import { WalletSelector } from './components/WalletSelector';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Wallet className="w-8 h-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Smart Finance Tracker
                </span>
              </div>
              <div className="flex items-center">
                <WalletSelector />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Dashboard />
              <div className="mt-8">
                <TransactionList />
              </div>
            </div>
            <div>
              <TransactionForm />
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;