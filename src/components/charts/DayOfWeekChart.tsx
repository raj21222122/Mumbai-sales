import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { SalesRecord } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/dataProcessor';

Chart.register(...registerables);

interface DayOfWeekChartProps {
  data: SalesRecord[];
  onDayClick?: (day: string) => void;
}

export const DayOfWeekChart: React.FC<DayOfWeekChartProps> = ({ data, onDayClick }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Define day order
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Aggregate data by day of week
    const dayData = data.reduce((acc, record) => {
      const day = record.DayOfWeek;
      if (!acc[day]) {
        acc[day] = { sales: 0, profit: 0, units: 0, count: 0 };
      }
      acc[day].sales += record.TotalSales_INR;
      acc[day].profit += record.Profit_INR;
      acc[day].units += record.UnitsSold;
      acc[day].count += 1;
      return acc;
    }, {} as Record<string, { sales: number; profit: number; units: number; count: number }>);

    // Calculate global max for fixed Y-axis
    const globalMaxSales = Math.max(...Object.values(dayData).map(d => d.sales));
    const yAxisMax = Math.ceil(globalMaxSales * 1.1 / 1000000) * 1000000; // Round up to nearest million

    // Order data by day of week
    const orderedData = dayOrder.map(day => ({
      day,
      sales: dayData[day]?.sales || 0,
      profit: dayData[day]?.profit || 0,
      units: dayData[day]?.units || 0,
      avgRevenue: dayData[day] ? dayData[day].sales / dayData[day].count : 0
    }));

    const labels = orderedData.map(d => d.day);
    const salesData = orderedData.map(d => d.sales);
    const profitData = orderedData.map(d => d.profit);

    // Day colors - blue variations with weekend highlight
    const dayColors = dayOrder.map(day => {
      if (day === 'Saturday' || day === 'Sunday') {
        return 'rgba(66, 134, 244, 0.9)'; // Brighter blue for weekends
      }
      return 'rgba(0, 78, 146, 0.7)'; // Standard blue for weekdays
    });

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Daily Sales (₹)',
            data: salesData,
            backgroundColor: dayColors,
            borderColor: dayColors.map(color => color.replace('0.7', '1').replace('0.9', '1')),
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Day-of-Week Sales Comparison (Fixed Scale)',
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
                const dayInfo = orderedData[index];
                
                return [
                  `Total Profit: ${formatCurrency(dayInfo.profit)}`,
                  `Units Sold: ${formatNumber(dayInfo.units)}`,
                  `Avg Revenue per Transaction: ${formatCurrency(dayInfo.avgRevenue)}`
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
              text: 'Day of Week'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Sales (₹)'
            },
            min: 0,
            max: yAxisMax,
            ticks: {
              callback: function(value) {
                return formatCurrency(value as number);
              }
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0 && onDayClick) {
            const index = elements[0].index;
            const day = labels[index];
            onDayClick(day);
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, onDayClick]);

  return (
    <div className="h-96">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};