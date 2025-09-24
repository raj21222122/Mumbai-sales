import React from 'react';
import { TrendingUp, Package, DollarSign, Store, Tag } from 'lucide-react';
import { KPIData } from '../types';
import { formatCurrency, formatNumber } from '../utils/dataProcessor';

interface KPICardsProps {
  kpiData: KPIData;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpiData }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpiData.totalRevenue),
      icon: <DollarSign className="text-green-500" size={24} />,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Units Sold',
      value: formatNumber(kpiData.totalUnitsSold),
      icon: <Package className="text-blue-500" size={24} />,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Profit',
      value: formatCurrency(kpiData.totalProfit),
      icon: <TrendingUp className="text-purple-500" size={24} />,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Top Store',
      value: kpiData.topStore,
      icon: <Store className="text-orange-500" size={24} />,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Top Category',
      value: kpiData.topCategory,
      icon: <Tag className="text-pink-500" size={24} />,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center shadow-lg`}>
              {card.icon}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{card.title}</p>
            <p className="text-2xl font-bold text-gray-800 animate-pulse">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};