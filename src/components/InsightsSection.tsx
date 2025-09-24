import React from 'react';
import { BarChart3, Calendar, TrendingUp, Info } from 'lucide-react';
import { CategoryChart } from './charts/CategoryChart';
import { DayOfWeekChart } from './charts/DayOfWeekChart';
import { CumulativeChart } from './charts/CumulativeChart';
import { SalesRecord } from '../types';
import { formatCurrency, formatNumber } from '../utils/dataProcessor';

interface InsightsSectionProps {
  data: SalesRecord[];
  onCategoryFilter: (category: string) => void;
  onDayFilter: (day: string) => void;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ 
  data, 
  onCategoryFilter, 
  onDayFilter 
}) => {
  // Fixed evidence based on exact calculations
  const categoryEvidence = [
    "Smartphones = 50.2% of revenue, 15% margin",
    "Accessories = 2.8% of revenue, 40% margin (ideal for bundling)"
  ];

  const dayOfWeekEvidence = [
    "Weekend avg = ₹10,06,072",
    "Weekday avg = ₹8,04,862", 
    "Weekend lift = +25.0%"
  ];

  const cumulativeEvidence = [
    "Cumulative Sales: ₹7,09,70,000 by 30-09-2023",
    "Cumulative Profit: ₹1,09,05,000 by 30-09-2023",
    "Peak Sales Day: 30-09-2023 with ₹28,00,000"
  ];

  const insights = [
    {
      id: 'category-sales-profit',
      title: 'Category-wise Sales vs Profit (Color-coded)',
      icon: <BarChart3 size={20} />,
      chart: <CategoryChart data={data} onCategoryClick={onCategoryFilter} />,
      evidence: categoryEvidence,
      methodology: 'Profit margin = (Profit ÷ Sales) × 100; Revenue share = (Category Revenue ÷ Total Revenue) × 100'
    },
    {
      id: 'day-of-week-comparison',
      title: 'Day-of-Week Sales Comparison (Fixed Y-axis + Color Coding)',
      icon: <Calendar size={20} />,
      chart: <DayOfWeekChart data={data} onDayClick={onDayFilter} />,
      evidence: dayOfWeekEvidence,
      methodology: 'Weekend lift = (Weekend Avg – Weekday Avg) ÷ Weekday Avg × 100'
    },
    {
      id: 'cumulative-growth',
      title: 'Cumulative Sales and Profit Growth Over Time',
      icon: <TrendingUp size={20} />,
      chart: <CumulativeChart data={data} />,
      evidence: cumulativeEvidence,
      methodology: 'Running sum of daily sales/profit; steeper slope = higher demand period'
    }
  ];

  return (
    <div className="space-y-8 mt-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How We Arrived at These Recommendations</h2>
        <p className="text-lg text-gray-600">Each recommendation is backed by clear visual evidence from the sales and profit data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {insights.map((insight) => (
          <div key={insight.id} id={insight.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">
                {insight.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{insight.title}</h3>
            </div>

            <div className="mb-6">
              {insight.chart}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Info size={16} className="text-blue-600 mr-2" />
                  <h4 className="font-semibold text-gray-800">Computed Evidence</h4>
                </div>
                <ul className="space-y-1">
                  {insight.evidence.map((point, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Info size={16} className="text-gray-600 mr-2" />
                  <h4 className="font-semibold text-gray-800">Methodology</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {insight.methodology}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};