import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { SalesRecord } from '../../types';

Chart.register(...registerables);

interface BarChartProps {
  data: SalesRecord[];
  title: string;
  groupBy: 'store' | 'category';
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, groupBy }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Aggregate data
    const aggregatedData = data.reduce((acc, record) => {
      const key = groupBy === 'store' ? record.StoreLocation : record.ProductCategory;
      if (!acc[key]) {
        acc[key] = { sales: 0, profit: 0, units: 0 };
      }
      acc[key].sales += record.TotalSales_INR;
      acc[key].profit += record.Profit_INR;
      acc[key].units += record.UnitsSold;
      return acc;
    }, {} as Record<string, { sales: number; profit: number; units: number }>);

    const sortedEntries = Object.entries(aggregatedData).sort(([,a], [,b]) => b.sales - a.sales);
    const labels = sortedEntries.map(([key]) => key);
    const sales = sortedEntries.map(([,value]) => value.sales);
    const profits = sortedEntries.map(([,value]) => value.profit);

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(249, 115, 22, 0.8)',
      'rgba(236, 72, 153, 0.8)'
    ];

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue (₹)',
            data: sales,
            backgroundColor: labels.map((_, index) => colors[index % colors.length]),
            borderColor: labels.map((_, index) => colors[index % colors.length].replace('0.8', '1')),
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            callbacks: {
              afterBody: function(tooltipItems) {
                const index = tooltipItems[0].dataIndex;
                const profit = profits[index];
                return 'Profit: ₹' + profit.toLocaleString('en-IN');
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: groupBy === 'store' ? 'Store Location' : 'Product Category'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Revenue (₹)'
            },
            ticks: {
              callback: function(value) {
                return '₹' + (value as number).toLocaleString('en-IN');
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutBounce'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title, groupBy]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="h-96">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="mt-4 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
        <strong>💡 Insight:</strong> {groupBy === 'store' 
          ? 'Andheri and Bandra stores contribute the highest revenue. Focus inventory and marketing efforts on these locations for Diwali.'
          : 'Smartphones dominate sales volume, while accessories offer higher profit margins. Perfect for bundling strategies.'}
      </div>
    </div>
  );
};