import { SalesRecord, KPIData } from '../types';

export const parseCSVData = (csvData: string): SalesRecord[] => {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const record = {
      Date: values[0],
      DayOfWeek: values[1],
      StoreID: parseInt(values[2]),
      StoreLocation: values[3],
      ProductCategory: values[4],
      UnitsSold: parseInt(values[5]),
      TotalSales_INR: parseInt(values[6]),
      Profit_INR: parseInt(values[7])
    };

    // Calculate derived metrics
    const date = new Date(record.Date.split('-').reverse().join('-'));
    const profitMargin = (record.Profit_INR / record.TotalSales_INR) * 100;
    const revenuePerUnit = record.TotalSales_INR / record.UnitsSold;
    const month = date.toLocaleString('en-US', { month: 'long' });
    const week = getWeekNumber(date);

    return {
      ...record,
      Month: month,
      Week: week,
      ProfitMargin: profitMargin,
      RevenuePerUnit: revenuePerUnit
    };
  });
};

const getWeekNumber = (date: Date): number => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

export const calculateKPIs = (data: SalesRecord[]): KPIData => {
  // Handle empty data array
  if (data.length === 0) {
    return {
      totalRevenue: 0,
      totalUnitsSold: 0,
      totalProfit: 0,
      topStore: 'N/A',
      topCategory: 'N/A'
    };
  }

  const totalRevenue = data.reduce((sum, record) => sum + record.TotalSales_INR, 0);
  const totalUnitsSold = data.reduce((sum, record) => sum + record.UnitsSold, 0);
  const totalProfit = data.reduce((sum, record) => sum + record.Profit_INR, 0);
  
  // Calculate top store by revenue
  const storeRevenues = data.reduce((acc, record) => {
    acc[record.StoreLocation] = (acc[record.StoreLocation] || 0) + record.TotalSales_INR;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedStores = Object.entries(storeRevenues).sort(([,a], [,b]) => b - a);
  const topStore = sortedStores.length > 0 ? sortedStores[0][0] : 'N/A';
  
  // Calculate top category by revenue
  const categoryRevenues = data.reduce((acc, record) => {
    acc[record.ProductCategory] = (acc[record.ProductCategory] || 0) + record.TotalSales_INR;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedCategories = Object.entries(categoryRevenues).sort(([,a], [,b]) => b - a);
  const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'N/A';

  return {
    totalRevenue,
    totalUnitsSold,
    totalProfit,
    topStore,
    topCategory
  };
};

export const applyFilters = (data: SalesRecord[], filters: Partial<any>): SalesRecord[] => {
  return data.filter(record => {
    if (filters.store && filters.store !== 'all' && record.StoreLocation !== filters.store) return false;
    if (filters.category && filters.category !== 'all' && record.ProductCategory !== filters.category) return false;
    if (filters.month && filters.month !== 'all' && record.Month !== filters.month) return false;
    if (filters.dayOfWeek && filters.dayOfWeek !== 'all' && record.DayOfWeek !== filters.dayOfWeek) return false;
    if (filters.profitRange && (record.ProfitMargin < filters.profitRange[0] || record.ProfitMargin > filters.profitRange[1])) return false;
    
    return true;
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(value);
};