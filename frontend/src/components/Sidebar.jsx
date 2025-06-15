import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-800 text-white">
      <div className="flex h-20 items-center justify-center border-b border-gray-700">
        <h2 className="text-2xl font-bold">BentaHub</h2>
      </div>
      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className={`block rounded-lg px-4 py-2 text-lg font-medium ${
                isActive('/') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/inventory"
              className={`block rounded-lg px-4 py-2 text-lg font-medium ${
                isActive('/inventory') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Inventory
            </Link>
          </li>
          <li>
            <Link
              to="/add-product"
              className={`block rounded-lg px-4 py-2 text-lg font-medium ${
                isActive('/add-product') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </Link>
          </li>
          <li>
            <Link
              to="/sales-report"
              className={`block rounded-lg px-4 py-2 text-lg font-medium ${
                isActive('/sales-report') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Sales Report
            </Link>
          </li>
          <li>
            <Link
              to="/sales-analytics"
              className={`block rounded-lg px-4 py-2 text-lg font-medium ${
                isActive('/sales-analytics') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Sales Analytics
            </Link>
          </li>
          <li>
            <Link
              to="/receipt-history"
              className={`block rounded-lg px-4 py-2 text-lg font-medium ${
                isActive('/receipt-history') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Receipt History
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-lg font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}