import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Inventory({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [stockInputs, setStockInputs] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  const handleStockChange = (id, value) => {
    setStockInputs({ ...stockInputs, [id]: value });
  };

  const handleAddStock = async (id) => {
    const addedQuantity = Number(stockInputs[id]);

    if (isNaN(addedQuantity) || addedQuantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/products/add-stock/${id}`, {
        addedQuantity,
      });
      alert("Stock updated!");
      setStockInputs({ ...stockInputs, [id]: '' });
      fetchProducts();
    } catch (err) {
      alert("Failed to update stock.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Inventory</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Quantity</th><th>Add Stock</th><th>Add to Cart</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price.toFixed(2)}</td>
              <td>{p.quantity}</td>
              <td>
                <input
                  type="number"
                  placeholder="Add stock"
                  value={stockInputs[p._id] || ''}
                  onChange={(e) => handleStockChange(p._id, e.target.value)}
                  style={{ width: '60px' }}
                />
                <button onClick={() => handleAddStock(p._id)}>Add</button>
              </td>
              <td>
                <button
                  disabled={p.quantity === 0}
                  onClick={() => onAddToCart(p)}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}