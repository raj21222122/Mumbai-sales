import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { SalesRecord } from '../../types';
import { formatCurrency } from '../../utils/dataProcessor';
import { Play, Pause, RotateCcw } from 'lucide-react';

Chart.register(...registerables);

interface CumulativeChartProps {
  data: SalesRecord[];
}

export const CumulativeChart: React.FC<CumulativeChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Sort data by date and calculate cumulative values
    const sortedData = [...data].sort((a, b) => 
      new Date(a.Date.split('-').reverse().join('-')).getTime() - 
      new Date(b.Date.split('-').reverse().join('-')).getTime()
    );

    // Group by date and calculate daily totals
    const dailyData = sortedData.reduce((acc, record) => {
      const date = record.Date;
      if (!acc[date]) {
        acc[date] = { sales: 0, profit: 0 };
      }
      acc[date].sales += record.TotalSales_INR;
      acc[date].profit += record.Profit_INR;
      return acc;
    }, {} as Record<string, { sales: number; profit: number }>);

    const dates = Object.keys(dailyData).sort((a, b) => 
      new Date(a.split('-').reverse().join('-')).getTime() - 
      new Date(b.split('-').reverse().join('-')).getTime()
    );

    // Calculate cumulative values
    let cumulativeSales = 0;
    let cumulativeProfit = 0;
    const cumulativeData = dates.map(date => {
      cumulativeSales += dailyData[date].sales;
      cumulativeProfit += dailyData[date].profit;
      return {
        date,
        cumulativeSales,
        cumulativeProfit
      };
    });

    // Show data up to current index for animation
    const visibleData = cumulativeData.slice(0, currentIndex + 1);
    const labels = visibleData.map(d => d.date);
    const salesData = visibleData.map(d => d.cumulativeSales);
    const profitData = visibleData.map(d => d.cumulativeProfit);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Cumulative Sales (₹)',
            data: salesData,
            borderColor: 'rgba(0, 78, 146, 1)',
            backgroundColor: 'rgba(0, 78, 146, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 8,
          },
          {
            label: 'Cumulative Profit (₹)',
            data: profitData,
            borderColor: 'rgba(0, 168, 150, 1)',
            backgroundColor: 'rgba(0, 168, 150, 0.1)',
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
            text: 'Cumulative Sales & Profit Growth Over Time',
            font: { size: 16, weight: 'bold' }
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
                return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
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
              text: 'Cumulative Amount (₹)'
            },
            ticks: {
              callback: function(value) {
                return formatCurrency(value as number);
              }
            }
          }
        },
        animation: {
          duration: 0 // Disable default animation for manual control
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, currentIndex]);

  const handlePlay = () => {
    if (isPlaying) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const sortedData = [...data].sort((a, b) => 
        new Date(a.Date.split('-').reverse().join('-')).getTime() - 
        new Date(b.Date.split('-').reverse().join('-')).getTime()
      );
      
      const dailyData = sortedData.reduce((acc, record) => {
        const date = record.Date;
        if (!acc[date]) acc[date] = { sales: 0, profit: 0 };
        acc[date].sales += record.TotalSales_INR;
        acc[date].profit += record.Profit_INR;
        return acc;
      }, {} as Record<string, { sales: number; profit: number }>);

      const totalDays = Object.keys(dailyData).length;

      animationRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= totalDays - 1) {
            setIsPlaying(false);
            if (animationRef.current) clearInterval(animationRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 200);
    }
  };

  const handleReset = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  // Calculate final totals and insights
  const sortedData = [...data].sort((a, b) => 
    new Date(a.Date.split('-').reverse().join('-')).getTime() - 
    new Date(b.Date.split('-').reverse().join('-')).getTime()
  );
  
  const totalSales = data.reduce((sum, record) => sum + record.TotalSales_INR, 0);
  const totalProfit = data.reduce((sum, record) => sum + record.Profit_INR, 0);
  const finalDate = sortedData[sortedData.length - 1]?.Date || '';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={handlePlay}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>
      
      <div className="h-96">
        <canvas ref={chartRef}></canvas>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
        <p>
          <strong>Cumulative Growth Summary:</strong> Cumulative Sales reached {formatCurrency(totalSales)} 
          and Cumulative Profit {formatCurrency(totalProfit)} by {finalDate}. 
          The steepest growth periods indicate high-demand phases ideal for Diwali planning.
        </p>
      </div>
    </div>
  );
};