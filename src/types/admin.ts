export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "admin";
}
 
export interface AdminLoginResponse {
  accessToken: string;
  user: AdminUser;
}
 
export interface AdminLoginDto {
  email: string;
  password: string;
}


export interface AdminOverview {
  users: { total: number; active: number; inactive: number; admins: number };
  plans: { total: number; active: number };
  investments: { active: number; completed: number; totalInvested: number; totalProfitPaid: number };
  deposits: { pending: number; approved: number; totalDeposited: number };
  withdrawals: { pending: number; approvedOrPaid: number; totalWithdrawn: number };
}

export interface RecentDepositActivity {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  user?: { fullName: string; email: string };
}

export interface RecentWithdrawalActivity {
  _id: string;
  amount: number;
  status: string;
  coinType: string;
  network: string;
  createdAt: string;
  user?: { fullName: string; email: string };
}

export interface RecentInvestmentActivity {
  _id: string;
  amountInvested: number;
  status: string;
  createdAt: string;
  user?: { fullName: string; email: string };
  plan?: { planName: string };
}

export interface RecentUserActivity {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface RecentActivity {
  recentDeposits: RecentDepositActivity[];
  recentWithdrawals: RecentWithdrawalActivity[];
  recentInvestments: RecentInvestmentActivity[];
  recentUsers: RecentUserActivity[];
}