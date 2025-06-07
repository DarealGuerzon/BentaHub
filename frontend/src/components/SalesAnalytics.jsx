import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesAnalytics() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('week');

  const fetchSalesData = async () => {
    try {
      console.log('=== SalesAnalytics: Fetching sales data ===');
      console.log('Making request to /sales');
      
      const response = await axiosInstance.get('/sales');
      console.log('Response received:', response);
      console.log('Response data:', response.data);
      setSales(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError(error.response?.data?.message || 'Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('SalesAnalytics component mounted');
    fetchSalesData();
  }, []);

  // Process data for charts
  const processSalesData = () => {
    console.log('Processing sales data:', sales);
    const salesByDate = {};
    const productSales = {};
    const categorySales = {};

    sales.forEach(sale => {
      // Process date-based sales
      const date = new Date(sale.date).toLocaleDateString();
      salesByDate[date] = (salesByDate[date] || 0) + sale.totalAmount;

      // Process product-based sales
      sale.items.forEach(item => {
        productSales[item.name] = (productSales[item.name] || 0) + (item.price * item.quantity);
        categorySales[item.category || 'Uncategorized'] = 
          (categorySales[item.category || 'Uncategorized'] || 0) + (item.price * item.quantity);
      });
    });

    console.log('Processed data:', { salesByDate, productSales, categorySales });
    return { salesByDate, productSales, categorySales };
  };

  const { salesByDate, productSales, categorySales } = processSalesData();

  // Chart configurations
  const lineChartData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: 'Daily Sales',
        data: Object.values(salesByDate),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(productSales).slice(0, 5),
    datasets: [
      {
        label: 'Product Sales',
        data: Object.values(productSales).slice(0, 5),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(categorySales),
    datasets: [
      {
        data: Object.values(categorySales),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Debug render
  console.log('Rendering SalesAnalytics component', {
    loading,
    error,
    salesCount: sales.length,
    hasSalesData: Object.keys(salesByDate).length > 0,
    hasProductData: Object.keys(productSales).length > 0,
    hasCategoryData: Object.keys(categorySales).length > 0,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Sales Analytics</h1>
            <p className="mt-2 text-slate-600">Visualize your sales data and trends</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Sales Trend Chart */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Sales Trend</h2>
            <div className="h-80">
              {Object.keys(salesByDate).length > 0 ? (
                <Line data={lineChartData} options={chartOptions} />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No sales data available
                </div>
              )}
            </div>
          </div>

          {/* Top Products Chart */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Top Selling Products</h2>
            <div className="h-80">
              {Object.keys(productSales).length > 0 ? (
                <Bar data={barChartData} options={chartOptions} />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No product sales data available
                </div>
              )}
            </div>
          </div>

          {/* Sales by Category Chart */}
          <div className="rounded-xl bg-white p-6 shadow-lg md:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Sales by Category</h2>
            <div className="mx-auto h-80 max-w-2xl">
              {Object.keys(categorySales).length > 0 ? (
                <Pie data={pieChartData} options={chartOptions} />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No category sales data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 