import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Inventory from './components/Inventory';
import AddProduct from './components/AddProduct';
import SalesReport from './components/SalesReport';
import Sidebar from './components/Sidebar';


export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [saleReceipt, setSaleReceipt] = useState(null);

  // Fetch products from backend on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Add product to cart or increase quantity
  const handleAddToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.productId === product._id);
      if (exists) {
        if (exists.quantity < product.quantity) { // stock check
          return prev.map(item =>
            item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          alert('No more stock available');
          return prev;
        }
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  // Checkout handler: send sale, update inventory, clear cart, save receipt
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    try {
      // Update inventory for each cart item
      for (const item of cart) {
        const res = await fetch('http://localhost:5000/api/products/reduce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
        });
        if (!res.ok) throw new Error('Error updating inventory');
      }

      // Prepare sale data
      const saleItems = cart.map(({ productId, name, quantity, price }) => ({
        productId,
        name,
        quantity,
        price,
      }));
      const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

      // Add sale record
      const saleRes = await fetch('http://localhost:5000/api/sales/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: saleItems, totalAmount }),
      });

      if (!saleRes.ok) throw new Error('Error recording sale');
      const saleData = await saleRes.json();

      setSaleReceipt(saleData);
      setCart([]);

      // Refresh products stock after sale
      const productsRes = await axios.get('http://localhost:5000/api/products');
      setProducts(productsRes.data);

      alert('Sale successful! Receipt is shown below.');

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  products={products}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                  onCheckout={handleCheckout}
                  saleReceipt={saleReceipt}
                />
              }
            />
            <Route path="/inventory" element={<Inventory onAddToCart={handleAddToCart} />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/sales-report" element={<SalesReport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
