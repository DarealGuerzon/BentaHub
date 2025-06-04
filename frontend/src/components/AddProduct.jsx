import React, { useState } from 'react';
import axios from 'axios';

export default function AddProduct({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/products/add', { name, price, quantity })
      .then(() => {
        setName('');
        setPrice(0);
        setQuantity(0);
        alert('Product added successfully!');
        if (onProductAdded) {
          onProductAdded();  // Refresh products list in parent
        }
      })
      .catch((error) => {
        alert('Failed to add product');
        console.error('Add product error:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Product</h1>
      <label>Name:</label>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
      
      <label>Price:</label>
      <input 
        type="number" 
        value={price} 
        onChange={(e) => setPrice(Number(e.target.value))} 
        required 
      />
      
      <label>Quantity:</label>
      <input 
        type="number" 
        value={quantity} 
        onChange={(e) => setQuantity(Number(e.target.value))} 
        required 
      />
      
      <button type="submit">Add</button>
    </form>
  );
}
