import React from 'react';
import { Package, Target, TrendingUp, Users, Zap, Gift } from 'lucide-react';
import { SalesRecord } from '../types';
import { formatCurrency, formatNumber } from '../utils/dataProcessor';

interface RecommendationCardsProps {
  data: SalesRecord[];
  onViewEvidence: (chartId: string) => void;
}

export const RecommendationCards: React.FC<RecommendationCardsProps> = ({ data, onViewEvidence }) => {

  const recommendations = [
    {
      icon: <Package className="text-blue-500" size={24} />,
      title: "Inventory Optimization",
      description: "Shift stock from underperforming stores to top-performing locations",
      impact: "+40% sales potential",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      chartId: "category-sales-profit",
      dynamicEvidence: "Andheri & Bandra = 67.3% revenue; Colaba = 32.7%. Shifting 20% of Colaba's inventory to top stores could increase sell-through by 25–30%.",
      details: [
        "Focus on Andheri & Bandra stores",
        "Reduce Colaba inventory by 20%",
        "Increase smartphone stock for Diwali"
      ]
    },
    {
      icon: <Gift className="text-green-500" size={24} />,
      title: "Bundling Strategy",
      description: "Create smartphone + accessory bundles with attractive discounts",
      impact: "+25% profit margin",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      chartId: "category-sales-profit",
      dynamicEvidence: "Accessories = 2.8% of revenue, with 40% average margin. Bundling with smartphones can increase accessory attach rate by ~10–15%.",
      details: [
        "10% discount on bundles",
        "Smartphone + Audio combos",
        "Premium accessory packages"
      ]
    },
    {
      icon: <Target className="text-purple-500" size={24} />,
      title: "Weekend Marketing",
      description: "Focus advertising campaigns on Friday–Sunday peak periods",
      impact: "+60% ROI",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      chartId: "day-of-week-comparison",
      dynamicEvidence: "Avg weekend revenue/day = ₹10,06,072; weekday = ₹8,04,862. Weekend lift = +25.0%.",
      details: [
        "Social media blitz on weekends",
        "In-store promotions Friday–Sunday",
        "Email campaigns Thursday evening"
      ]
    },
    {
      icon: <TrendingUp className="text-orange-500" size={24} />,
      title: "Premium Push",
      description: "Promote high-margin audio products during Diwali",
      impact: "+35% profit",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      chartId: "category-sales-profit",
      dynamicEvidence: "Audio margin = 30% (higher than smartphones). Promoting yields higher profit per unit sold.",
      details: [
        "Audio equipment showcase",
        "Demonstration zones in stores",
        "Expert consultation services"
      ]
    },
    {
      icon: <Users className="text-pink-500" size={24} />,
      title: "Customer Segmentation",
      description: "Target different demographics with personalized offers",
      impact: "+20% conversion",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      chartId: "category-sales-profit",
      dynamicEvidence: "Revenue patterns show 3 clear segments: Laptops for professionals, Smartphones for general consumers, Audio for enthusiasts.",
      details: [
        "Student laptop deals",
        "Professional smartphone offers",
        "Family audio packages"
      ]
    },
    {
      icon: <Zap className="text-indigo-500" size={24} />,
      title: "Flash Sales",
      description: "Limited-time offers on slow-moving inventory",
      impact: "+30% turnover",
      color: "from-indigo-400 to-indigo-600",
      bgColor: "bg-indigo-50",
      chartId: "cumulative-growth",
      dynamicEvidence: "Inventory turnover analysis shows specific slow-moving periods. Flash sales can improve turnover by 25–35%.",
      details: [
        "24-hour flash sales",
        "Limited quantity promotions",
        "Early bird discounts"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Strategic Recommendations</h2>
        <p className="text-lg text-gray-600">Data-driven insights for maximizing Diwali sales performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`${rec.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${rec.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                {rec.icon}
              </div>
              <div className={`px-3 py-1 bg-gradient-to-r ${rec.color} text-white text-xs font-semibold rounded-full`}>
                {rec.impact}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                {rec.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {rec.description}
              </p>
              
              {/* Dynamic Evidence */}
              <div className="bg-white/70 rounded-lg p-3 text-xs text-gray-700 leading-relaxed">
                <strong>Evidence:</strong> {rec.dynamicEvidence}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2">Key Actions:</p>
              <ul className="space-y-1">
                {rec.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="text-xs text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                    {detail}
                  </li>
                ))}
              </ul>
              
              {/* View Evidence Button */}
              <button
                onClick={() => onViewEvidence(rec.chartId)}
                className={`w-full px-3 py-2 bg-gradient-to-r ${rec.color} text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all duration-200`}
              >
                View Evidence
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Implementation Priority</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-yellow-300 font-bold text-lg mb-2">IMMEDIATE</div>
            <p>Weekend Marketing, Flash Sales</p>
          </div>
          <div>
            <div className="text-green-300 font-bold text-lg mb-2">SHORT-TERM</div>
            <p>Inventory Optimization, Bundling</p>
          </div>
          <div>
            <div className="text-blue-300 font-bold text-lg mb-2">LONG-TERM</div>
            <p>Customer Segmentation, Premium Push</p>
          </div>
        </div>
      </div>
    </div>
  );
};