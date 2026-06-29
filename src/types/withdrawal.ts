export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface Withdrawal {
  _id: string;
  user: string | WithdrawalUser;
  coinType: string;
  network: string;
  walletAddress: string;
  amount: number;
  status: WithdrawalStatus;
  adminNote?: string;
  reviewedBy?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface CreateWithdrawalDto {
  coinType: string;
  network: string;
  walletAddress: string;
  amount: number;
}

export interface ReviewWithdrawalDto {
  adminNote?: string;
}

export interface QueryWithdrawalsDto {
  page?: number;
  limit?: number;
  status?: WithdrawalStatus;
}

export interface WithdrawalListResponse {
  data: Withdrawal[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const SUPPORTED_COINS = [
  { name: 'Bitcoin',  symbol: 'BTC',  networks: ['BTC'] },
  { name: 'Ethereum', symbol: 'ETH',  networks: ['ERC20'] },
  { name: 'USDT',     symbol: 'USDT', networks: ['TRC20', 'ERC20', 'BEP20'] },
  { name: 'BNB',      symbol: 'BNB',  networks: ['BEP20'] },
  { name: 'USDC',     symbol: 'USDC', networks: ['ERC20', 'TRC20'] },
] as const;

export type SupportedCoinSymbol = (typeof SUPPORTED_COINS)[number]['symbol'];