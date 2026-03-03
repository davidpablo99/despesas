import { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  date: number;
  is_fixed: boolean;
  created_at: number;
}

// Interface comum para o repositório
export interface ITransactionRepository {
  create(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<number>;
  getAll(): Promise<Transaction[]>;
  getSummary(): Promise<{ income: number; expense: number; total: number }>;
  delete(id: number): Promise<void>;
}

// Implementação SQLite (Mobile)
export class SQLiteTransactionRepository implements ITransactionRepository {
  constructor(private db: SQLiteDatabase) {}

  async create(transaction: Omit<Transaction, 'id' | 'created_at'>) {
    const result = await this.db.runAsync(
      'INSERT INTO transactions (amount, description, category, type, date, is_fixed) VALUES (?, ?, ?, ?, ?, ?)',
      transaction.amount,
      transaction.description,
      transaction.category,
      transaction.type,
      transaction.date,
      transaction.is_fixed ? 1 : 0
    );
    return result.lastInsertRowId;
  }

  async getAll() {
    return await this.db.getAllAsync<Transaction>(
      'SELECT * FROM transactions ORDER BY date DESC'
    );
  }

  async getSummary() {
    const transactions = await this.getAll();
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      income,
      expense,
      total: income - expense
    };
  }

  async delete(id: number) {
    await this.db.runAsync('DELETE FROM transactions WHERE id = ?', id);
  }
}

// Implementação em Memória/LocalStorage (Web)
export class WebTransactionRepository implements ITransactionRepository {
  private static STORAGE_KEY = 'despesas_transactions';

  private getTransactions(): Transaction[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(WebTransactionRepository.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler do LocalStorage:', e);
      return [];
    }
  }

  private saveTransactions(transactions: Transaction[]) {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(WebTransactionRepository.STORAGE_KEY, JSON.stringify(transactions));
        console.log(`[WebRepo] ${transactions.length} transações salvas no LocalStorage.`);
      } catch (e) {
        console.error('Erro ao salvar no LocalStorage:', e);
      }
    }
  }

  async create(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<number> {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(), // Simples ID gerado por timestamp
      created_at: Math.floor(Date.now() / 1000)
    };
    
    transactions.unshift(newTransaction); // Adiciona no início
    this.saveTransactions(transactions);
    return newTransaction.id;
  }

  async getAll(): Promise<Transaction[]> {
    return this.getTransactions().sort((a, b) => b.date - a.date);
  }

  async getSummary(): Promise<{ income: number; expense: number; total: number }> {
    const transactions = this.getTransactions();
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      income,
      expense,
      total: income - expense
    };
  }

  async delete(id: number): Promise<void> {
    const transactions = this.getTransactions().filter(t => t.id !== id);
    this.saveTransactions(transactions);
  }
}

// Factory para criar o repositório correto
export function createTransactionRepository(db?: SQLiteDatabase | null): ITransactionRepository {
  if (Platform.OS === 'web') {
    return new WebTransactionRepository();
  }
  
  if (!db) {
    throw new Error('Database instance required for mobile platform');
  }
  
  return new SQLiteTransactionRepository(db);
}
