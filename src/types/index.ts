export interface SalesRecord {
  Date: string;
  DayOfWeek: string;
  StoreID: number;
  StoreLocation: string;
  ProductCategory: string;
  UnitsSold: number;
  TotalSales_INR: number;
  Profit_INR: number;
  Month: string;
  Week: number;
  ProfitMargin: number;
  RevenuePerUnit: number;
}

export interface KPIData {
  totalRevenue: number;
  totalUnitsSold: number;
  totalProfit: number;
  topStore: string;
  topCategory: string;
}

export interface Filters {
  store: string;
  category: string;
  month: string;
  dayOfWeek: string;
  profitRange: [number, number];
  dateRange: [string, string];
}

export interface GameState {
  score: number;
  attempts: number;
  correctGuesses: number;
  currentQuestion: string;
  showHint: boolean;
}