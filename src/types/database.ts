
export interface Account {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment';
    balance: number;
    institution: string;
    opened_date: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    type: 'expense' | 'income' | 'investment';
    parent_id: number | null;
  }
  
  export interface Transaction {
    id: string;
    created_at: string;
    updated_at: string;
    account_id: string;
    category_id: string;
    amount: number; 
    transaction_date: string;
    description: string;
    is_recurring: boolean;
    payment_method: string;
    transaction_type: string;
  }
  
  export interface Budget {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    frequency: 'monthly' | 'quarterly' | 'yearly';
  }
  
  export interface BudgetItem {
    id: number;
    budget_id: number;
    category_id: number;
    planned_amount: number;
    actual_amount: number;
  }
  
  export interface Tag {
    id: number;
    name: string;
  }
  
  export interface Investment {
    id: number;
    created_at: string;
    updated_at: string;
    account_id: number;
    type: 'stock' | 'bond' | 'etf' | 'crypto' | 'real_estate';
    ticker_symbol: string;
    quantity: number;
    purchase_price: number;
    purchase_date: string;
    current_value: number;
    roi: number;
  }
  
  export interface InvestmentHistory {
    id: number;
    investment_id: number;
    snapshot_date: string;
    value: number;
    quantity: number;
    market_price: number;
    notes: string;
  }