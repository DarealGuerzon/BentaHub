import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
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
              className="block rounded-lg px-4 py-2 text-lg font-medium hover:bg-gray-700"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/inventory"
              className="block rounded-lg px-4 py-2 text-lg font-medium hover:bg-gray-700"
            >
              Inventory
            </Link>
          </li>
          <li>
            <Link
              to="/add-product"
              className="block rounded-lg px-4 py-2 text-lg font-medium hover:bg-gray-700"
            >
              Add Product
            </Link>
          </li>
          <li>
            <Link
              to="/sales-report"
              className="block rounded-lg px-4 py-2 text-lg font-medium hover:bg-gray-700"
            >
              Sales Report
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