import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { SalesRecord } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/dataProcessor';

Chart.register(...registerables);

interface CategoryChartProps {
  data: SalesRecord[];
  onCategoryClick?: (category: string) => void;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data, onCategoryClick }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Aggregate data by category
    const categoryData = data.reduce((acc, record) => {
      const category = record.ProductCategory;
      if (!acc[category]) {
        acc[category] = { sales: 0, profit: 0, units: 0, records: [] };
      }
      acc[category].sales += record.TotalSales_INR;
      acc[category].profit += record.Profit_INR;
      acc[category].units += record.UnitsSold;
      acc[category].records.push(record);
      return acc;
    }, {} as Record<string, { sales: number; profit: number; units: number; records: SalesRecord[] }>);

    const totalRevenue = Object.values(categoryData).reduce((sum, cat) => sum + cat.sales, 0);
    
    // Sort by sales descending
    const sortedCategories = Object.entries(categoryData)
      .sort(([,a], [,b]) => b.sales - a.sales);

    const labels = sortedCategories.map(([category]) => category);
    const salesData = sortedCategories.map(([,data]) => data.sales);
    const profitData = sortedCategories.map(([,data]) => data.profit);

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Sales (₹)',
            data: salesData,
            backgroundColor: 'rgba(0, 78, 146, 0.8)',
            borderColor: 'rgba(0, 78, 146, 1)',
            borderWidth: 2,
            yAxisID: 'y',
          },
          {
            label: 'Total Profit (₹)',
            data: profitData,
            backgroundColor: 'rgba(0, 168, 150, 0.8)',
            borderColor: 'rgba(0, 168, 150, 1)',
            borderWidth: 2,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Category-wise Sales vs Profit Analysis',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            callbacks: {
              afterBody: function(tooltipItems) {
                const index = tooltipItems[0].dataIndex;
                const [category, data] = sortedCategories[index];
                const avgMargin = (data.profit / data.sales) * 100;
                const revenueShare = (data.sales / totalRevenue) * 100;
                
                return [
                  `Units Sold: ${formatNumber(data.units)}`,
                  `Avg Profit Margin: ${avgMargin.toFixed(1)}%`,
                  `% of Total Revenue: ${revenueShare.toFixed(1)}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Product Category'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Sales (₹)',
              color: 'rgba(0, 78, 146, 1)'
            },
            ticks: {
              callback: function(value) {
                return formatCurrency(value as number);
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Profit (₹)',
              color: 'rgba(0, 168, 150, 1)'
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function(value) {
                return formatCurrency(value as number);
              }
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0 && onCategoryClick) {
            const index = elements[0].index;
            const category = labels[index];
            onCategoryClick(category);
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, onCategoryClick]);

  return (
    <div className="h-96">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};