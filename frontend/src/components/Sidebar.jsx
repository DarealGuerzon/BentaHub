import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>BentaHub</h2>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/add-product">Add Product</Link></li>
          <li><Link to="/sales-report">Sales Report</Link></li>
        </ul>
      </nav>
    </div>
  );
}
