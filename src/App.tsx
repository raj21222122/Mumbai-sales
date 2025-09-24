import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, BarChart3, TrendingUp } from 'lucide-react';
import { Stepper } from './components/Stepper';
import { KPICards } from './components/KPICards';
import { FilterPanel } from './components/FilterPanel';
import { LineChart } from './components/charts/LineChart';
import { BarChart } from './components/charts/BarChart';
import { ScatterChart } from './components/charts/ScatterChart';
import { BusinessSimulator } from './components/BusinessSimulator';
import { RecommendationCards } from './components/RecommendationCards';
import { InsightsSection } from './components/InsightsSection';
import { parseCSVData, calculateKPIs, applyFilters } from './utils/dataProcessor';
import { SalesRecord, KPIData } from './types';

// Import CSV data
import csvData from './data/mumbaielectronics.csv?raw';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<SalesRecord[]>([]);
  const [filteredData, setFilteredData] = useState<SalesRecord[]>([]);
  const [kpiData, setKpiData] = useState<KPIData>({
    totalRevenue: 0,
    totalUnitsSold: 0,
    totalProfit: 0,
    topStore: '',
    topCategory: ''
  });
  const [filters, setFilters] = useState({
    store: 'all',
    category: 'all',
    month: 'all',
    dayOfWeek: 'all',
    profitRange: [0, 100] as [number, number]
  });
  const [showCumulative, setShowCumulative] = useState(false);

  useEffect(() => {
    const parsedData = parseCSVData(csvData);
    setData(parsedData);
    setFilteredData(parsedData);
    setKpiData(calculateKPIs(parsedData));
  }, []);

  useEffect(() => {
    const filtered = applyFilters(data, filters);
    setFilteredData(filtered);
    setKpiData(calculateKPIs(filtered));
  }, [filters, data]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      store: 'all',
      category: 'all',
      month: 'all',
      dayOfWeek: 'all',
      profitRange: [0, 100]
    });
  };

  const handleViewEvidence = (chartId: string) => {
    // Scroll to specific chart in insights section
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
      chartElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToRecommendations = () => {
    const recommendationsSection = document.getElementById('recommendations-section');
    if (recommendationsSection) {
      recommendationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleDayFilter = (day: string) => {
    setFilters(prev => ({ ...prev, dayOfWeek: day }));
  };

  const exportToPDF = () => {
    window.print();
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + csvData;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mumbai_electronics_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Dataset Overview & Cleaning</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Dataset Shape</h3>
                  <p className="text-2xl font-bold text-blue-600">{data.length} records</p>
                  <p className="text-sm text-gray-600">8 columns of sales data</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Data Quality</h3>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-sm text-gray-600">No missing values</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Time Period</h3>
                  <p className="text-lg font-bold text-purple-600">Q3 / 2023</p>
                  <p className="text-sm text-gray-600">July - September</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sample Data (First 5 Records)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(data[0] || {}).map(key => (
                          <th key={key} className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 5).map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(record).map((value, valueIndex) => (
                            <td key={valueIndex} className="border border-gray-300 px-4 py-2">
                              {typeof value === 'number' && value > 1000 
                                ? value.toLocaleString('en-IN')
                                : String(value)
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Derived Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-700">• Profit Margin = (Profit / Revenue) × 100</p>
                    <p className="text-sm text-gray-600">Measures profitability percentage</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">• Revenue Per Unit = Revenue ÷ Units Sold</p>
                    <p className="text-sm text-gray-600">Average selling price per item</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Sales Trends Over Time</h2>
            <LineChart data={filteredData} title="Revenue and Profit Trends" />
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Store Performance Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BarChart data={filteredData} title="Revenue by Store" groupBy="store" />
              <BarChart data={filteredData} title="Revenue by Category" groupBy="category" />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Product Category Analysis</h2>
            <BarChart data={filteredData} title="Product Category Performance" groupBy="category" />
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Category Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">High Volume Categories</h4>
                  <p className="text-sm text-gray-600">Smartphones and Laptops dominate unit sales but offer moderate margins.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">High Margin Categories</h4>
                  <p className="text-sm text-gray-600">Audio and Accessories provide excellent profit margins with consistent demand.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Profitability vs Sales Analysis</h2>
            <ScatterChart data={filteredData} title="Revenue vs Profit Margin (Bubble = Units Sold)" />
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Business Investment Simulator</h2>
            <BusinessSimulator data={data} filteredData={filteredData} />
          </div>
        );

      case 7:
        return (
          <div className="space-y-8">
            <RecommendationCards data={filteredData} onViewEvidence={handleViewEvidence} />
            <InsightsSection 
              data={filteredData}
              onCategoryFilter={handleCategoryFilter}
              onDayFilter={handleDayFilter}
            />
          </div>
        );

      case 8:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-white text-center">
              <h2 className="text-4xl font-bold mb-6">Mission Accomplished! 🎉</h2>
              <p className="text-xl mb-8 opacity-90">
                This comprehensive dashboard has transformed Mumbai Electronics' raw data into actionable insights for Diwali sales.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <h3 className="text-lg font-bold mb-2">Data-Driven Insights</h3>
                  <p className="text-sm opacity-80">96 records analyzed across multiple dimensions</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-300" />
                  <h3 className="text-lg font-bold mb-2">Strategic Recommendations</h3>
                  <p className="text-sm opacity-80">6 actionable strategies for revenue optimization</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-400 rounded-full flex items-center justify-center">
                    🎯
                  </div>
                  <h3 className="text-lg font-bold mb-2">Implementation Ready</h3>
                  <p className="text-sm opacity-80">Prioritized action plan with measurable outcomes</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {/* The "Export Report" button is now a hyperlink to your Google Drive PDF */}
                <a
                  href="https://drive.google.com/file/d/1Po9pMSXj1YP4_7lV36OkxKWyYRUjSvBb/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>Export Report</span>
                </a>
                
                <button
                  onClick={downloadCSV}
                  className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 flex items-center space-x-2"
                >
                  <ExternalLink size={20} />
                  <span>Download Data</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                <strong>Academic Project by:</strong> Rajdeep Kumar<br/>
                <strong>Registration Number:</strong> 2024SEPVUGP0042<br/>
                <strong>Course:</strong> Data Visualization & Analytics (DVA)
              </p>
              <p className="text-sm text-gray-500">
                This dashboard demonstrates the power of interactive data visualization in transforming complex datasets into actionable business intelligence.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mumbai Electronics
              </h1>
              <p className="text-xl text-gray-600 mt-2">Sales Dashboard</p>
              <p className="text-sm text-gray-500 mt-1">
                Explore last quarter sales and uncover insights for Diwali planning
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Created by: Rajdeep Kumar</p>
              <p className="text-xs text-gray-500">Reg No: 2024SEPVUGP0042</p>
              <p className="text-xs text-gray-500">Course: Data Visualization & Analytics</p>
              <a 
                href="https://drive.google.com/file/d/1zH1k_z0yC7-ti6cTDNn9qdQ5CDoAcT03/view?usp=drive_link" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 text-xs"
              >
                <ExternalLink size={12} className="mr-1" />
                Download: Python Analysis (Detailed)
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <KPICards kpiData={kpiData} />
        
        {/* Dataset Info */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mb-8 text-center">
          <p className="text-gray-700">
            <strong>Dataset Overview:</strong> This dataset covers {data.length} sales records from Mumbai stores 
            during the last quarter (July-September 2023) across multiple product categories.
          </p>
        </div>

        {/* Stepper Navigation */}
        <Stepper currentStep={currentStep} onStepClick={setCurrentStep} />

        {/* Filters (show on most steps) */}
        {currentStep > 1 && currentStep < 8 && (
          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            data={data}
          />
        )}

        {/* Step Content */}
        <div className="min-h-screen">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-1'
            }`}
          >
            Previous Step
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(8, currentStep + 1))}
            disabled={currentStep === 8}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 8
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 transform hover:-translate-y-1'
            }`}
          >
            Next Step
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;