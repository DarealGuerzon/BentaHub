import React, { useEffect, useState } from 'react';

export default function SalesReport() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sales')
      .then(res => res.json())
      .then(data => setSales(data));
  }, []);

  return (
    <div>
      <h2>Sales Report</h2>
      {sales.length === 0 ? (
        <p>No sales yet</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr><th>Date</th><th>Items</th><th>Total Amount</th></tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale._id}>
                <td>{new Date(sale.date).toLocaleString()}</td>
                <td>
                  {sale.items.map(i => (
                    <div key={i.productId}>{i.name} x{i.quantity}</div>
                  ))}
                </td>
                <td>₱{sale.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
