export interface EntityTransaction {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  frequency?: number;
}