export interface Stock {
  _id: string;
  name: string;
  ticker: string;
  logoUrl?: string;
  sector?: string;
  currentPrice: number;
  previousClose: number;
  changePercent: number;
  isCustom: boolean;
  status: "active" | "inactive";
  lastSyncedAt?: string;
}

export interface InvestmentPlan {
  _id: string;
  planName: string;
  description: string;
  stock: Stock;
  durationInDays: number;
  roiPercentage: number;
  minimumInvestment: number;
  maximumInvestment: number;
  status: "active" | "inactive";
  featuredImage?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}