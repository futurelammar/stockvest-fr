export type TransactionType = "deposit" | "withdrawal" | "investment" | "profit" | "adjustment";
export type TransactionStatusValue = "pending" | "completed" | "failed";

export interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  
  status: TransactionStatusValue;
  reference: string;
  description?: string;
  createdAt: string;
}

export interface TransactionSummary {
  totalDeposited: number;
  totalWithdrawn: number;
  totalInvested: number;
  totalProfit: number;
}