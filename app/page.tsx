'use client';

import { useState } from 'react';

type TransactionType = '収入' | '支出';

interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
}

type TabType = '概要' | '取引履歴' | 'カテゴリ内訳';

const categories = {
  収入: ['給与', '副業', 'その他収入'],
  支出: ['食費', '交通費', '娯楽費', '光熱費', '家賃', 'その他支出'],
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('概要');
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2026/01/19',
      type: '支出',
      category: '食費',
      amount: 10000,
      description: '',
    },
  ]);

  // 新規取引フォームの状態
  const [newTransaction, setNewTransaction] = useState({
    type: '支出' as TransactionType,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '食費',
    description: '',
  });

  // 編集中の取引
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  // 月の収入・支出を計算
  const currentMonth = '2026年1月';
  const income = transactions
    .filter(t => t.type === '収入')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === '支出')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  // 取引を追加
  const addTransaction = () => {
    if (newTransaction.amount <= 0) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: newTransaction.date.replace(/-/g, '/'),
      type: newTransaction.type,
      category: newTransaction.category,
      amount: newTransaction.amount,
      description: newTransaction.description,
    };

    setTransactions([...transactions, transaction]);
    setNewTransaction({
      type: '支出',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '食費',
      description: '',
    });
  };

  // 取引を削除
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // 編集開始
  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({ ...transaction });
  };

  // 編集保存
  const saveEdit = () => {
    if (!editForm) return;
    setTransactions(transactions.map(t => t.id === editingId ? editForm : t));
    setEditingId(null);
    setEditForm(null);
  };

  // カテゴリ別集計
  const getCategoryBreakdown = (type: TransactionType) => {
    const breakdown: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === type)
      .forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      });
    return breakdown;
  };

  const expenseBreakdown = getCategoryBreakdown('支出');
  const incomeBreakdown = getCategoryBreakdown('収入');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">家計簿アプリ</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">収入と支出を記録して、家計を管理しましょう</p>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {(['概要', '取引履歴', 'カテゴリ内訳'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === tab
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab === '概要' && (
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                {tab === '取引履歴' && (
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                )}
                {tab === 'カテゴリ内訳' && (
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  </svg>
                )}
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 概要タブ */}
        {activeTab === '概要' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentMonth}の収支</h2>

            {/* サマリーカード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 収入カード */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">収入</span>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">¥{income.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">0件の取引</div>
              </div>

              {/* 支出カード */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">支出</span>
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">¥{expense.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">1件の取引</div>
              </div>

              {/* 収支カード */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">収支</span>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m3 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                  {balance >= 0 ? '' : '-'}¥{Math.abs(balance).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">赤字</div>
              </div>
            </div>

            {/* 新しい取引を追加 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>+</span>
                新しい取引を追加
              </h3>

              <div className="space-y-4">
                {/* 取引種類 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    取引種類
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewTransaction({ ...newTransaction, type: '収入', category: '給与' })}
                      className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                        newTransaction.type === '収入'
                          ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      収入
                    </button>
                    <button
                      onClick={() => setNewTransaction({ ...newTransaction, type: '支出', category: '食費' })}
                      className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                        newTransaction.type === '支出'
                          ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-200'
                          : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      支出
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 金額 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      金額
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                      <input
                        type="number"
                        value={newTransaction.amount || ''}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* 日付 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      日付
                    </label>
                    <input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* カテゴリ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    カテゴリ
                  </label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">カテゴリを選択してください</option>
                    {categories[newTransaction.type].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* 説明 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    説明 (任意)
                  </label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    placeholder="詳細を入力してください"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* 追加ボタン */}
                <button
                  onClick={addTransaction}
                  className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 取引履歴タブ */}
        {activeTab === '取引履歴' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">取引履歴</h2>

            {transactions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">取引履歴がありません</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {editingId === transaction.id && editForm ? (
                      // 編集モード
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value as TransactionType })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                          >
                            <option value="収入">収入</option>
                            <option value="支出">支出</option>
                          </select>
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                          />
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                          >
                            {categories[editForm.type].map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm(null);
                            }}
                            className="flex-1 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 text-sm"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 表示モード
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`text-lg font-bold ${
                            transaction.type === '収入' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === '収入' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">{transaction.category}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(transaction)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="編集"
                          >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                            title="削除"
                          >
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* カテゴリ内訳タブ */}
        {activeTab === 'カテゴリ内訳' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">カテゴリ内訳</h2>

            {/* 支出の内訳 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">支出の内訳</h3>

              {Object.keys(expenseBreakdown).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">支出データがありません</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">カテゴリ</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">金額</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">割合</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(expenseBreakdown)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => {
                          const percentage = ((amount / expense) * 100).toFixed(1);
                          return (
                            <tr key={category} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                              <td className="py-3 px-4 text-gray-900 dark:text-white">{category}</td>
                              <td className="py-3 px-4 text-right text-red-600 dark:text-red-400 font-medium">
                                ¥{amount.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      <tr className="font-bold border-t-2 border-gray-300 dark:border-gray-600">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">合計</td>
                        <td className="py-3 px-4 text-right text-red-600 dark:text-red-400">
                          ¥{expense.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 収入の内訳 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">収入の内訳</h3>

              {Object.keys(incomeBreakdown).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">収入データがありません</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">カテゴリ</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">金額</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">割合</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(incomeBreakdown)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => {
                          const percentage = ((amount / income) * 100).toFixed(1);
                          return (
                            <tr key={category} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                              <td className="py-3 px-4 text-gray-900 dark:text-white">{category}</td>
                              <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                                ¥{amount.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      <tr className="font-bold border-t-2 border-gray-300 dark:border-gray-600">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">合計</td>
                        <td className="py-3 px-4 text-right text-green-600 dark:text-green-400">
                          ¥{income.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
