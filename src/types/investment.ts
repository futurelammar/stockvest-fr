import type { Stock } from "./stock";

export type InvestmentStatusValue = "active" | "completed" | "cancelled";

export interface InvestmentPlanRef {
  _id: string;
  planName: string;
  roiPercentage: number;
  durationInDays: number;
  stock: Stock;
}

export interface Investment {
  _id: string;
  plan: InvestmentPlanRef;
  amountInvested: number;
  roiPercentage: number;
  durationInDays: number;
  startDate: string;
  maturityDate: string;
  status: InvestmentStatusValue;
  expectedProfit: number;
  profitCredited: boolean;
}