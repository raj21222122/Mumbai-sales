import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  filters: any;
  onFilterChange: (filterType: string, value: any) => void;
  onResetFilters: () => void;
  data: any[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onResetFilters, data }) => {
  const stores = [...new Set(data.map(record => record.StoreLocation))];
  const categories = [...new Set(data.map(record => record.ProductCategory))];
  const months = [...new Set(data.map(record => record.Month))];
  const daysOfWeek = [...new Set(data.map(record => record.DayOfWeek))];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
        >
          <X size={16} />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Store Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
          <select
            value={filters.store}
            onChange={(e) => onFilterChange('store', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Stores</option>
            {stores.map(store => (
              <option key={store} value={store}>{store}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <select
            value={filters.month}
            onChange={(e) => onFilterChange('month', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Months</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Day of Week Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
          <select
            value={filters.dayOfWeek}
            onChange={(e) => onFilterChange('dayOfWeek', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Days</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        {/* Profit Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Profit %</label>
          <input
            type="number"
            value={filters.profitRange[0]}
            onChange={(e) => onFilterChange('profitRange', [parseFloat(e.target.value), filters.profitRange[1]])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Profit %</label>
          <input
            type="number"
            value={filters.profitRange[1]}
            onChange={(e) => onFilterChange('profitRange', [filters.profitRange[0], parseFloat(e.target.value)])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );
};