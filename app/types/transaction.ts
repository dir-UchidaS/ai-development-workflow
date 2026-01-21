export type TransactionType = 'income' | 'expense';

export type IncomeCategory = '給与' | '賞与' | '副業' | 'その他収入';
export type ExpenseCategory = '食費' | '住居費' | '光熱費' | '交通費' | '通信費' | '娯楽費' | '医療費' | 'その他支出';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: IncomeCategory | ExpenseCategory;
  description: string;
}
