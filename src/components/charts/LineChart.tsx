import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { SalesRecord } from '../../types';

Chart.register(...registerables);

interface LineChartProps {
  data: SalesRecord[];
  title: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Process data for line chart
    const sortedData = [...data].sort((a, b) => new Date(a.Date.split('-').reverse().join('-')).getTime() - new Date(b.Date.split('-').reverse().join('-')).getTime());
    
    // Aggregate data by date
    const aggregatedData = sortedData.reduce((acc, record) => {
      const date = record.Date;
      if (!acc[date]) {
        acc[date] = { sales: 0, profit: 0, units: 0 };
      }
      acc[date].sales += record.TotalSales_INR;
      acc[date].profit += record.Profit_INR;
      acc[date].units += record.UnitsSold;
      return acc;
    }, {} as Record<string, { sales: number; profit: number; units: number }>);

    const dates = Object.keys(aggregatedData);
    const sales = Object.values(aggregatedData).map(d => d.sales);
    const profits = Object.values(aggregatedData).map(d => d.profit);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Total Sales (₹)',
            data: sales,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 8,
          },
          {
            label: 'Profit (₹)',
            data: profits,
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 8,
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
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN');
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Amount (₹)'
            },
            ticks: {
              callback: function(value) {
                return '₹' + (value as number).toLocaleString('en-IN');
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
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
      <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>💡 Insight:</strong> Sales peaks are observed during weekends, particularly on Saturdays and Sundays. Focus Diwali marketing campaigns on Friday-Sunday for maximum impact.
      </div>
    </div>
  );
};