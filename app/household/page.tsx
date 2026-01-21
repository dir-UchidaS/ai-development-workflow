'use client';

import { useState, useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import { useLocalStorage } from '@/app/hooks/useLocalStorage';

import type { Transaction, TransactionType, IncomeCategory, ExpenseCategory } from '@/app/types/transaction';

const INCOME_CATEGORIES: IncomeCategory[] = ['給与', '賞与', '副業', 'その他収入'];
const EXPENSE_CATEGORIES: ExpenseCategory[] = ['食費', '住居費', '光熱費', '交通費', '通信費', '娯楽費', '医療費', 'その他支出'];

export default function HouseholdPage() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('household_transactions', []);
  const [activeTab, setActiveTab] = useState('overview');

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const breakdown = new Map<string, { amount: number; type: TransactionType }>();

    transactions.forEach(t => {
      const current = breakdown.get(t.category) || { amount: 0, type: t.type };
      breakdown.set(t.category, {
        amount: current.amount + t.amount,
        type: t.type,
      });
    });

    return Array.from(breakdown.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        type: data.type,
        percentage: summary[data.type] > 0 ? (data.amount / summary[data.type]) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, summary]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          家計簿アプリ
        </h1>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-2 mb-6 border-b border-slate-200">
            <Tabs.Trigger
              value="overview"
              className="px-6 py-3 font-medium text-slate-700 hover:text-slate-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-colors"
            >
              概要
            </Tabs.Trigger>
            <Tabs.Trigger
              value="history"
              className="px-6 py-3 font-medium text-slate-700 hover:text-slate-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-colors"
            >
              取引履歴
            </Tabs.Trigger>
            <Tabs.Trigger
              value="categories"
              className="px-6 py-3 font-medium text-slate-700 hover:text-slate-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-colors"
            >
              カテゴリ内訳
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="overview">
            <OverviewTab
              summary={summary}
              onAddTransaction={addTransaction}
            />
          </Tabs.Content>

          <Tabs.Content value="history">
            <HistoryTab
              transactions={transactions}
              onUpdate={updateTransaction}
              onDelete={deleteTransaction}
            />
          </Tabs.Content>

          <Tabs.Content value="categories">
            <CategoriesTab breakdown={categoryBreakdown} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

interface OverviewTabProps {
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

function OverviewTab({ summary, onAddTransaction }: OverviewTabProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !category) return;

    onAddTransaction({
      type,
      amount: parseFloat(amount),
      date,
      category: category as IncomeCategory | ExpenseCategory,
      description,
    });

    setAmount('');
    setDescription('');
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-sm font-medium text-slate-600 mb-2">収入</h3>
          <p className="text-3xl font-bold text-green-600">
            ¥{summary.income.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-sm font-medium text-slate-600 mb-2">支出</h3>
          <p className="text-3xl font-bold text-red-600">
            ¥{summary.expense.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-sm font-medium text-slate-600 mb-2">収支</h3>
          <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ¥{summary.balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">新規取引を追加</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                type === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              収入
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              支出
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                金額
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                日付
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IncomeCategory | ExpenseCategory)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              説明
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="取引の説明を入力..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            取引を追加
          </button>
        </form>
      </div>
    </div>
  );
}

interface HistoryTabProps {
  transactions: Transaction[];
  onUpdate: (id: string, updates: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
}

function HistoryTab({ transactions, onUpdate, onDelete }: HistoryTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">取引履歴</h2>
      {sortedTransactions.length === 0 ? (
        <p className="text-center py-12 text-slate-500">
          取引がありません。概要タブから追加してください。
        </p>
      ) : (
        <div className="space-y-3">
          {sortedTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              isEditing={editingId === transaction.id}
              onEdit={() => setEditingId(transaction.id)}
              onCancelEdit={() => setEditingId(null)}
              onUpdate={(updates) => {
                onUpdate(transaction.id, updates);
                setEditingId(null);
              }}
              onDelete={() => onDelete(transaction.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TransactionItemProps {
  transaction: Transaction;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (updates: Partial<Transaction>) => void;
  onDelete: () => void;
}

function TransactionItem({ transaction, isEditing, onEdit, onCancelEdit, onUpdate, onDelete }: TransactionItemProps) {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState(transaction.date);
  const [category, setCategory] = useState(transaction.category);
  const [description, setDescription] = useState(transaction.description);

  const categories = transaction.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    onUpdate({
      amount: parsedAmount,
      date,
      category: category as IncomeCategory | ExpenseCategory,
      description,
    });
  };

  if (isEditing) {
    return (
      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as IncomeCategory | ExpenseCategory)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
          >
            保存
          </button>
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            transaction.type === 'income'
              ? 'bg-green-200 text-green-800'
              : 'bg-red-200 text-red-800'
          }`}>
            {transaction.type === 'income' ? '収入' : '支出'}
          </span>
        </div>
        <div className="font-bold text-slate-900">
          ¥{transaction.amount.toLocaleString()}
        </div>
        <div className="text-slate-600">
          {transaction.date}
        </div>
        <div className="text-slate-900">
          {transaction.category}
        </div>
        <div className="text-slate-600">
          {transaction.description}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          aria-label="編集"
        >
          編集
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
          aria-label="削除"
        >
          削除
        </button>
      </div>
    </div>
  );
}

interface CategoriesTabProps {
  breakdown: Array<{
    category: string;
    amount: number;
    type: TransactionType;
    percentage: number;
  }>;
}

function CategoriesTab({ breakdown }: CategoriesTabProps) {
  const incomeBreakdown = breakdown.filter(b => b.type === 'income');
  const expenseBreakdown = breakdown.filter(b => b.type === 'expense');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">支出カテゴリ内訳</h2>
        {expenseBreakdown.length === 0 ? (
          <p className="text-center py-8 text-slate-500">支出データがありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">カテゴリ</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">金額</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">割合</th>
                </tr>
              </thead>
              <tbody>
                {expenseBreakdown.map(({ category, amount, percentage }) => (
                  <tr key={category} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">{category}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">
                      ¥{amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">収入カテゴリ内訳</h2>
        {incomeBreakdown.length === 0 ? (
          <p className="text-center py-8 text-slate-500">収入データがありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">カテゴリ</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">金額</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">割合</th>
                </tr>
              </thead>
              <tbody>
                {incomeBreakdown.map(({ category, amount, percentage }) => (
                  <tr key={category} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">{category}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">
                      ¥{amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
