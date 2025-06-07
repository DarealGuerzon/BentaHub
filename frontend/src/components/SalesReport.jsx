import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const fetchSales = async () => {
    try {
      const response = await axiosInstance.get('/sales');
      setSales(response.data);
      setError('');
      
      // Calculate totals
      const total = response.data.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const items = response.data.reduce((sum, sale) => sum + sale.items.length, 0);
      setTotalSales(total);
      setTotalItems(items);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Sales Report</h1>
            <p className="mt-2 text-slate-600">View your sales history and statistics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-600">Total Sales</p>
              <p className="mt-1 text-2xl font-semibold text-blue-600">₱{totalSales.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-600">Total Items Sold</p>
              <p className="mt-1 text-2xl font-semibold text-blue-600">{totalItems}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
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
        )}

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Items</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {new Date(sale.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(sale.date).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {sale.items.map((item, index) => (
                          <div key={index} className="text-sm text-slate-900">
                            {item.name} x {item.quantity} - ₱{item.price}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">₱{sale.totalAmount.toFixed(2)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
