import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { SalesRecord } from '../../types';

Chart.register(...registerables);

interface ScatterChartProps {
  data: SalesRecord[];
  title: string;
}

export const ScatterChart: React.FC<ScatterChartProps> = ({ data, title }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Group data by category
    const categoryData = data.reduce((acc, record) => {
      const category = record.ProductCategory;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        x: record.TotalSales_INR,
        y: record.ProfitMargin,
        r: record.UnitsSold / 2, // Bubble size based on units sold
        label: `${record.StoreLocation} - ${record.ProductCategory}`,
        units: record.UnitsSold,
        revenue: record.TotalSales_INR,
        profit: record.Profit_INR
      });
      return acc;
    }, {} as Record<string, any[]>);

    const colors = {
      'Smartphones': 'rgba(59, 130, 246, 0.7)',
      'Laptops': 'rgba(168, 85, 247, 0.7)',
      'Audio': 'rgba(34, 197, 94, 0.7)',
      'Accessories': 'rgba(249, 115, 22, 0.7)'
    };

    const datasets = Object.entries(categoryData).map(([category, points]) => ({
      label: category,
      data: points,
      backgroundColor: colors[category as keyof typeof colors] || 'rgba(156, 163, 175, 0.7)',
      borderColor: colors[category as keyof typeof colors]?.replace('0.7', '1') || 'rgba(156, 163, 175, 1)',
      borderWidth: 2
    }));

    chartInstance.current = new Chart(ctx, {
      type: 'bubble',
      data: { datasets },
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
            display: true,
            position: 'top'
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].raw.label;
              },
              label: function(context) {
                const point = context.raw as any;
                return [
                  `Revenue: ₹${point.revenue.toLocaleString('en-IN')}`,
                  `Profit Margin: ${point.y.toFixed(1)}%`,
                  `Units Sold: ${point.units}`
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
              text: 'Revenue (₹)'
            },
            ticks: {
              callback: function(value) {
                return '₹' + (value as number).toLocaleString('en-IN');
              }
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Profit Margin (%)'
            },
            ticks: {
              callback: function(value) {
                return (value as number).toFixed(1) + '%';
              }
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutElastic'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="h-96">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="mt-4 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
        <strong>💡 Insight:</strong> High-volume products (smartphones) show moderate margins, while accessories offer excellent margins despite lower volumes. Bundle strategies can optimize both metrics for Diwali sales.
      </div>
    </div>
  );
};