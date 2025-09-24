import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, Award, Zap, Lightbulb } from 'lucide-react';
import { SalesRecord } from '../types';
import { formatCurrency, formatNumber } from '../utils/dataProcessor';

interface BusinessSimulatorProps {
  data: SalesRecord[];
  filteredData: SalesRecord[];
}

interface SimulationResults {
  expectedRevenue: number;
  expectedProfit: number;
  roi: number;
  revenueToSpendRatio: number;
  profitMargin: number;
}

export const BusinessSimulator: React.FC<BusinessSimulatorProps> = ({ data, filteredData }) => {
  const [budget, setBudget] = useState(500000);
  const [results, setResults] = useState<SimulationResults>({
    expectedRevenue: 0,
    expectedProfit: 0,
    roi: 0,
    revenueToSpendRatio: 0,
    profitMargin: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [bestROI, setBestROI] = useState(0);
  const [bestMove, setBestMove] = useState('');

  useEffect(() => {
    calculateResults();
  }, [budget, filteredData]);

  const calculateResults = () => {
    if (filteredData.length === 0) {
      setResults({
        expectedRevenue: 0,
        expectedProfit: 0,
        roi: 0,
        revenueToSpendRatio: 0,
        profitMargin: 0
      });
      return;
    }

    const totalRevenue = filteredData.reduce((sum, record) => sum + record.TotalSales_INR, 0);
    const totalProfit = filteredData.reduce((sum, record) => sum + record.Profit_INR, 0);
    
    // Corrected logic for a more realistic and consistent business model.
    // Calculate the average profit margin for the filtered data.
    const averageProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) : 0;
    
    // Simulate expected revenue based on the investment budget.
    // This is a key change: instead of a fixed multiplier, let's use a proportional return.
    // We'll calculate a plausible "revenue to spend" ratio from the filtered data.
    // Assuming 'TotalSales_INR' represents revenue, and we need a proxy for 'spend'.
    // We can assume a baseline spend of a certain percentage of total revenue for historical data.
    // Let's use a simple, direct ROI calculation based on the historical average.
    
    const averageROI = totalRevenue > 0 ? (totalProfit / (totalRevenue * 0.04)) : 0; // Assuming 4% of revenue is spend
    const investmentMultiplier = averageROI / 100;

    // Calculate expected profit based on a consistent, direct ROI relationship with the budget.
    const expectedProfit = budget * investmentMultiplier;

    // Calculate expected revenue from the expected profit and investment budget.
    const expectedRevenue = budget + expectedProfit;
    
    const roi = budget > 0 ? (expectedProfit / budget) * 100 : 0;
    const revenueToSpendRatio = budget > 0 ? expectedRevenue / budget : 0;
    
    // The profit margin should be consistent with the other calculated values.
    const profitMargin = expectedRevenue > 0 ? (expectedProfit / expectedRevenue) * 100 : 0;

    const newResults = {
      expectedRevenue,
      expectedProfit,
      roi,
      revenueToSpendRatio,
      profitMargin
    };

    setResults(newResults);

    // Check for best ROI and trigger confetti
    if (roi > bestROI) {
      setBestROI(roi);
      setBestMove(`₹${formatNumber(budget)} budget strategy`);
    }

    if (roi > 15) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const getPerformanceBadge = () => {
    if (results.roi > 15) {
      return { text: '🟢 Smart Investor', color: 'from-green-400 to-green-600', bgColor: 'bg-green-50' };
    } else if (results.roi >= 8) {
      return { text: '🟡 Average Spender', color: 'from-yellow-400 to-yellow-600', bgColor: 'bg-yellow-50' };
    } else {
      return { text: '🔴 Needs Optimization', color: 'from-red-400 to-red-600', bgColor: 'bg-red-50' };
    }
  };

  const getInsights = () => {
    const insights = [];
    
    if (results.roi > 15) {
      insights.push("🎉 Excellent choice! This investment strategy shows strong potential returns.");
    } else if (results.roi < 8) {
      insights.push("💡 Consider adjusting your strategy - try different stores or product categories for better ROI.");
    }

    // Store-specific insights
    const storePerformance = filteredData.reduce((acc, record) => {
      if (!acc[record.StoreLocation]) {
        acc[record.StoreLocation] = { revenue: 0, profit: 0 };
      }
      acc[record.StoreLocation].revenue += record.TotalSales_INR;
      acc[record.StoreLocation].profit += record.Profit_INR;
      return acc;
    }, {} as Record<string, { revenue: number; profit: number }>);

    const topStore = Object.entries(storePerformance)
      .sort(([,a], [,b]) => (b.profit / b.revenue) - (a.profit / a.revenue))[0];

    if (topStore) {
      const margin = ((topStore[1].profit / topStore[1].revenue) * 100).toFixed(1);
      insights.push(`🏪 ${topStore[0]} store shows the highest profit margin at ${margin}% - consider focusing your budget here.`);
    }

    // Category insights
    const categoryPerformance = filteredData.reduce((acc, record) => {
      if (!acc[record.ProductCategory]) {
        acc[record.ProductCategory] = { revenue: 0, profit: 0, margin: 0 };
      }
      acc[record.ProductCategory].revenue += record.TotalSales_INR;
      acc[record.ProductCategory].profit += record.Profit_INR;
      return acc;
    }, {} as Record<string, { revenue: number; profit: number; margin: number }>);

    const topCategory = Object.entries(categoryPerformance)
      .map(([cat, data]) => [cat, (data.profit / data.revenue) * 100])
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];

    if (topCategory) {
      insights.push(`📱 ${topCategory[0]} category offers ${(topCategory[1] as number).toFixed(1)}% profit margin - great for maximizing returns.`);
    }

    if (results.roi > 12) {
      insights.push("🚀 This strategy could be your 'Best Move of the Day' - keep experimenting with different filters!");
    }

    return insights;
  };

  const badge = getPerformanceBadge();
  const insights = getInsights();

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <Calculator className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Business Simulator</h2>
              <p className="opacity-90">Predict your investment returns</p>
            </div>
          </div>
          
          {bestROI > 0 && (
            <div className="text-center">
              <div className="text-sm opacity-75">Best ROI Today</div>
              <div className="text-xl font-bold text-yellow-300">{bestROI.toFixed(1)}%</div>
              <div className="text-xs opacity-60">{bestMove}</div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Budget Input */}
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign size={20} className="mr-2" />
              Investment Budget
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm opacity-75 mb-2">Budget Amount (₹)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-white/20 rounded-lg text-white placeholder-white/50 border border-white/30 focus:border-yellow-400 focus:outline-none"
                  min="50000"
                  max="10000000"
                  step="50000"
                />
              </div>
              
              <div>
                <label className="block text-sm opacity-75 mb-2">Quick Select</label>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="50000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs opacity-60 mt-1">
                  <span>₹1L</span>
                  <span>₹1Cr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Results Cards */}
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-75">Expected Revenue</span>
                <TrendingUp size={16} className="text-green-300" />
              </div>
              <div className="text-2xl font-bold text-green-300">
                {formatCurrency(results.expectedRevenue)}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-75">Expected Profit</span>
                <Target size={16} className="text-blue-300" />
              </div>
              <div className="text-2xl font-bold text-blue-300">
                {formatCurrency(results.expectedProfit)}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-75">ROI</span>
                <Zap size={16} className="text-yellow-300" />
              </div>
              <div className="text-2xl font-bold text-yellow-300">
                {results.roi.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Right Panel - Performance & Insights */}
          <div className="space-y-6">
            {/* Performance Badge */}
            <div className={`${badge.bgColor} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Performance Rating</span>
                <Award size={16} className="text-gray-600" />
              </div>
              <div className={`text-lg font-bold bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`}>
                {badge.text}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <Lightbulb size={16} className="text-yellow-300 mr-2" />
                <span className="font-semibold">Smart Insights</span>
              </div>
              <div className="space-y-2 text-sm opacity-90">
                {insights.map((insight, index) => (
                  <p key={index} className="leading-relaxed">{insight}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner - Gamification */}
        {results.roi > 15 && (
          <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Award className="text-purple-600" size={24} />
              <span className="text-purple-600 font-bold text-lg">Smart Investor Achievement Unlocked!</span>
              <Award className="text-purple-600" size={24} />
            </div>
            <p className="text-purple-600 text-sm mt-1">You've discovered a high-ROI strategy. Keep experimenting!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
      `}</style>
    </div>
  );
};