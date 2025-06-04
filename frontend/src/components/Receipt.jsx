import React, { useEffect, useRef } from 'react';

export default function Receipt({ sale, onClose }) {
  const printRef = useRef();

  useEffect(() => {
    if (sale) {
      setTimeout(() => window.print(), 500);
    }
  }, [sale]);

  if (!sale) return null;

  return (
    <div ref={printRef} style={{ padding: '20px', border: '1px solid #000' }}>
      <h2>Receipt</h2>
      <p>Date: {new Date(sale.date).toLocaleString()}</p>
      <table border="1" cellPadding="10">
        <thead>
          <tr><th>Name</th><th>Quantity</th><th>Price</th></tr>
        </thead>
        <tbody>
          {sale.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>₱{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total: ₱{sale.totalAmount.toFixed(2)}</h3>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
