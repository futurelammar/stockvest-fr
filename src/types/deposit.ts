
export type WalletStatus = "active" | "inactive";
export type DepositStatus = "pending" | "approved" | "rejected";

export interface Wallet {
  _id: string;
  coinName: string;       // e.g. "Bitcoin"
  network: string;        // e.g. "BTC", "TRC20"
  walletAddress: string;  // the address users send to
  qrCodeImage?: string;   // optional Cloudinary URL
  status: WalletStatus;
}

export interface DepositUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface Deposit {
  _id: string;
  user: DepositUser;
  wallet: Wallet;
  amount: number;
  proofUrl: string;
  status: DepositStatus;
  note?: string;          // admin rejection note
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDeposits {
  data: Deposit[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateDepositDto {
  walletId: string;
  amount: number;
  proofUrl: string;
}